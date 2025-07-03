import React from "react";
import useStore from "@/store/useStore";
import { convertCurrency, getCurrencyRates } from "@/lib/utils";

export default function AmountCurrency({ amount, fromCurrency = "USDT" }) {
  const userCurrency = useStore((state) => state.userCurrency || "USDT");
  const rates = getCurrencyRates();
  const converted = convertCurrency(amount, fromCurrency, userCurrency, rates);

  return (
    <span className="text-white leading-snug">
      {converted} {userCurrency}
    </span>
  );
}
