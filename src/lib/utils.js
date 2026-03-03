import apiClient from '@/lib/apiClient';

// Utility function for conditional classNames (shadcn/ui default)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

let cachedRates = null;
let lastFetchTime = 0;
let ratesFetchPromise = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 min so header/amounts show updated backend rates

const FALLBACK_RATES = {
  USDC: 1,
  USD: 1,
  EUR: 0.92,
  NGN: 1500,
  GHS: 15,
  GHC: 15,
};

/**
 * Get platform exchange rates from backend. Single in-flight request; short cache so UI updates.
 */
export async function getCurrencyRates() {
  const now = Date.now();
  if (cachedRates && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedRates;
  }
  if (ratesFetchPromise) {
    try {
      return await ratesFetchPromise;
    } catch {
      ratesFetchPromise = null;
      if (cachedRates) return cachedRates;
    }
  }
  ratesFetchPromise = (async () => {
    try {
      const { data } = await apiClient.get('/currency/rates');
      const rates = data?.rates || {};
      cachedRates = normalizeRates(rates);
      lastFetchTime = Date.now();
      return cachedRates;
    } catch (error) {
      if (cachedRates) return cachedRates;
      cachedRates = normalizeRates(FALLBACK_RATES);
      lastFetchTime = Date.now();
      return cachedRates;
    } finally {
      ratesFetchPromise = null;
    }
  })();
  return ratesFetchPromise;
}

function normalizeRates(rates) {
  const r = { ...rates };
  if (r.GHS && !r.GHC) r.GHC = r.GHS;
  if (r.GHC && !r.GHS) r.GHS = r.GHC;
  if (r.USD !== undefined && r.USDC === undefined) r.USDC = r.USD;
  if (r.USDC === undefined) r.USDC = 1;
  // Never leave 0 or invalid so conversions don't show 0 (use fallback per currency)
  for (const [key, val] of Object.entries(r)) {
    const n = Number(val);
    if (val == null || Number.isNaN(n) || n <= 0) {
      r[key] = FALLBACK_RATES[key] ?? (key === 'USD' || key === 'USDC' ? 1 : 1);
    }
  }
  return r;
}

/** Call to force refetch of rates on next getCurrencyRates() (e.g. after backend rate update). */
export function clearCurrencyRatesCache() {
  cachedRates = null;
  lastFetchTime = 0;
}

export function convertCurrency(amount, from, to, rates) {
  const a = parseFloat(amount);
  if (!rates) return a;

  const f = alias(from);
  const t = alias(to);

  if (!rates[f] || !rates[t]) return a;
  return a * (rates[t] / rates[f]);
}

function alias(code) {
  if (code === 'GHC') return 'GHS';
  if (code === 'USDT') return 'USDC';
  return code;
}
