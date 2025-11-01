import apiClient from '@/lib/apiClient';

const API_URL = '/delivery-addresses';

const deliveryAddressService = {
  // Create a new delivery address
  createDeliveryAddress: async (addressData) => {
    try {
      const response = await apiClient.post(API_URL, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get all delivery addresses for the current user
  getDeliveryAddresses: async () => {
    try {
      const response = await apiClient.get(API_URL);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get delivery address by ID
  getDeliveryAddressById: async (id) => {
    try {
      const response = await apiClient.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Update a delivery address
  updateDeliveryAddress: async (id, addressData) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}`, addressData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete a delivery address
  deleteDeliveryAddress: async (id) => {
    try {
      const response = await apiClient.delete(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Set default delivery address
  setDefaultDeliveryAddress: async (id) => {
    try {
      const response = await apiClient.put(`${API_URL}/${id}/default`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default deliveryAddressService;
