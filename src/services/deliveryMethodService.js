import apiClient from '@/lib/apiClient';

const API_URL = '/delivery-methods';

const deliveryMethodService = {
  getAllDeliveryMethods: async () => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  getDeliveryMethodById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  createDeliveryMethod: async (deliveryMethodData) => {
    try {
      const response = await apiClient.post(API_URL, deliveryMethodData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  updateDeliveryMethod: async (id, deliveryMethodData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, deliveryMethodData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  deleteDeliveryMethod: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};

export default deliveryMethodService;