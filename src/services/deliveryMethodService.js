import axios from 'axios';

const API_URL = '/api/delivery-methods';

const deliveryMethodService = {
  getAllDeliveryMethods: async () => {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getDeliveryMethodById: async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createDeliveryMethod: async (deliveryMethodData) => {
    try {
      const response = await axios.post(API_URL, deliveryMethodData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateDeliveryMethod: async (id, deliveryMethodData) => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, deliveryMethodData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteDeliveryMethod: async (id) => {
    try {
      const response = await axios.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default deliveryMethodService;