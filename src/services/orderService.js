import axios from 'axios';

const API_URL = '/api/orders';

const orderService = {
  getAllOrders: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getOrderById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createOrder: async (orderData) => {
    try {
      const response = await axios.post(API_URL, orderData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateOrder: async (id, orderData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, orderData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteOrder: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default orderService;