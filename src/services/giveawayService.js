import apiClient from '@/lib/apiClient';

const getGiveaways = async () => {
  const response = await apiClient.get('/giveaways');
  return response.data;
};

const checkClaim = async (giveawayId, productId, couponCode = '') => {
  const params = couponCode ? { couponCode } : {};
  const response = await apiClient.get(
    `/giveaways/check-claim/${encodeURIComponent(giveawayId)}/${encodeURIComponent(productId)}`,
    { params }
  );
  return response.data;
};

const claimGiveaway = async (payload) => {
  const response = await apiClient.post('/giveaways/claim', payload);
  return response.data;
};

const startDeliveryPayment = async (payload) => {
  const response = await apiClient.post('/giveaways/start-delivery-payment', payload);
  return response.data;
};

const startSeerbitDeliveryPayment = async (payload) => {
  const response = await apiClient.post('/giveaways/seerbit-delivery-payment', payload);
  return response.data;
};

export default {
  getGiveaways,
  checkClaim,
  claimGiveaway,
  startDeliveryPayment,
  startSeerbitDeliveryPayment,
};
