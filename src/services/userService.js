import apiClient from '@/lib/apiClient';

const getUser = async () => {
  const response = await apiClient.get('/users');
  return response.data;
};

const updateUser = async (userData) => {
  const response = await apiClient.put('/users', userData);
  return response.data;
};

export default {
  getUser,
  updateUser,
};