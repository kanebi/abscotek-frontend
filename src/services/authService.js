import apiClient from '@/lib/apiClient';
import useAdminStore from '@/store/adminStore';

// Admin authentication
const adminLogin = async (email, password) => {
  const response = await apiClient.post('/api/admin/login', { email, password });
  if (response.data.token) {
    const { token, user } = response.data;
    useAdminStore.getState().login(token, user);
  }
  return response.data;
};

const adminLogout = () => {
  useAdminStore.getState().logout();
};

const adminSignup = async (userData) => {
  const response = await apiClient.post('/api/admin/signup', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    companyName: userData.companyName,
    phone: userData.phone
  });
  if (response.data.token) {
    const { token, user } = response.data;
    useAdminStore.getState().login(token, user);
  }
  return response.data;
};

// Regular user authentication
const login = async (email, password) => {
  const response = await apiClient.post('/api/auth', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    if (response.data.user) {
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const signup = async (userData) => {
  // Fix signup to use correct fields and endpoint
  const response = await apiClient.post('/api/users', {
    name: `${userData.firstName || ''} ${userData.lastName || ''}`.trim(),
    email: userData.email,
    password: userData.password,
    phoneNumber: userData.phoneNumber,
    referralCode: userData.referralCode
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    if (response.data.user) {
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

// Get current user
const getCurrentUser = async () => {
  const response = await apiClient.get('/api/auth');
  return response.data;
};

// Get admin profile
const getAdminProfile = async () => {
  const response = await apiClient.get('/api/admin/profile');
  return response.data;
};

// Update admin profile
const updateAdminProfile = async (profileData) => {
  const response = await apiClient.put('/api/admin/profile', profileData);
  return response.data;
};

// Change admin password
const changeAdminPassword = async (currentPassword, newPassword) => {
  const response = await apiClient.put('/api/admin/change-password', {
    currentPassword,
    newPassword
  });
  return response.data;
};

// Get user profile
const getUserProfile = async () => {
  const response = await apiClient.get('/api/users/profile');
  return response.data;
};

// Update user profile
const updateUserProfile = async (profileData) => {
  const response = await apiClient.put('/api/users/profile', profileData);
  return response.data;
};

const authenticateWithPrivy = async (privyAccessToken) => {
  const response = await apiClient.post('/auth/privy', { accessToken: privyAccessToken });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    if (response.data.user) {
      localStorage.setItem('userInfo', JSON.stringify(response.data.user));
    }
  }
  return response.data;
};

const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('walletAddress');
  localStorage.removeItem('userInfo');
};

// Helper function to extract error message from backend response
const extractErrorMessage = (error) => {
  if (error.response?.data?.errors && Array.isArray(error.response.data.errors)) {
    // Backend returns { errors: [{ msg: "message" }] }
    return error.response.data.errors[0]?.msg || 'An error occurred';
  } else if (error.response?.data?.message) {
    // Fallback for other error formats
    return error.response.data.message;
  } else if (error.message) {

    return error.message;

  } else {

    return 'An unexpected error occurred';
  }
};

export default {
  login,
  signup,
  adminLogin,
  adminLogout,
  adminSignup,
  getCurrentUser,
  getAdminProfile,
  updateAdminProfile,
  changeAdminPassword,
  getUserProfile,
  updateUserProfile,
  authenticateWithPrivy,
  logout,
  extractErrorMessage
};
