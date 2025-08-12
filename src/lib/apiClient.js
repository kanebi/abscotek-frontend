import axios from 'axios';
import useStore from '@/store/useStore';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5832/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token, wallet info, and user info
apiClient.interceptors.request.use(
  (config) => {
    // Get token from store or localStorage
    const token = localStorage.getItem('token');
    const walletAddress = localStorage.getItem('walletAddress');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add wallet address to headers for Web3 requests
    if (walletAddress) {
      config.headers['X-Wallet-Address'] = walletAddress;
    }
    
    // Add user info to headers for backend user identification
    if (userInfo) {
      try {
        const user = JSON.parse(userInfo);
        config.headers['X-User-Email'] = user.email || '';
        config.headers['X-User-Name'] = user.name || '';
        config.headers['X-User-ID'] = user.id || '';
      } catch (error) {
        console.error('Error parsing user info:', error);
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handles auth errors and token refresh
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Clear auth state
      localStorage.removeItem('token');
      localStorage.removeItem('walletAddress');
      
      // Update store state
      const store = useStore.getState();
      store.setToken(null);
      store.setIsAuthenticated(false);
      store.setCurrentUser(null);
      store.setWalletAddress(null);
      
      // Redirect to admin login if not already there
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 