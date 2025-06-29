import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import AmountCurrency from "@/components/ui/AmountCurrency";

// Props: { image, name, price, badge, outOfStock }
export default function ProductCard({ image, name, price, badge, outOfStock }) {
  return (
    <Card className="w-64 flex flex-col gap-6 bg-white/5 border-none rounded-2xl overflow-hidden">
      <div className="relative h-56 bg-white rounded-2xl overflow-hidden">
        <img
          className="absolute left-0 top-0 w-full h-full object-cover"
          src={image}
          alt={name}
        />
        {badge && !outOfStock && (
          <div className="absolute left-4 top-6 px-2.5 py-1 bg-rose-500 rounded-lg inline-flex items-center gap-2.5">
            <span className="text-white text-sm font-normal leading-tight">
              {badge}
            </span>
          </div>
        )}
        {outOfStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-white text-2xl font-semibold leading-loose text-center">
              Out of Stock
            </div>
          </div>
        )}
      </div>
      <CardContent className="flex flex-col gap-2.5 p-0">
        <CardTitle asChild>
          <div
            className="text-gray-300 font-normal leading-snug break-words line-clamp-2"
            title={name}
          >
            {name}
          </div>
        </CardTitle>
        <div className="text-white text-lg font-semibold leading-snug">
          <AmountCurrency amount={price} />
        </div>
      </CardContent>
    </Card>
  );
}
