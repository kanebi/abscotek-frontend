import axios from 'axios';
import currencyService from '../services/currencyService';

const LS_KEY = 'global_rates_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

class CurrencyConversionService {
  async getGlobalRates() {
    const now = Date.now();
    try {
      const ls = localStorage.getItem(LS_KEY);
      if (ls) {
        const parsed = JSON.parse(ls);
        if (parsed && parsed.timestamp && now - parsed.timestamp < DAY_MS) {
          return parsed.rates;
        }
      }
    } catch (err) { void err; }

    const fiat = await currencyService.getExchangeRates();
    const crypto = await this.getCryptoUsdPrices();
    const merged = this.normalizeRates({ ...fiat, ...crypto });
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ timestamp: now, rates: merged }));
    } catch (err) { void err; }
    return merged;
  }

  async getCryptoUsdPrices() {
    try {
      const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,polygon&vs_currencies=usd';
      const { data } = await axios.get(url);
      return {
        BTC: data.bitcoin?.usd || 43250,
        ETH: data.ethereum?.usd || 2580,
        BNB: data.binancecoin?.usd || 320,
        MATIC: data.polygon?.usd || 0.75,
      };
    } catch (e) {
      void e;
      return {
        BTC: 43250,
        ETH: 2580,
        BNB: 320,
        MATIC: 0.75,
      };
    }
  }

  normalizeRates(rates) {
    const r = { ...rates };
    if (r.GHS && !r.GHC) r.GHC = r.GHS;
    if (r.GHC && !r.GHS) r.GHS = r.GHC;
    return r;
  }

  async convertCurrency(amount, fromCurrency, toCurrency) {
    const a = parseFloat(amount);
    const rates = await this.getGlobalRates();

    const from = this.alias(fromCurrency);
    const to = this.alias(toCurrency);

    // If both are fiat-like (including USDT treated as fiat-peg)
    if (rates[from] && rates[to] && this.isFiatLike(from) && this.isFiatLike(to)) {
      // rates are relative to a base (USDT or USD); use ratio
      return a * (rates[to] / rates[from]);
    }

    // Convert fiat -> crypto based on USD price
    if (this.isFiatLike(from) && this.isCrypto(to)) {
      const usdAmount = a * (rates.USD / rates[from]);
      const tokenUsd = rates[to];
      return usdAmount / tokenUsd;
    }

    // Convert crypto -> fiat based on USD price
    if (this.isCrypto(from) && this.isFiatLike(to)) {
      const usdAmount = a * rates[from];
      return usdAmount * (rates[to] / rates.USD);
    }

    // Crypto -> Crypto via USD
    if (this.isCrypto(from) && this.isCrypto(to)) {
      const usdAmount = a * rates[from];
      return usdAmount / rates[to];
    }

    // Fallback: no conversion
    return a;
  }

  formatCurrency(amount, currency) {
    const formatters = {
      USDT: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} USDT`,
      USD: (val) => `$${Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      NGN: (val) => `₦${Number(val).toLocaleString('en-NG', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
      GHC: (val) => `₵${Number(val).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      GHS: (val) => `₵${Number(val).toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      ETH: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} ETH`,
      BTC: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BTC`,
      BNB: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} BNB`,
      MATIC: (val) => `${Number(val).toLocaleString('en-US', { minimumFractionDigits: 6, maximumFractionDigits: 6 })} MATIC`,
    };
    return formatters[currency] ? formatters[currency](amount) : `${amount} ${currency}`;
  }

  getPaystackCurrency(currency) {
    const paystackCurrencies = {
      USD: 'USD',
      NGN: 'NGN',
      USDT: 'NGN',
    };
    return paystackCurrencies[currency] || 'NGN';
  }

  isFiatLike(code) {
    return ['USD', 'USDT', 'NGN', 'GHS', 'GHC', 'EUR'].includes(code);
  }
  isCrypto(code) {
    return ['ETH', 'BTC', 'BNB', 'MATIC'].includes(code);
  }
  alias(code) {
    if (code === 'GHC') return 'GHS';
    return code;
  }
}

export default new CurrencyConversionService();
