import axios from 'axios';

const API_KEY = process.env.VITE_APP_EXCHANGE_RATE_API_KEY; // Get your API key from https://www.exchangerate-api.com/
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USDT`;

const getExchangeRates = async () => {
  try {
    const response = await axios.get(BASE_URL);
    if (response.data && response.data.conversion_rates) {
      return response.data.conversion_rates;
    } else {
      throw new Error('Invalid response from exchange rate API');
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to default rates if API call fails
    return {
      USDT: 1,
      USD: 1,
      EUR: 0.92,
      NGN: 1500,
    };
  }
};

export default {
  getExchangeRates,
};