import apiClient from '@/lib/apiClient';

const createOrder = async (orderData) => {
  const response = await apiClient.post('/orders', orderData);
  return response.data;
};

const getOrders = async (token) => {
  const response = await axios.get(`${API_URL}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export default {
  createOrder,
  getOrders,
};