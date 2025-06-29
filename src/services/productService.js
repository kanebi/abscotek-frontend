import axios from 'axios';
import useNotificationStore from '../store/notificationStore';

const API_URL = '/api/products';

const notifyError = (message) => {
  useNotificationStore.getState().addNotification({
    id: Date.now() + Math.random(),
    type: 'error',
    message,
  });
};

const productService = {
  getAllProducts: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to fetch products');
      throw error;
    }
  },

  getProductById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to fetch product');
      throw error;
    }
  },

  createProduct: async (productData) => {
    try {
      const response = await axios.post(API_URL, productData);
      return response.data;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to create product');
      throw error;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, productData);
      return response.data;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to update product');
      throw error;
    }
  },

  deleteProduct: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      notifyError(error?.response?.data?.message || 'Failed to delete product');
      throw error;
    }
  },
};

export default productService;