import apiClient from '@/lib/apiClient';

// Admin Dashboard & Analytics
const getDashboardStats = async () => {
  const response = await apiClient.get('/admin/dashboard/stats');
  return response.data;
};

const getAnalytics = async (period = '30d') => {
  const response = await apiClient.get(`/admin/analytics?period=${period}`);
  return response.data;
};

// User Management
const getAllUsers = async (params = {}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

const getUserById = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/admin/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

const suspendUser = async (id, reason) => {
  const response = await apiClient.patch(`/admin/users/${id}/suspend`, { reason });
  return response.data;
};

const unsuspendUser = async (id) => {
  const response = await apiClient.patch(`/admin/users/${id}/unsuspend`);
  return response.data;
};

// Delivery Methods Management
const getDeliveryMethods = async () => {
  const response = await apiClient.get('/admin/delivery-methods');
  return response.data;
};

const createDeliveryMethod = async (methodData) => {
  const response = await apiClient.post('/admin/delivery-methods', methodData);
  return response.data;
};

const updateDeliveryMethod = async (id, methodData) => {
  const response = await apiClient.put(`/admin/delivery-methods/${id}`, methodData);
  return response.data;
};

const deleteDeliveryMethod = async (id) => {
  const response = await apiClient.delete(`/admin/delivery-methods/${id}`);
  return response.data;
};

// Category Management
const getCategories = async () => {
  const response = await apiClient.get('/admin/categories');
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await apiClient.post('/admin/categories', categoryData);
  return response.data;
};

const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/admin/categories/${id}`, categoryData);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};

// System Settings
const getSettings = async () => {
  const response = await apiClient.get('/admin/settings');
  return response.data;
};

const updateSettings = async (settings) => {
  const response = await apiClient.put('/admin/settings', settings);
  return response.data;
};

// Reports
const getSalesReport = async (startDate, endDate) => {
  const response = await apiClient.get('/admin/reports/sales', {
    params: { startDate, endDate }
  });
  return response.data;
};

const getInventoryReport = async () => {
  const response = await apiClient.get('/admin/reports/inventory');
  return response.data;
};

const getUserReport = async (startDate, endDate) => {
  const response = await apiClient.get('/admin/reports/users', {
    params: { startDate, endDate }
  });
  return response.data;
};

export default {
  // Dashboard
  getDashboardStats,
  getAnalytics,
  
  // User Management
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  suspendUser,
  unsuspendUser,
  
  // Delivery Methods
  getDeliveryMethods,
  createDeliveryMethod,
  updateDeliveryMethod,
  deleteDeliveryMethod,
  
  // Categories
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // Settings
  getSettings,
  updateSettings,
  
  // Reports
  getSalesReport,
  getInventoryReport,
  getUserReport,
};