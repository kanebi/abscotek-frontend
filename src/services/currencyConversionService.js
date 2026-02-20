import apiClient from '@/lib/apiClient';

const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24h, match backend
let cachedRates = null;
let cacheTime = 0;
let fetchPromise = null; // coalesce concurrent calls to a single request

/**
 * Get platform exchange rates from backend (no frontend exchange-rate API).
 * Backend stores rates in DB and refreshes every 24h. One in-flight request shared by all callers.
 */
async function fetchRatesFromBackend() {
  const { data } = await apiClient.get('/currency/rates');
  return data?.rates || {};
}

function normalizeRates(rates) {
  const r = { ...rates };
  if (r.GHS && r.GHC === undefined) r.GHC = r.GHS;
  if (r.GHC && r.GHS === undefined) r.GHS = r.GHC;
  if (r.USD !== undefined && r.USDC === undefined) r.USDC = r.USD;
  if (r.USDC === undefined) r.USDC = 1;
  return r;
}

const DEFAULT_RATES = normalizeRates({
  USDC: 1,
  USD: 1,
  NGN: 1500,
  EUR: 0.92,
  GHS: 15,
  GHC: 15
});

class CurrencyConversionService {
  async getGlobalRates() {
    const now = Date.now();
    if (cachedRates && (now - cacheTime) < CACHE_DURATION) {
      return cachedRates;
    }
    if (fetchPromise) {
      try {
        return await fetchPromise;
      } catch {
        fetchPromise = null;
        if (cachedRates) return cachedRates;
      }
    }
    fetchPromise = (async () => {
      try {
        const rates = await fetchRatesFromBackend();
        cachedRates = normalizeRates(rates);
        cacheTime = Date.now();
        return cachedRates;
      } catch (err) {
        if (cachedRates) return cachedRates;
        cachedRates = DEFAULT_RATES;
        cacheTime = Date.now();
        return cachedRates;
      } finally {
        fetchPromise = null;
      }
    })();
    return fetchPromise;
  }

  normalizeRates(rates) {
    return normalizeRates(rates);
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    const a = parseFloat(amount);
    const rates = await this.getGlobalRates();
    const from = this.alias(fromCurrency);
    const to = this.alias(toCurrency);
    if (rates[from] != null && rates[to] != null && this.isFiatLike(from) && this.isFiatLike(to)) {
      return a * (rates[to] / rates[from]);
    }
    const ngnPerUsd = rates.NGN || 1500;
    if (from === 'NGN' && (to === 'USD' || to === 'USDC')) return a / ngnPerUsd;
    if ((from === 'USD' || from === 'USDC') && to === 'NGN') return a * ngnPerUsd;
    return a;
  }

  formatCurrency(amount, currency) {
    const curr = currency === 'USDT' ? 'USDC' : (currency || 'USDC');
    const formatters = {
      USDC: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USDC`,
      USD: (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      NGN: (val) => `₦${Number(val).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      GHC: (val) => `₵${Number(val).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      GHS: (val) => `₵${Number(val).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      EUR: (val) => `€${Number(val).toLocaleString('en-EU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ETH: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`,
      BTC: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BTC`,
      BNB: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BNB`,
      MATIC: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} MATIC`,
    };
    return formatters[curr] ? formatters[curr](amount) : `${amount} ${curr}`;
  }

  getPaystackCurrency(currency) {
    const paystackCurrencies = { USD: 'USD', NGN: 'NGN', USDC: 'NGN' };
    return paystackCurrencies[currency] || 'NGN';
  }

  isFiatLike(code) {
    return ['USD', 'USDC', 'NGN', 'GHS', 'GHC', 'EUR'].includes(code);
  }
  isCrypto(code) {
    return ['ETH', 'BTC', 'BNB', 'MATIC'].includes(code);
  }
  alias(code) {
    if (code === 'GHC') return 'GHS';
    if (code === 'USDT') return 'USDC';
    return code;
  }
}

export default new CurrencyConversionService();
