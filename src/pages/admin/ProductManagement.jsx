import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Package, Plus, Edit, Trash2, Search, ImagePlus, Upload, Filter, X, ArrowLeft } from 'lucide-react';
import { AppRoutes } from '../../config/routes';
import ProductVariantEditor from '../../components/admin/ProductVariantEditor';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '../../config/categories';

function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    price: '', 
    image: '', 
    badge: '', 
    category: '', 
    brand: '', 
    sku: '', 
    specs: '[]', 
    variants: [],
    stock: 0
  });
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Admin filters
  const [showUnpublishedOnly, setShowUnpublishedOnly] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Creation wizard state
  const [createStep, setCreateStep] = useState(1); // 1 = details, 2 = images
  const [createdProductId, setCreatedProductId] = useState(null);
  const [uploadFiles, setUploadFiles] = useState([]); // File[]
  const [uploadUrls, setUploadUrls] = useState(['']); // string[]
  const [isUploading, setIsUploading] = useState(false);

  const [total, setTotal] = useState(0);



  useEffect(() => { fetchProducts(); }, [showUnpublishedOnly, page, limit]);

  const clearMessages = () => { setErrorMessage(null); setSuccessMessage(null); };

  const fetchProducts = async () => {
    clearMessages(); setLoading(true);
    try {
      const params = { page, limit, search: searchTerm };
      const data = showUnpublishedOnly
        ? await productService.getAdminUnpublishedProducts(params)
        : await productService.getAdminProducts(params);
      const items = Array.isArray(data) ? data : (data?.items || []);
      setProducts(items);
      if (data && typeof data.total === 'number') setTotal(data.total);
    } catch (error) {
      console.error('Error fetching products:', error);
      setErrorMessage('Failed to fetch products.');
      setProducts([]);
      setTotal(0);
    } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    clearMessages();
    if (window.confirm('Are you sure you want to delete this product?')) {
      try { await productService.deleteProduct(id); fetchProducts(); setSuccessMessage('Product deleted successfully!'); }
      catch (error) { console.error('Error deleting product:', error); setErrorMessage('Failed to delete product.'); }
    }
  };

  const handleCreateDetails = async (e) => {
    e.preventDefault(); 
    clearMessages();
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description || '',
        price: Number(newProduct.price),
        currency: 'USDT',
        images: [],
        published: false,
        badge: newProduct.badge?.trim() || null,
        category: newProduct.category?.trim() || null,
        brand: newProduct.brand?.trim() || null,
        sku: newProduct.sku?.trim() || null,
        specs: safeParseArray(newProduct.specs),
        variants: Array.isArray(newProduct.variants) ? newProduct.variants : safeParseArray(newProduct.variants),
        stock: Number(newProduct.stock || 0),
      };
      
      const created = await productService.createProduct(payload);
      setCreatedProductId(created._id);
      setCreateStep(2);
      setSuccessMessage('Product created. Please upload up to 10 images before publishing.');
    } catch (error) {
      console.error('Error creating product:', error);
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to create product.';
      setErrorMessage(errorMsg);
    }
  };

  const safeParseArray = (val) => {
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val || '[]') : Array.isArray(val) ? val : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const canUploadMore = (filesLen, urlsArr) => filesLen + urlsArr.filter(Boolean).length < 10;

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    const allowed = 10 - (uploadFiles.length + uploadUrls.filter(Boolean).length);
    if (allowed <= 0) return;
    setUploadFiles(prev => [...prev, ...files.slice(0, allowed)]);
  };

  const handleAddUrlField = () => {
    if (!canUploadMore(uploadFiles.length, uploadUrls)) return;
    setUploadUrls(prev => [...prev, '']);
  };

  const handleUrlChange = (idx, value) => {
    setUploadUrls(prev => prev.map((u, i) => (i === idx ? value : u)));
  };

  const handleRemoveUrlField = (idx) => {
    setUploadUrls(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUploadImages = async () => {
    if (!createdProductId) return;
    clearMessages(); setIsUploading(true);
    try {
      if (uploadFiles.length > 0) {
        await productService.uploadImages(createdProductId, uploadFiles);
      }
      const urls = uploadUrls.filter(Boolean);
      if (urls.length > 0) {
        await productService.appendImageUrls(createdProductId, urls);
      }
      setSuccessMessage('Images uploaded successfully!');
      setCreateStep(1);
      setCreatedProductId(null);
      setUploadFiles([]);
      setUploadUrls(['']);
      setNewProduct({ name: '', description: '', price: '', image: '', badge: '', category: '', brand: '', sku: '', specs: '[]', stock: 0, outOfStock: true });
      fetchProducts();
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrorMessage('Failed to upload images.');
    } finally { setIsUploading(false); }
  };



  const togglePublish = async (product) => {
    clearMessages();
    const hasImages = Array.isArray(product?.images) && product.images.length > 0;
    const next = !product.published;
    if (next && !hasImages) {
      setErrorMessage('At least one image is required before publishing.');
      return;
    }
    try {
      await productService.setPublishStatus(product._id, next);
      setSuccessMessage(`Product ${next ? 'published' : 'unpublished'} successfully!`);
      fetchProducts();
    } catch (error) {
      console.error('Error toggling publish:', error);
      setErrorMessage('Failed to update publish status.');
    }
  };

  const filteredProducts = (products || []).filter(product =>
    (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product?.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Helper for status badge
  const StatusBadge = ({ published }) => (
    <span className={`px-2 py-0.5 rounded-full text-xs ${published ? 'bg-successs-300/15 text-successs-200 border border-successs-300/30' : 'bg-warningw-300/10 text-warningw-200 border border-warningw-300/30'}`}>
      {published ? 'Published' : 'Unpublished'}
    </span>
  );

  // Unique publish knob
  const PublishKnob = ({ checked, onChange }) => (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 border ${checked ? 'bg-successs-300/30 border-successs-300/50' : 'bg-neutralneutral-700 border-neutralneutral-600'}`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full transition-transform duration-300 shadow ${checked ? 'translate-x-6 bg-successs-300' : 'translate-x-1 bg-neutralneutral-400'}`}
      />
      <span className="absolute inset-0 -z-10 rounded-full bg-gradient-to-r from-primaryp-400/0 via-secondarys-400/10 to-successs-300/0" />
    </button>
  );

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-secondarys-100/10 rounded-full flex items-center justify-center">
                <Package size={24} className="text-secondarys-400" />
              </div>
              <div>
                <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">Product Management</h1>
                <p className="text-neutralneutral-300">Manage your product catalog</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(AppRoutes.admin.path)}
              className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutralneutral-400" size={16} />
              <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search products" className="w-full pl-9 pr-3 py-2 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-500" />
            </div>
            <Button variant="outline" className={`border-neutralneutral-600 text-neutralneutral-300 ${showUnpublishedOnly ? 'bg-neutralneutral-800' : ''}`} onClick={() => { setShowUnpublishedOnly(v => !v); setPage(1); }}>
              <Filter size={16} className="mr-2" /> {showUnpublishedOnly ? 'Showing: Unpublished' : 'Showing: All'}
            </Button>
          </div>

          {/* Messages */}
          {errorMessage && (<Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400"><p className="text-dangerd-400">{errorMessage}</p></Card>)}
          {successMessage && (<Card className="p-4 mb-6 bg-successs-100/10 border-successs-400"><p className="text-successs-400">{successMessage}</p></Card>)}

          {/* Create New Product Wizard */}
          <Card className="p-6 mb-6 bg-neutralneutral-800 border-neutralneutral-700">
            <div className="flex items-center gap-2 mb-6">
              <Plus size={20} className="text-primaryp-400" />
              <h2 className="text-xl font-heading-header-3-header-3-bold text-white">Create New Product</h2>
            </div>

            {createStep === 1 && (
              <form onSubmit={handleCreateDetails} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" required />
                  <input type="number" placeholder="Price (USDT)" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" required />
                </div>
                <textarea placeholder="Product Description" value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" rows="3" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Badge (optional)" value={newProduct.badge} onChange={(e) => setNewProduct({ ...newProduct, badge: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-1">Category</label>
                    {newProduct.category && !PRODUCT_CATEGORIES.includes(newProduct.category) && newProduct.category !== 'Other' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProduct.category}
                          onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value || null })}
                          placeholder="Custom Category"
                          className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                        />
                        <Button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, category: null })}
                          variant="outline"
                          className="border-neutralneutral-600"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <select
                        value={newProduct.category || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'Other') {
                            setNewProduct({ ...newProduct, category: '' });
                          } else {
                            setNewProduct({ ...newProduct, category: value || null });
                          }
                        }}
                        className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                      >
                        <option value="">Select Category</option>
                        {PRODUCT_CATEGORIES.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div>
                    <label className="block text-neutralneutral-300 text-sm mb-1">Brand</label>
                    {newProduct.brand && !PRODUCT_BRANDS.includes(newProduct.brand) && newProduct.brand !== 'Custom' ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newProduct.brand}
                          onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value || null })}
                          placeholder="Custom Brand"
                          className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                        />
                        <Button
                          type="button"
                          onClick={() => setNewProduct({ ...newProduct, brand: null })}
                          variant="outline"
                          className="border-neutralneutral-600"
                        >
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <select
                        value={newProduct.brand || ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === 'Custom') {
                            setNewProduct({ ...newProduct, brand: '' });
                          } else {
                            setNewProduct({ ...newProduct, brand: value || null });
                          }
                        }}
                        className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                      >
                        <option value="">Select Brand</option>
                        {PRODUCT_BRANDS.map((brand) => (
                          <option key={brand} value={brand}>
                            {brand}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                  <input type="text" placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                </div>
                <div>
                  <ProductVariantEditor
                    variants={newProduct.variants}
                    onChange={(variants) => setNewProduct({ ...newProduct, variants })}
                    productPrice={Number(newProduct.price) || 0}
                  />
                </div>
                <div className="flex gap-3">
                  <Button type="submit" className="bg-secondarys-500 hover:bg-secondarys-400"><Plus size={16} className="mr-2" /> Continue to Images</Button>
                </div>
              </form>
            )}

            {createStep === 2 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <ImagePlus size={18} className="text-primaryp-400" />
                  <h3 className="text-lg text-white">Upload Images (up to 10)</h3>
                </div>
                <div className="text-neutralneutral-400 text-sm">Drag and drop files or paste image URLs. You must upload at least one image before the product can be published.</div>

                {/* Files uploader */}
                <div className="p-4 bg-neutralneutral-900 border border-neutralneutral-700 rounded-lg">
                  <input type="file" multiple accept="image/*" onChange={handleFilesSelected} className="block w-full text-neutralneutral-300" />
                  {uploadFiles.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 md:grid-cols-5 gap-3">
                      {uploadFiles.map((f, idx) => (
                        <div key={idx} className="h-24 bg-neutralneutral-800 rounded-lg flex items-center justify-center text-neutralneutral-400 text-xs px-2 text-center truncate">
                          {f.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* URL inputs */}
                <div className="p-4 bg-neutralneutral-900 border border-neutralneutral-700 rounded-lg space-y-2">
                  {uploadUrls.map((u, idx) => (
                    <div key={idx} className="flex gap-2">
                      <input value={u} onChange={(e) => handleUrlChange(idx, e.target.value)} placeholder="https://image-url" className="flex-1 p-2 bg-neutralneutral-800 border border-neutralneutral-700 rounded text-white placeholder-neutralneutral-500" />
                      <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => handleRemoveUrlField(idx)}>Remove</Button>
                    </div>
                  ))}
                  {canUploadMore(uploadFiles.length, uploadUrls) && (
                    <Button onClick={handleAddUrlField} className="bg-primaryp-500 hover:bg-primaryp-400"><Plus size={14} className="mr-2" /> Add another URL</Button>
                  )}
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleUploadImages} disabled={isUploading} className="bg-successs-500 hover:bg-successs-400"><Upload size={16} className="mr-2" /> {isUploading ? 'Uploading...' : 'Upload & Finish'}</Button>
                  <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => { setCreateStep(1); setCreatedProductId(null); }}>Back</Button>
                </div>
              </div>
            )}
          </Card>

          {/* Products List */}
          <Card className="p-6 bg-neutralneutral-800 border-neutralneutral-700">
            <div className="flex items-center justify-between mb-4">
              <div className="text-neutralneutral-200 font-medium flex items-center gap-2">
                {showUnpublishedOnly ? 'Unpublished Products' : 'All Products'}
                <span className="text-neutralneutral-400">({total})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutralneutral-500 text-sm">Page {page}</span>
                <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => setPage(p => Math.max(1, p - 1))}>Prev</Button>
                <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => setPage(p => p + 1)}>Next</Button>
              </div>
            </div>
            {loading ? (
              <div className="text-neutralneutral-400">Loading...</div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-neutralneutral-300">No products found.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((p) => {
                  const images = Array.isArray(p.images) ? p.images : [];
                  return (
                    <div key={p._id} className="p-4 bg-neutralneutral-900 border border-neutralneutral-700 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="text-white font-medium flex items-center gap-2">
                            {p.name}
                            <StatusBadge published={!!p.published} />
                          </div>
                        </div>
                        <div className="text-neutralneutral-200"><AmountCurrency amount={p.price} fromCurrency="USDT" /></div>
                      </div>

                      {/* Cover image preview (first image) */}
                      {images.length > 0 && (
                        <div className="mt-3">
                          <img src={(images[0]?.url) || images[0]} alt={p.name} className="h-28 w-full object-cover rounded-md border border-neutralneutral-700" />
                        </div>
                      )}

                      <div className="mt-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-neutralneutral-400 text-sm">Publish</span>
                          <PublishKnob checked={!!p.published} onChange={() => togglePublish(p)} />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => navigate(`/admin/products/${p._id}/edit`)}><Edit size={14} className="mr-2" /> Edit</Button>
                          <Button variant="destructive" className="bg-dangerd-500 hover:bg-dangerd-400" onClick={() => handleDelete(p._id)}><Trash2 size={14} className="mr-2" /> Delete</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>


        
        </div>
      </div>
  
    </Layout>
  );
};

export default ProductManagement;