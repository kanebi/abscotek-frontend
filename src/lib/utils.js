// Utility function for conditional classNames (shadcn/ui default)
export function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export function getCurrencyRates() {
  // Example: return { USDT: 1, USD: 1, EUR: 0.92, NGN: 1500 }
  return {
    USDT: 1,
    USD: 1,
    EUR: 0.92,
    NGN: 1500,
  };
}

export function convertCurrency(amount, from, to, rates) {
  if (!rates[from] || !rates[to]) return amount;
  return (parseFloat(amount) * (rates[to] / rates[from])).toFixed(2);
}
