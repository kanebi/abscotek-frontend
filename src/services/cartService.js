import apiClient from '@/lib/apiClient';

const getCart = async () => {
  const response = await apiClient.get('/cart');
  return response.data;
};

const addToCart = async (productId, quantity) => {
  const response = await apiClient.post('/cart', { productId, quantity });
  return response.data;
};

const removeFromCart = async (productId) => {
  const response = await apiClient.delete(`/cart/${productId}`);
  return response.data;
};

export default {
  getCart,
  addToCart,
  removeFromCart,
};