import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import productService from '../../services/productService';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { ArrowLeft, Save, Upload, X, ImagePlus } from 'lucide-react';
import { AppRoutes } from '../../config/routes';
import ProductVariantEditor from '../../components/admin/ProductVariantEditor';
import ProductSpecsEditor from '../../components/admin/ProductSpecsEditor';
import { PRODUCT_CATEGORIES, PRODUCT_BRANDS } from '../../config/categories';
import currencyConversionService from '../../services/currencyConversionService';


function ProductEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    currency: 'USDT',
    badge: '',
    category: '',
    brand: '',
    sku: '',
    specs: [],
    variants: [],
    stock: 0,
    published: false,
  });

  const [uploadFiles, setUploadFiles] = useState([]);
  const [uploadUrls, setUploadUrls] = useState(['']);
  const [isUploading, setIsUploading] = useState(false);
  const [existingImages, setExistingImages] = useState([]);
  const [convertedAmounts, setConvertedAmounts] = useState({ ngn: null, ghc: null });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  useEffect(() => {
    const amt = parseFloat(formData.price);
    const curr = formData.currency;
    if (amt && !isNaN(amt) && (curr === 'USD' || curr === 'USDT')) {
      currencyConversionService.convertCurrency(amt, 'USD', 'NGN')
        .then(ngn => currencyConversionService.convertCurrency(amt, 'USD', 'GHC').then(ghc => setConvertedAmounts({ ngn, ghc })))
        .catch(() => setConvertedAmounts({ ngn: null, ghc: null }));
    } else {
      setConvertedAmounts({ ngn: null, ghc: null });
    }
  }, [formData.price, formData.currency]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      // Use admin endpoint to get product (includes unpublished)
      const product = await productService.getAdminProduct(id);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        currency: product.currency || 'USDT',
        badge: product.badge || '',
        category: product.category || '',
        brand: product.brand || '',
        sku: product.sku || '',
        specs: Array.isArray(product.specs) ? product.specs : [],
        variants: Array.isArray(product.variants) ? product.variants : [],
        stock: product.stock || 0,
        published: product.published !== undefined ? product.published : false,
      });
      setExistingImages(Array.isArray(product.images) ? product.images : []);
    } catch (error) {
      console.error('Error fetching product:', error);
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to load product details';
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const updateConvertedAmounts = async (priceVal, currencyVal) => {
    const amt = parseFloat(priceVal);
    const curr = currencyVal || formData.currency;
    if (!amt || isNaN(amt)) {
      setConvertedAmounts({ ngn: null, ghc: null });
      return;
    }
    const isUSD = curr === 'USD' || curr === 'USDT';
    if (!isUSD) {
      setConvertedAmounts({ ngn: null, ghc: null });
      return;
    }
    try {
      const ngn = await currencyConversionService.convertCurrency(amt, 'USD', 'NGN');
      const ghc = await currencyConversionService.convertCurrency(amt, 'USD', 'GHC');
      setConvertedAmounts({ ngn, ghc });
    } catch {
      setConvertedAmounts({ ngn: null, ghc: null });
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'price' || field === 'currency') {
        const p = field === 'price' ? value : prev.price;
        const c = field === 'currency' ? value : prev.currency;
        updateConvertedAmounts(p, c);
      }
      return next;
    });
  };

  const safeParseArray = (val) => {
    try {
      const parsed = typeof val === 'string' ? JSON.parse(val || '[]') : Array.isArray(val) ? val : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      // Ensure variants are properly formatted
      const processedVariants = Array.isArray(formData.variants) 
        ? formData.variants.map(variant => ({
            name: variant.name || '',
            price: Number(variant.price) || 0,
            currency: variant.currency || 'USDT',
            stock: Number(variant.stock) || 0,
            sku: variant.sku || null,
            attributes: Array.isArray(variant.attributes) ? variant.attributes : [],
            images: Array.isArray(variant.images) ? variant.images : [],
          }))
        : safeParseArray(formData.variants);

      const payload = {
        name: formData.name,
        description: formData.description || '',
        price: Number(formData.price),
        currency: formData.currency,
        badge: formData.badge?.trim() || null,
        category: formData.category?.trim() || null,
        brand: formData.brand?.trim() || null,
        sku: formData.sku?.trim() || null,
        specs: Array.isArray(formData.specs) ? formData.specs : safeParseArray(formData.specs),
        variants: processedVariants,
        stock: Number(formData.stock || 0),
        published: formData.published,
      };

      await productService.updateProduct(id, payload);
      setSuccessMessage('Product updated successfully!');
      
      // Scroll to top to show success message
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error updating product:', error);
      const errorMsg = error.response?.data?.errors?.[0]?.msg || error.response?.data?.message || 'Failed to update product';
      setErrorMessage(errorMsg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSaving(false);
    }
  };

  const handleUploadImages = async () => {
    if (uploadFiles.length === 0 && uploadUrls.filter(Boolean).length === 0) {
      setErrorMessage('Please select files or enter URLs to upload');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      let updated = null;
      
      if (uploadFiles.length > 0) {
        updated = await productService.uploadImages(id, uploadFiles);
      }
      
      const urls = uploadUrls.filter(Boolean);
      if (urls.length > 0) {
        updated = await productService.appendImageUrls(id, urls);
      }

      if (updated) {
        setExistingImages(updated.images || []);
        setUploadFiles([]);
        setUploadUrls(['']);
        setSuccessMessage('Images uploaded successfully!');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      setErrorMessage('Failed to upload images');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = async (imageUrl) => {
    if (!window.confirm('Remove this image?')) return;
    
    try {
      const updated = await productService.removeImage(id, imageUrl);
      setExistingImages(updated.images || []);
      setSuccessMessage('Image removed successfully!');
    } catch (error) {
      console.error('Error removing image:', error);
      setErrorMessage('Failed to remove image');
    }
  };

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    const remaining = 10 - existingImages.length;
    if (files.length + uploadFiles.length > remaining) {
      setErrorMessage(`You can only upload ${remaining} more image(s)`);
      return;
    }
    setUploadFiles(prev => [...prev, ...files]);
  };

  const addUrlField = () => {
    if (uploadUrls.length + existingImages.length >= 10) {
      setErrorMessage('Maximum 10 images allowed');
      return;
    }
    setUploadUrls(prev => [...prev, '']);
  };

  const updateUrlField = (index, value) => {
    const newUrls = [...uploadUrls];
    newUrls[index] = value;
    setUploadUrls(newUrls);
  };

  const removeUrlField = (index) => {
    setUploadUrls(prev => prev.filter((_, i) => i !== index));
  };

  if (loading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-white text-center">Loading product...</div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading-header-2-header-2-bold text-white mb-2">
                Edit Product
              </h1>
              <p className="text-neutralneutral-300">Update product details and images</p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate(AppRoutes.adminProducts.path)}
              className="border-neutralneutral-600 text-neutralneutral-300 hover:bg-neutralneutral-800"
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Products
            </Button>
          </div>

          {/* Messages */}
          {errorMessage && (
            <Card className="p-4 mb-6 bg-dangerd-100/10 border-dangerd-400">
              <p className="text-dangerd-400">{errorMessage}</p>
            </Card>
          )}
          {successMessage && (
            <Card className="p-4 mb-6 bg-successs-100/10 border-successs-400">
              <p className="text-successs-400">{successMessage}</p>
            </Card>
          )}

          {/* Product Details Form */}
          <Card className="p-6 mb-6 bg-neutralneutral-900 border-neutralneutral-700">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Product Details
            </h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                </div>
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Price (USD/USDT) *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                    required
                  />
                  {(convertedAmounts.ngn != null || convertedAmounts.ghc != null) && (
                    <div className="mt-2 text-sm text-neutralneutral-400 space-y-1">
                      {convertedAmounts.ngn != null && (
                        <div>NGN: {currencyConversionService.formatCurrency(convertedAmounts.ngn, 'NGN')}</div>
                      )}
                      {convertedAmounts.ghc != null && (
                        <div>GHC: {currencyConversionService.formatCurrency(convertedAmounts.ghc, 'GHC')}</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-neutralneutral-300 text-sm mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Category</label>
                  {formData.category && !PRODUCT_CATEGORIES.includes(formData.category) && formData.category !== 'Other' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value || null)}
                        placeholder="Custom Category"
                        className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                      />
                      <Button
                        type="button"
                        onClick={() => handleInputChange('category', null)}
                        variant="outline"
                        className="border-neutralneutral-600"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <select
                      value={formData.category || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'Other') {
                          handleInputChange('category', '');
                        } else {
                          handleInputChange('category', value || null);
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
                  <label className="block text-neutralneutral-300 text-sm mb-2">Brand</label>
                  {formData.brand && !PRODUCT_BRANDS.includes(formData.brand) && formData.brand !== 'Custom' ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value || null)}
                        placeholder="Custom Brand"
                        className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                      />
                      <Button
                        type="button"
                        onClick={() => handleInputChange('brand', null)}
                        variant="outline"
                        className="border-neutralneutral-600"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ) : (
                    <select
                      value={formData.brand || ''}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === 'Custom') {
                          handleInputChange('brand', '');
                        } else {
                          handleInputChange('brand', value || null);
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
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Badge</label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => handleInputChange('badge', e.target.value)}
                    placeholder="e.g., New, Sale"
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">SKU</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  />
                </div>
                <div>
                  <label className="block text-neutralneutral-300 text-sm mb-2">Stock</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                  />
                </div>
              </div>

              <div>
                <ProductSpecsEditor
                  specs={Array.isArray(formData.specs) ? formData.specs : safeParseArray(formData.specs)}
                  onChange={(specs) => handleInputChange('specs', specs)}
                />
              </div>

              <div>
                <ProductVariantEditor
                  variants={formData.variants}
                  onChange={(variants) => handleInputChange('variants', variants)}
                  productPrice={Number(formData.price) || 0}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => handleInputChange('published', e.target.checked)}
                  className="w-4 h-4"
                />
                <label htmlFor="published" className="text-neutralneutral-300">
                  Published (visible to customers)
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="submit" disabled={saving} className="bg-secondarys-500 hover:bg-secondarys-400">
                  <Save size={16} className="mr-2" />
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => navigate(AppRoutes.adminProducts.path)}
                  className="border-neutralneutral-600 text-neutralneutral-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>

          {/* Image Management */}
          <Card className="p-6 bg-neutralneutral-900 border-neutralneutral-700">
            <h2 className="text-xl font-heading-header-3-header-3-bold text-white mb-6">
              Product Images ({existingImages.length}/10)
            </h2>

            {/* Existing Images */}
            {existingImages.length > 0 && (
              <div className="mb-6">
                <h3 className="text-neutralneutral-300 text-sm mb-3">Current Images</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {existingImages.map((img, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={img} 
                        alt={`Product ${idx + 1}`} 
                        className="w-full h-32 object-cover rounded-lg border border-neutralneutral-600"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(img)}
                        className="absolute top-2 right-2 bg-dangerd-500 hover:bg-dangerd-400 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upload New Images */}
            {existingImages.length < 10 && (
              <div className="space-y-4">
                <h3 className="text-neutralneutral-300 text-sm">Add More Images</h3>
                
                {/* File Upload */}
                <div>
                  <label className="block text-neutralneutral-400 text-sm mb-2">Upload Files</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFilesSelected}
                    className="w-full p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white"
                  />
                  {uploadFiles.length > 0 && (
                    <p className="text-neutralneutral-400 text-sm mt-2">
                      {uploadFiles.length} file(s) selected
                    </p>
                  )}
                </div>

                {/* URL Upload */}
                <div>
                  <label className="block text-neutralneutral-400 text-sm mb-2">Or Enter Image URLs</label>
                  {uploadUrls.map((url, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={url}
                        onChange={(e) => updateUrlField(idx, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 p-3 bg-neutralneutral-800 border border-neutralneutral-600 rounded-lg text-white placeholder-neutralneutral-400"
                      />
                      {uploadUrls.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeUrlField(idx)}
                          className="border-neutralneutral-600"
                        >
                          <X size={16} />
                        </Button>
                      )}
                    </div>
                  ))}
                  {uploadUrls.length + existingImages.length < 10 && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addUrlField}
                      className="border-neutralneutral-600 text-neutralneutral-300 mt-2"
                    >
                      <ImagePlus size={16} className="mr-2" />
                      Add URL Field
                    </Button>
                  )}
                </div>

                <Button
                  type="button"
                  onClick={handleUploadImages}
                  disabled={isUploading}
                  className="bg-primaryp-500 hover:bg-primaryp-400"
                >
                  <Upload size={16} className="mr-2" />
                  {isUploading ? 'Uploading...' : 'Upload Images'}
                </Button>
              </div>
            )}
          </Card>
        </div>
      </div>
    </Layout>
  );
}

export default ProductEdit;
