import React, { useState, useEffect } from "react";
import useStore from "@/store/useStore";
import { convertCurrency, getCurrencyRates } from "@/lib/utils";
import currencyConversionService from "@/services/currencyConversionService";

export default function AmountCurrency({ amount, fromCurrency = "USDC" }) {
  const fromCurr = (fromCurrency === 'USDT' ? 'USDC' : fromCurrency) || 'USDC';
  const userCurr = useStore((state) => (state.userCurrency === 'USDT' ? 'USDC' : state.userCurrency) || 'USDC');
  const [rates, setRates] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      const fetchedRates = await getCurrencyRates();
      setRates(fetchedRates);
    };
    fetchRates();
  }, []);

  if (!rates) {
    return <span className="text-white leading-snug">Loading...</span>; // Or a placeholder
  }

  const converted = convertCurrency(amount, fromCurr, userCurr, rates);
  const formatted = currencyConversionService.formatCurrency(Number(converted), userCurr);

  return (
    <span className="text-white leading-snug">{formatted}</span>
  );
}
