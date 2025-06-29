import axios from 'axios';
import useStore from '../store/useStore';

const API_URL = '/api/admin/auth';

const authService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(API_URL, { email, password });
      if (response.data.token) {
        // Use Zustand to set the current user
        useStore.getState().setCurrentUser({ token: response.data.token, isAdmin: response.data.isAdmin });
      }
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout: () => {
    // Use Zustand to clear the current user
    useStore.getState().setCurrentUser(null);
  },

  // getCurrentUser is no longer needed as state is managed by Zustand
};

export default authService;