import apiClient from '@/lib/apiClient';

const generateReferralLink = async () => {
  const response = await apiClient.post('/referrals/generate');
  return response.data;
};

const getReferralStats = async () => {
  const response = await apiClient.get('/referrals/stats');
  return response.data;
};

const getReferredUsers = async () => {
  const response = await apiClient.get('/referrals/referred-users');
  return response.data;
};

const withdrawBonus = async (amount, walletAddress) => {
  const response = await apiClient.post('/referrals/withdraw', { amount, walletAddress });
  return response.data;
};

export default {
  generateReferralLink,
  getReferralStats,
  getReferredUsers,
  withdrawBonus,
};