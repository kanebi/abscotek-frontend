import axios from 'axios';

const API_URL = '/api/cart';

const cartService = {
  getCart: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getCartByUserId: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/${userId}`); // Assuming backend has /api/cart/:userId
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addItemToCart: async (productId, quantity = 1) => {
    try {
      const response = await axios.post(API_URL, { productId, quantity });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  removeItemFromCart: async (userId, productId) => {
    try {
      // Assuming backend has /api/cart/:userId/:productId for admin removal
      const response = await axios.delete(`${API_URL}/${userId}/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default cartService;