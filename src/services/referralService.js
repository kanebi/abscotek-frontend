import apiClient from '@/lib/apiClient';

const generateReferralLink = async () => {
  const response = await apiClient.post('/referrals/generate');
  return response.data;
};

export default {
  generateReferralLink,
};