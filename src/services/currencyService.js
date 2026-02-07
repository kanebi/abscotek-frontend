import axios from 'axios';
import ENV from '@/config/env';

const API_KEY = ENV.EXCHANGE_RATE_API_KEY; // Get your API key from https://www.exchangerate-api.com/
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/USDC`;

const getExchangeRates = async () => {
  try {
    const response = await axios.get(BASE_URL);
    if (response.data && response.data.conversion_rates) {
      const rates = { ...response.data.conversion_rates };
      if (rates.GHS && !rates.GHC) rates.GHC = rates.GHS;
      if (rates.GHC && !rates.GHS) rates.GHS = rates.GHC;
      if (rates.USD !== undefined && rates.USDC === undefined) rates.USDC = rates.USD;
      if (rates.USDC === undefined) rates.USDC = 1;
      return rates;
    } else {
      throw new Error('Invalid response from exchange rate API');
    }
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
    // Fallback to default rates if API call fails
    return {
      USDC: 1,
      USD: 1,
      EUR: 0.92,
      NGN: 1500,
      GHS: 15,
      GHC: 15,
    };
  }
};

export default {
  getExchangeRates,
  async getUserCurrencyByLocation() {
    try {
      const { data } = await axios.get('https://ipapi.co/json/');
      const cc = (data && data.country_code) || '';
      if (cc === 'NG') return 'NGN';
      if (cc === 'GH') return 'GHC';
      return 'USD';
    } catch (e) {
      return 'USD';
    }
  },
};
