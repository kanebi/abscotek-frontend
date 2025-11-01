import apiClient from '../lib/apiClient';

class CurrencyConversionService {
  // Convert amount from one currency to another
  async convertCurrency(amount, fromCurrency, toCurrency) {
    try {
      // For now, we'll use a simple conversion rate
      // In a real implementation, you'd call a currency conversion API
      const conversionRates = {
        'USDT': { 'USD': 1, 'NGN': 1500 }, // 1 USDT = 1 USD, 1 USDT = 1500 NGN
        'USD': { 'USDT': 1, 'NGN': 1500 }, // 1 USD = 1 USDT, 1 USD = 1500 NGN
        'NGN': { 'USDT': 1/1500, 'USD': 1/1500 } // 1 NGN = 0.00067 USDT/USD
      };

      if (fromCurrency === toCurrency) {
        return amount;
      }

      const rate = conversionRates[fromCurrency]?.[toCurrency];
      if (!rate) {
        throw new Error(`Conversion rate not available from ${fromCurrency} to ${toCurrency}`);
      }

      return amount * rate;
    } catch (error) {
      console.error('Currency conversion error:', error);
      throw error;
    }
  }

  // Get current exchange rates (placeholder for real API)
  async getExchangeRates() {
    try {
      // In a real implementation, you'd call an exchange rate API
      return {
        'USDT': { 'USD': 1, 'NGN': 1500 },
        'USD': { 'USDT': 1, 'NGN': 1500 },
        'NGN': { 'USDT': 1/1500, 'USD': 1/1500 }
      };
    } catch (error) {
      console.error('Failed to fetch exchange rates:', error);
      throw error;
    }
  }

  // Format currency amount for display
  formatCurrency(amount, currency) {
    const formatters = {
      'USDT': (amount) => `${amount.toFixed(4)} USDT`,
      'USD': (amount) => `$${amount.toFixed(2)}`,
      'NGN': (amount) => `₦${amount.toLocaleString('en-NG', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    };

    return formatters[currency] ? formatters[currency](amount) : `${amount} ${currency}`;
  }

  // Get Paystack currency code
  getPaystackCurrency(currency) {
    const paystackCurrencies = {
      'USD': 'USD',
      'NGN': 'NGN',
      'USDT': 'NGN' // Convert USDT to NGN for Paystack
    };
    return paystackCurrencies[currency] || 'NGN';
  }
}

export default new CurrencyConversionService();

