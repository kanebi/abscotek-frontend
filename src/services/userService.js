import apiClient from '@/lib/apiClient';

// User profile methods
const getUser = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

const updateUser = async (userData) => {
  const response = await apiClient.put('/users/profile', userData);
  return response.data;
};

const getUserStats = async () => {
  const response = await apiClient.get('/users/profile/stats');
  return response.data;
};

const updateUserPreferences = async (preferences) => {
  const response = await apiClient.put('/users/preferences', preferences);
  return response.data;
};

// User Addresses
const getUserAddresses = async () => {
  const response = await apiClient.get('/users/addresses');
  return response.data;
};

const createUserAddress = async (addressData) => {
  const response = await apiClient.post('/users/addresses', addressData);
  return response.data;
};

const updateUserAddress = async (addressId, addressData) => {
  const response = await apiClient.put(`/users/addresses/${addressId}`, addressData);
  return response.data;
};

const deleteUserAddress = async (addressId) => {
  const response = await apiClient.delete(`/users/addresses/${addressId}`);
  return response.data;
};

// Admin user management methods
const getAllUsers = async (params = {}) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data.users || response.data;
};

const getUserById = async (id) => {
  const response = await apiClient.get(`/admin/users/${id}`);
  return response.data;
};

const createUser = async (userData) => {
  const response = await apiClient.post('/admin/users', userData);
  return response.data;
};

const updateUserById = async (id, userData) => {
  const response = await apiClient.put(`/admin/users/${id}`, userData);
  return response.data;
};

const deleteUser = async (id) => {
  const response = await apiClient.delete(`/admin/users/${id}`);
  return response.data;
};

const approveUser = async (id, data) => {
  const response = await apiClient.patch(`/admin/users/${id}/approve`, data);
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
  approveUser,
};