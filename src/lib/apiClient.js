import axios from 'axios';
import useStore from '@/store/useStore';
import useAdminStore from '@/store/adminStore';
import { env } from '@/config/env';

const API_URL = env.API_URL || 'http://localhost:5832/api';

// Helper function to mark requests as user actions (will trigger modal on 401)
export const markAsUserAction = (config) => {
  config._isUserAction = true;
  return config;
};

// Create axios instance (withCredentials so session cookie is sent for currency/session)
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - adds auth token, wallet info, and user info
apiClient.interceptors.request.use(
  (config) => {
    const isAdminRoute = config.url.includes('/admin');
    let token = null;

    if (isAdminRoute) {
      token = localStorage.getItem('adminToken');
    } else {
      token = localStorage.getItem('token');
    }
    
    const walletAddress = localStorage.getItem('walletAddress');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      config.headers['x-auth-token'] = token;
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
        // Parse failed
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - sync X-User-Currency from backend (24h session cache)
apiClient.interceptors.response.use(
  (response) => {
    const currency = response.headers?.['x-user-currency'];
    if (currency && typeof currency === 'string') {
      try {
        const store = useStore.getState();
        const normalized = currency === 'USDT' ? 'USDC' : currency;
        if (store.userCurrency !== normalized) {
          store.setUserCurrency(normalized);
        }
      } catch (e) { void e; }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    const isAdminRoute = originalRequest.url.includes('/admin');
    
    // Handle 401 Unauthorized - clear auth and redirect to login
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (isAdminRoute) {
        const adminStore = useAdminStore.getState();
        adminStore.logout();
      } else {
        // Check if this is a background data fetch (cart/wishlist) vs user action
        const isBackgroundFetch = (originalRequest.url?.includes('/cart') || 
                                   originalRequest.url?.includes('/wishlist')) && 
                                  !originalRequest._isUserAction;
        
        localStorage.removeItem('token');
        localStorage.removeItem('walletAddress');
        localStorage.removeItem('userInfo');
        
        const store = useStore.getState();
        store.setToken(null);
        store.setIsAuthenticated(false);
        store.setCurrentUser(null);
        store.setWalletAddress(null);
        
        if (!isBackgroundFetch) {
          store.setConnectWalletModalOpen(true);
        }
      }
    }
    
    if (error.response?.status === 403) {
      // Forbidden
    }
    
    return Promise.reject(error);
  }
);

export default apiClient; 