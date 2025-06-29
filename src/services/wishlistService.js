import axios from 'axios';

const API_URL = '/api/wishlist';

const wishlistService = {
  getWishlist: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  addItemToWishlist: async (productId) => {
    try {
      const response = await axios.post(API_URL, { productId });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  removeItemFromWishlist: async (productId) => {
    try {
      const response = await axios.delete(`${API_URL}/${productId}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default wishlistService;