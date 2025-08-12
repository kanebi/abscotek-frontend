import currencyService from '../services/currencyService';

// Utility function for conditional classNames (shadcn/ui default)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

let cachedRates = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function getCurrencyRates() {
  const now = Date.now();
  if (cachedRates && (now - lastFetchTime < CACHE_DURATION)) {
    return cachedRates;
  }

  try {
    const rates = await currencyService.getExchangeRates();
    cachedRates = rates;
    lastFetchTime = now;
    return rates;
  } catch (error) {
    console.error("Failed to fetch latest currency rates, using fallback:", error);
    // Fallback to default rates if API call fails
    return {
      USDT: 1,
      USD: 1,
      EUR: 0.92,
      NGN: 1500,
    };
  }
}

export function convertCurrency(amount, from, to, rates) {
  if (!rates[from] || !rates[to]) return amount;
  return (parseFloat(amount) * (rates[to] / rates[from])).toFixed(2);
}
