import apiClient from '@/lib/apiClient';

// User profile methods
const getUser = async () => {
  const response = await apiClient.get('/api/users/profile');
  return response.data;
};

const updateUser = async (userData) => {
  const response = await apiClient.put('/api/users/profile', userData);
  return response.data;
};

const getUserStats = async () => {
  const response = await apiClient.get('/api/users/profile/stats');
  return response.data;
};

const updateUserPreferences = async (preferences) => {
  const response = await apiClient.put('/api/users/preferences', preferences);
  return response.data;
};

// User Addresses
const getUserAddresses = async () => {
  const response = await apiClient.get('/api/users/addresses');
  return response.data;
};

const createUserAddress = async (addressData) => {
  const response = await apiClient.post('/api/users/addresses', addressData);
  return response.data;
};

const updateUserAddress = async (addressId, addressData) => {
  const response = await apiClient.put(`/api/users/addresses/${addressId}`, addressData);
  return response.data;
};

const deleteUserAddress = async (addressId) => {
  const response = await apiClient.delete(`/api/users/addresses/${addressId}`);
  return response.data;
};

// Admin user management methods
const getAllUsers = async (params = {}) => {
  const response = await apiClient.get('/api/admin/users', { params });
  return response.data.users || response.data;
};

const getUserById = async (id) => {
  const response = await apiClient.get(`/api/admin/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await apiClient.post('/api/admin/users', userData);
  return response.data;
};

const updateUserById = async (id, userData) => {
  const response = await apiClient.put(`/api/admin/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await apiClient.delete(`/api/admin/users/${id}`);
  return response.data;
};

export default {
  // User methods
  getUser,
  updateUser,
  getUserStats,
  updateUserPreferences,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  
  // Admin methods
  getAllUsers,
  getUserById,
  createUser,
  updateUserById,
  deleteUser,
};