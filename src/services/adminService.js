import apiClient from '@/lib/apiClient';

// Admin Dashboard & Analytics
const getDashboardStats = async () => {
  const response = await apiClient.get('/api/admin/dashboard/stats');
  return response.data;
};

const getAnalytics = async (period = '30d') => {
  const response = await apiClient.get(`/api/admin/analytics?period=${period}`);
  return response.data;
};

// User Management
const getAllUsers = async (params = {}) => {
  const response = await apiClient.get('/api/admin/users', { params });
  return response.data;
};

const getUserById = async (id) => {
  const response = await apiClient.get(`/api/admin/users/${id}`);
  return response.data;
};

const updateUser = async (id, userData) => {
  const response = await apiClient.put(`/api/admin/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await apiClient.delete(`/api/admin/users/${id}`);
  return response.data;
};

const suspendUser = async (id, reason) => {
  const response = await apiClient.patch(`/api/admin/users/${id}/suspend`, { reason });
  return response.data;
};

const unsuspendUser = async (id) => {
  const response = await apiClient.patch(`/api/admin/users/${id}/unsuspend`);
  return response.data;
};

// Delivery Methods Management
const getDeliveryMethods = async () => {
  const response = await apiClient.get('/api/delivery-methods');
  return response.data;
};

const createDeliveryMethod = async (methodData) => {
  const response = await apiClient.post('/api/delivery-methods', methodData);
  return response.data;
};

const updateDeliveryMethod = async (id, methodData) => {
  const response = await apiClient.put(`/api/delivery-methods/${id}`, methodData);
  return response.data;
};

const deleteDeliveryMethod = async (id) => {
  const response = await apiClient.delete(`/api/delivery-methods/${id}`);
  return response.data;
};

// Category Management
const getCategories = async () => {
  const response = await apiClient.get('/api/admin/categories');
  return response.data;
};

const createCategory = async (categoryData) => {
  const response = await apiClient.post('/api/admin/categories', categoryData);
  return response.data;
};

const updateCategory = async (id, categoryData) => {
  const response = await apiClient.put(`/api/admin/categories/${id}`, categoryData);
  return response.data;
};

const deleteCategory = async (id) => {
  const response = await apiClient.delete(`/api/admin/categories/${id}`);
  return response.data;
};

// System Settings
const getSettings = async () => {
  const response = await apiClient.get('/api/admin/settings');
  return response.data;
};

const updateSettings = async (settings) => {
  const response = await apiClient.put('/api/admin/settings', settings);
  return response.data;
};

// Reports
const getSalesReport = async (startDate, endDate) => {
  const response = await apiClient.get('/api/admin/reports/sales', {
    params: { startDate, endDate }
  });
  return response.data;
};

const getInventoryReport = async () => {
  const response = await apiClient.get('/api/admin/reports/inventory');
  return response.data;
};

const getUserReport = async (startDate, endDate) => {
  const response = await apiClient.get('/api/admin/reports/users', {
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