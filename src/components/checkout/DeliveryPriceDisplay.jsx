import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import currencyConversionService from '@/services/currencyConversionService';

/**
 * Displays delivery method price in user's header currency.
 * Delivery methods are stored in NGN; converts to USD/USDC for display.
 */
export default function DeliveryPriceDisplay({ price, currency = 'NGN' }) {
  const userCurrency = useStore((state) => (state.userCurrency === 'USDT' ? 'USDC' : state.userCurrency) || 'USDC');
  const [displayValue, setDisplayValue] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const convert = async () => {
      try {
        const amount = parseFloat(price);
        if (isNaN(amount)) {
          if (!cancelled) setDisplayValue('—');
          return;
        }
        const converted = await currencyConversionService.convertCurrency(amount, currency, userCurrency);
        if (!cancelled) {
          setDisplayValue(currencyConversionService.formatCurrency(Number(converted), userCurrency));
        }
      } catch (err) {
        if (!cancelled) setDisplayValue(currencyConversionService.formatCurrency(price, currency));
      }
    };
    convert();
    return () => { cancelled = true; };
  }, [price, currency, userCurrency]);

  if (displayValue === null) {
    return <span className="text-white font-medium animate-pulse">...</span>;
  }
  return <span className="text-white font-medium">{displayValue}</span>;
}
