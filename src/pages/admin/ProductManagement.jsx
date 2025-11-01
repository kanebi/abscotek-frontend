import React, { useState, useEffect } from 'react';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { Package, Plus, Edit, Trash2, Search, ImagePlus, Upload, Filter, X } from 'lucide-react';

function ProductManagement() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', image: '', badge: '', category: '', brand: '', sku: '', specs: '[]', stock: 0, outOfStock: true });
  const [editingProduct, setEditingProduct] = useState(null);
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

  // Edit modal state
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', badge: '', category: '', brand: '', sku: '', specs: '[]', stock: 0, outOfStock: true });
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [editFiles, setEditFiles] = useState([]);
  const [editUrls, setEditUrls] = useState(['']);
  const [isEditUploading, setIsEditUploading] = useState(false);

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
    e.preventDefault(); clearMessages();
    try {
      const payload = {
        name: newProduct.name,
        description: newProduct.description,
        price: Number(newProduct.price),
        currency: 'USDT',
        images: [],
        published: false,
        badge: newProduct.badge || null,
        category: newProduct.category || null,
        brand: newProduct.brand || null,
        sku: newProduct.sku || null,
        specs: safeParseArray(newProduct.specs),
        stock: Number(newProduct.stock || 0),
        outOfStock: Boolean(newProduct.outOfStock),
      };
      const created = await productService.createProduct(payload);
      setCreatedProductId(created._id);
      setCreateStep(2);
      setSuccessMessage('Product created. Please upload up to 10 images before publishing.');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrorMessage('Failed to create product.');
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

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditForm({
      name: product?.name || '',
      description: product?.description || '',
      price: product?.price ?? '',
      badge: product?.badge || '',
      category: product?.category || '',
      brand: product?.brand || '',
      sku: product?.sku || '',
      specs: JSON.stringify(product?.specs || []),
      stock: product?.stock ?? 0,
      outOfStock: !!product?.outOfStock,
    });
    setEditFiles([]);
    setEditUrls(['']);
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editingProduct?._id) return;
    clearMessages(); setIsSavingEdit(true);
    try {
      await productService.updateProduct(editingProduct._id, {
        name: editForm.name,
        description: editForm.description,
        price: Number(editForm.price),
        badge: editForm.badge || null,
        category: editForm.category || null,
        brand: editForm.brand || null,
        sku: editForm.sku || null,
        specs: safeParseArray(editForm.specs),
        stock: Number(editForm.stock || 0),
        outOfStock: Boolean(editForm.outOfStock),
      });
      setSuccessMessage('Product updated successfully!');
      setIsEditOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      setErrorMessage('Failed to update product.');
    } finally { setIsSavingEdit(false); }
  };

  const uploadMoreInEdit = async () => {
    if (!editingProduct?._id) return;
    clearMessages(); setIsEditUploading(true);
    try {
      let updated = null;
      if (editFiles.length > 0) {
        updated = await productService.uploadImages(editingProduct._id, editFiles);
      }
      const urls = editUrls.filter(Boolean);
      if (urls.length > 0) {
        updated = await productService.appendImageUrls(editingProduct._id, urls);
      }
      if (updated) setEditingProduct(updated);
      setSuccessMessage('Images updated successfully!');
      await fetchProducts();
      setEditFiles([]);
      setEditUrls(['']);
    } catch (error) {
      console.error('Error adding images:', error);
      setErrorMessage('Failed to add images.');
    } finally { setIsEditUploading(false); }
  };

  const removeExistingImage = async (image) => {
    if (!editingProduct?._id) return;
    clearMessages();
    try {
      const identifier = image?.id || image?._id || image?.url || image; // support id or url or raw url
      const updated = await productService.removeImage(editingProduct._id, identifier);
      if (updated) setEditingProduct(updated);
      setSuccessMessage('Image removed');
      await fetchProducts();
    } catch (error) {
      console.error('Error removing image:', error);
      setErrorMessage('Failed to remove image.');
    }
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
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-secondarys-100/10 rounded-full flex items-center justify-center">
              <Package size={24} className="text-secondarys-400" />
            </div>
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white">Product Management</h1>
              <p className="text-neutralneutral-300">Manage your product catalog</p>
            </div>
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
                  <input type="text" placeholder="Category" value={newProduct.category} onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <input type="text" placeholder="Brand" value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <input type="text" placeholder="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <input type="number" placeholder="Stock" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                  <select value={newProduct.outOfStock ? 'true' : 'false'} onChange={(e) => setNewProduct({ ...newProduct, outOfStock: e.target.value === 'true' })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white">
                    <option value="true">Out of Stock</option>
                    <option value="false">In Stock</option>
                  </select>
                </div>
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-1">Specs (JSON array)</label>
                  <textarea placeholder='e.g. ["8GB RAM","256GB SSD"]' value={newProduct.specs} onChange={(e) => setNewProduct({ ...newProduct, specs: e.target.value })} className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-500" rows="3" />
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
                          <PublishKnob checked={!!p.published} onClick={() => togglePublish(p)} onChange={() => {}} />
                        </div>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => openEditModal(p)}><Edit size={14} className="mr-2" /> Edit</Button>
                          <Button variant="destructive" className="bg-dangerd-500 hover:bg-dangerd-400" onClick={() => handleDelete(p._id)}><Trash2 size={14} className="mr-2" /> Delete</Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Edit Modal */}
          {isEditOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
              <div className="w-full max-w-3xl max-h-[85vh] overflow-y-auto bg-neutralneutral-900 border border-neutralneutral-700 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-white text-xl">Edit Product</h3>
                  <button className="text-neutralneutral-400 hover:text-white" onClick={() => { setIsEditOpen(false); setEditingProduct(null); }}><X size={18} /></button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} placeholder="Description" rows="6" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="number" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} placeholder="Price (USDT)" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="text" value={editForm.badge} onChange={(e) => setEditForm({ ...editForm, badge: e.target.value })} placeholder="Badge (optional)" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="text" value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} placeholder="Category" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="text" value={editForm.brand} onChange={(e) => setEditForm({ ...editForm, brand: e.target.value })} placeholder="Brand" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="text" value={editForm.sku} onChange={(e) => setEditForm({ ...editForm, sku: e.target.value })} placeholder="SKU" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <input type="number" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} placeholder="Stock" className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400" />
                    <select value={editForm.outOfStock ? 'true' : 'false'} onChange={(e) => setEditForm({ ...editForm, outOfStock: e.target.value === 'true' })} className="p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white">
                      <option value="true">Out of Stock</option>
                      <option value="false">In Stock</option>
                    </select>
                    <div>
                      <label className="block text-neutralneutral-300 text-sm mb-1">Specs (JSON array)</label>
                      <textarea value={editForm.specs} onChange={(e) => setEditForm({ ...editForm, specs: e.target.value })} className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-500" rows="3" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <div className="text-neutralneutral-300 mb-2">Current Images</div>
                      <div className="grid grid-cols-3 gap-3">
                        {(Array.isArray(editingProduct?.images) ? editingProduct.images : []).map((img, idx) => {
                          const src = img?.url || img;
                          return (
                            <div key={idx} className="relative group">
                              <img src={src} alt="product" className="h-24 w-full object-cover rounded border border-neutralneutral-700" />
                              <button type="button" onClick={() => removeExistingImage(img)} className="absolute top-1 right-1 bg-black/60 hover:bg-black/80 text-white rounded p-1"><X size={14} /></button>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-3 bg-neutralneutral-800 border border-neutralneutral-700 rounded">
                      <div className="text-neutralneutral-300 mb-2">Add more images</div>
                      <input type="file" multiple accept="image/*" onChange={(e) => {
                        const files = Array.from(e.target.files || []);
                        const allowed = 10; // backend enforces total max
                        setEditFiles(prev => [...prev, ...files.slice(0, allowed)]);
                      }} className="block w-full text-neutralneutral-300" />
                      {editFiles.length > 0 && (
                        <div className="mt-2 grid grid-cols-3 gap-2">
                          {editFiles.map((f, idx) => (
                            <div key={idx} className="h-20 bg-neutralneutral-900 rounded flex items-center justify-center text-neutralneutral-400 text-[11px] px-2 text-center truncate">{f.name}</div>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 space-y-2">
                        {editUrls.map((u, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input value={u} onChange={(e) => setEditUrls(prev => prev.map((x, i) => i === idx ? e.target.value : x))} placeholder="https://image-url" className="flex-1 p-2 bg-neutralneutral-900 border border-neutralneutral-700 rounded text-white placeholder-neutralneutral-500" />
                            <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => setEditUrls(prev => prev.filter((_, i) => i !== idx))}>Remove</Button>
                          </div>
                        ))}
                        <Button onClick={() => setEditUrls(prev => [...prev, ''])} className="bg-primaryp-500 hover:bg-primaryp-400"><Plus size={14} className="mr-2" /> Add URL</Button>
                      </div>
                      
                      <div className="mt-3 flex justify-end">
                        <Button onClick={uploadMoreInEdit} disabled={isEditUploading} className="bg-successs-500 hover:bg-successs-400"><Upload size={14} className="mr-2" /> {isEditUploading ? 'Updating...' : 'Upload New'}</Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-2">
                  <Button variant="outline" className="border-neutralneutral-600 text-neutralneutral-300" onClick={() => { setIsEditOpen(false); setEditingProduct(null); }}>Cancel</Button>
                  <Button onClick={saveEdit} disabled={isSavingEdit} className="bg-secondarys-500 hover:bg-secondarys-400">{isSavingEdit ? 'Saving...' : 'Save Changes'}</Button>
                </div>
              </div>
              </div>
            )}
        </div>
      </div>
    </Layout>
  );
}

export default ProductManagement;