import React, { useState, useEffect } from "react";
import useStore from "@/store/useStore";
import { convertCurrency, getCurrencyRates } from "@/lib/utils";
import currencyConversionService from "@/services/currencyConversionService";

export default function AmountCurrency({ amount, fromCurrency = "USDT" }) {
  const userCurrency = useStore((state) => state.userCurrency || "USDT");
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

  const converted = convertCurrency(amount, fromCurrency, userCurrency, rates);
  const formatted = currencyConversionService.formatCurrency(Number(converted), userCurrency);

  return (
    <span className="text-white leading-snug">{formatted}</span>
  );
}
