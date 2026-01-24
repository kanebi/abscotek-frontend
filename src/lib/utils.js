import currencyService from '../services/currencyService';

// Utility function for conditional classNames (shadcn/ui default)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
const LS_KEY = 'global_currency_rates_v1';

export async function getCurrencyRates() {
  const now = Date.now();

  // Try localStorage first
  try {
    const lsRaw = localStorage.getItem(LS_KEY);
    if (lsRaw) {
      const parsed = JSON.parse(lsRaw);
      if (parsed && parsed.timestamp && parsed.rates) {
        if (now - parsed.timestamp < CACHE_DURATION) {
          cachedRates = parsed.rates;
          lastFetchTime = parsed.timestamp;
          return parsed.rates;
        }
      }
    }
  } catch (err) { void err; }

  // Memory cache fallback within session
  if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    const rates = await currencyService.getExchangeRates();
    cachedRates = normalizeRates(rates);
    lastFetchTime = now;
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ timestamp: now, rates: cachedRates }));
    } catch (err) { void err; }
    return cachedRates;
  } catch (error) {
    console.error('Failed to fetch latest currency rates, using fallback:', error);
    const fallback = normalizeRates({
      USDT: 1,
      USD: 1,
      EUR: 0.92,
      NGN: 1500,
      GHS: 15,
    });
    cachedRates = fallback;
    lastFetchTime = now;
    return fallback;
  }
}

function normalizeRates(rates) {
  // Ensure we have both GHS and GHC aliases
  const r = { ...rates };
  if (r.GHS && !r.GHC) r.GHC = r.GHS;
  if (r.GHC && !r.GHS) r.GHS = r.GHC;
  return r;
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
  return code;
}
