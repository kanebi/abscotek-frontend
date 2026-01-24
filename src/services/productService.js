import apiClient from '@/lib/apiClient';

// Public: list products with filters/sort/pagination
const getProducts = async (params = {}) => {
  const response = await apiClient.get('/products', { params });
  return response.data;
};

// Admin: list all products (published and unpublished)
const getAdminProducts = async (params = {}) => {
  const response = await apiClient.get('/admin/products', { params });
  return response.data; // { items, total, page, limit }
};

// Admin: list only unpublished products
const getAdminUnpublishedProducts = async (params = {}) => {
  const response = await apiClient.get('/admin/products/unpublished', { params });
  return response.data; // { items, total, page, limit }
};

// Public: get single product by id or slug
const getProduct = async (idOrSlug) => {
  const response = await apiClient.get(`/products/${idOrSlug}`);
  return response.data;
};

// Admin: get single product by id (includes unpublished)
const getAdminProduct = async (id) => {
  const response = await apiClient.get(`/admin/products/${id}`);
  return response.data;
};

// Public: related products
const getRelatedProducts = async (idOrSlug, limit = 8) => {
  const response = await apiClient.get(`/products/${idOrSlug}/related`, { params: { limit } });
  return response.data;
};

// Admin: create product
const createProduct = async (productData) => {
  const response = await apiClient.post('/admin/products', productData);
  return response.data;
};

// Admin: update product
const updateProduct = async (id, productData) => {
  const response = await apiClient.put(`/admin/products/${id}`, productData);
  return response.data;
};

// Admin: delete product
const deleteProduct = async (id) => {
  const response = await apiClient.delete(`/admin/products/${id}`);
  return response.data;
};

// Admin: toggle publish status
const setPublishStatus = async (id, published) => {
  const response = await apiClient.patch(`/admin/products/${id}/publish`, { published });
  return response.data;
};

// Admin: update inventory/stock
const updateInventory = async (id, inventory) => {
  const response = await apiClient.patch(`/admin/products/${id}/inventory`, inventory);
  return response.data;
};

// Admin: upload images (multipart)
const uploadImages = async (id, files = []) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  const response = await apiClient.post(`/admin/products/${id}/images`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

// Admin: append existing image URLs
const appendImageUrls = async (id, urls = []) => {
  const response = await apiClient.post(`/admin/products/${id}/images`, { images: urls });
  return response.data;
};

// Admin: remove image by imageId or URL
const removeImage = async (id, imageIdOrUrl) => {
  const response = await apiClient.delete(`/admin/products/${id}/images`, {
    data: { image: imageIdOrUrl },
  });
  return response.data;
};

// Admin: bulk create/update via CSV/JSON
const bulkUpsert = async (payload) => {
  // payload can be FormData (for CSV) or JSON array for bulk upsert
  const isFormData = payload instanceof FormData;
  const response = await apiClient.post('/admin/products/bulk', payload, {
    headers: isFormData ? { 'Content-Type': 'multipart/form-data' } : undefined,
  });
  return response.data;
};

export default {
  // public
  getProducts,
  getProduct,
  getRelatedProducts,
  // admin lists
  getAdminProducts,
  getAdminUnpublishedProducts,
  getAdminProduct,
  // admin CRUD
  createProduct,
  updateProduct,
  deleteProduct,
  setPublishStatus,
  updateInventory,
  uploadImages,
  appendImageUrls,
  removeImage,
  bulkUpsert,
};