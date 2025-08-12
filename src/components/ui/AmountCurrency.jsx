import React, { useState, useEffect } from "react";
import useStore from "@/store/useStore";
import { convertCurrency, getCurrencyRates } from "@/lib/utils";

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

  return (
    <span className="text-white leading-snug">
      {converted} {userCurrency}
    </span>
  );
}
