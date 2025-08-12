import apiClient from '@/lib/apiClient';

const login = async (email, password) => {
  const response = await apiClient.post('/admin/login', { email, password });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const signup = async (userData) => {
  const response = await apiClient.post('/admin/signup', {
    name: userData.name,
    email: userData.email,
    password: userData.password,
    role: userData.role,
    companyName: userData.companyName,
    phone: userData.phone
  });
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
  }
  return response.data;
};

const requestSignature = async (walletAddress) => {
  const response = await apiClient.post('/auth/web3/request-signature', { walletAddress });
  return response.data;
};

const verifySignature = async (walletAddress, signature) => {
  const response = await apiClient.post('/auth/web3/verify-signature', { walletAddress, signature });
  return response.data; // Now expects { token, user }
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

export default { login, signup, requestSignature, verifySignature, logout, extractErrorMessage };