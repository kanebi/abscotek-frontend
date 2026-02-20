import apiClient from '@/lib/apiClient';

/**
 * Currency is now provided by the backend: session (24h cache) and X-User-Currency header.
 * Exchange rates are from GET /api/currency/rates (backend DB, refreshed every 24h).
 */

/** Get user currency from backend (session or auth prefs) */
async function getUserCurrency() {
  try {
    const { data } = await apiClient.get('/currency/me');
    return data?.currency || 'USD';
  } catch (e) {
    return 'USD';
  }
}

/** Set session currency on backend (24h). Body: { currency: 'NGN' | 'USD' | 'USDC' | 'EUR' } */
async function setUserCurrency(currency) {
  try {
    const { data } = await apiClient.put('/currency/me', { currency });
    return data?.currency || 'USD';
  } catch (e) {
    return 'USD';
  }
}

export default {
  getUserCurrency,
  setUserCurrency,
  /** @deprecated Use backend GET /currency/rates via currencyConversionService.getGlobalRates() */
  getExchangeRates() {
    return apiClient.get('/currency/rates').then((r) => r.data?.rates || {});
  },
  /**
   * Get user currency by country (geo). Used when backend has no session/prefs (e.g. first visit or returns USD).
   * Calls ipapi.co to detect country and returns NGN for Nigeria, GHC for Ghana, else USD.
   */
  async getUserCurrencyByLocation() {
    try {
      const { default: axios } = await import('axios');
      const { data } = await axios.get('https://ipapi.co/json/', { timeout: 5000 });
      const cc = (data && data.country_code) || '';
      if (cc === 'NG') return 'NGN';
      if (cc === 'GH') return 'GHC';
      return 'USD';
    } catch (e) {
      return 'USD';
    }
  },
};
