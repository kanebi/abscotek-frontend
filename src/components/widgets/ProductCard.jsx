import React from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import AmountCurrency from "@/components/ui/AmountCurrency";
import { useNavigate } from "react-router-dom";

// Props: { image, name, price, badge, outOfStock }
export default function ProductCard({ image, name, price, badge, outOfStock, _id }) {
    const navigate = useNavigate()
  return (
    <>
      {/* Mobile: 2-column grid, compact card, improved image and spacing */}
      <div onClick={navigate('/product/'+_id)} className="cursor-pointer  md:hidden w-full flex flex-col gap-3 mb-6">
        <div className="w-full h-44 relative bg-white rounded-[10.10px] overflow-hidden">
          <img
            className="absolute left-0 top-0 w-full h-full object-cover object-center"
            src={image}
            alt={name}
          />
          {badge && !outOfStock && (
            <div className="absolute left-2 top-2 px-2 py-0.5 bg-rose-500 rounded-lg text-white text-xs font-normal">
              {badge}
            </div>
          )}
          {outOfStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <div className="text-white text-base font-semibold text-center">
                Out of Stock
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col justify-start items-start gap-1.5">
          <div
            className="self-stretch justify-start text-white text-xs font-normal font-sans leading-none line-clamp-2"
            title={name}
          >
            {name}
          </div>
          <div className="self-stretch justify-start text-white text-xs font-semibold font-sans leading-none">
            <AmountCurrency amount={price} />
          </div>
        </div>
      </div>
      {/* Desktop: original card */}
      <Card onClick={navigate('/product/'+ _id)} className=" cursor-pointer hidden md:flex w-64 flex-col gap-6 border-none rounded-2xl overflow-hidden bg-transparent">
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
              className="text-gray-300 font-normal md:leading-snug leading-loose  break-words line-clamp-2 "
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
    </>
  );
}
