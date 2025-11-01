import apiClient from '@/lib/apiClient';

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

// --- User Addresses --- //

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

export default {
  getUser,
  updateUser,
  getUserStats,
  updateUserPreferences,
  getUserAddresses,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
};