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

  const numAmount = Number(amount);
  if (amount == null || Number.isNaN(numAmount)) {
    return <span className="text-white leading-snug">—</span>;
  }

  const converted = convertCurrency(numAmount, fromCurr, userCurr, rates);
  const convertedNum = Number(converted);
  const safeAmount = Number.isNaN(convertedNum) ? 0 : convertedNum;
  const formatted = currencyConversionService.formatCurrency(safeAmount, userCurr);

  return (
    <span className="text-white leading-snug">{formatted}</span>
  );
}
