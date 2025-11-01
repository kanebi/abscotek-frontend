import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function OrderSummary({ order }) {
  const orderDetails = {
    product: {
      name: order.product.name,
      variant: order.product.variant,
      quantity: order.product.quantity,
      image: order.product.images?.[0] || order.product.image || '/images/desktop-1.png',
    },
    pricing: [
      { label: "Subtotal", value: order.pricing.subtotal },
      { label: "Delivery", value: order.pricing.delivery },
    ],
    total: order.pricing.total,
  };

  return (
    <Card className="flex w-full flex-col items-center gap-[17px] px-0 py-4 relative rounded-xl border border-solid border-[#3f3f3f]">
      <CardContent className="flex flex-col items-end justify-center gap-5 px-4 py-0 relative self-stretch w-full flex-[0_0_auto]">
        <div className="flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
          <div className="relative w-[77.14px] h-[77.14px] bg-white rounded-[6.17px] overflow-hidden">
            {orderDetails.product.images && orderDetails.product.images.length > 0 ? (
              <img
                className="absolute w-[77px] h-[77px] top-0 left-0 object-cover"
                alt={`${orderDetails.product.name}${orderDetails.product.variant !== 'N/A' ? ` - ${orderDetails.product.variant}` : ''}`}
                src={orderDetails.product.images[0]}
              />
            ) : (
              <div className="absolute w-[77px] h-[77px] top-0 left-0 bg-neutralneutral-800 rounded-lg flex items-center justify-center">
                <span className="text-neutralneutral-400 text-xs">No Image</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-5 relative flex-1 grow">
            <div className="flex items-start gap-3 relative flex-1 grow">
              <div className="flex flex-col items-start gap-1 relative flex-1 grow">
                <h3 className="relative self-stretch mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]">
                  {orderDetails.product.name}
                </h3>

                <p className="relative w-fit font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-neutralneutral-100 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                  {orderDetails.product.variant}
                </p>
              </div>

              <span className="relative w-fit mt-[-1.00px] font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-[length:var(--body-large-large-semibold-font-size)] text-center tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[var(--body-large-large-semibold-line-height)] whitespace-nowrap [font-style:var(--body-large-large-semibold-font-style)]">
                x{orderDetails.product.quantity}
              </span>
            </div>
          </div>
        </div>

        <Separator className="relative self-stretch w-full h-px bg-[#3f3f3f]" />

        <div className="flex flex-col w-[246px] items-start gap-3 relative flex-[0_0_auto]">
          <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            {orderDetails.pricing.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]"
              >
                <span className="relative w-fit mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]">
                  {item.label}
                </span>

                <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultwhite text-[length:var(--body-base-base-medium-font-size)] text-right tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                  {item.value}
                </span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-start gap-3 relative self-stretch w-full flex-[0_0_auto]">
            <Separator className="mt-[-0.50px] relative self-stretch w-full h-px bg-[#3f3f3f]" />

            <div className="flex items-center justify-between relative self-stretch w-full flex-[0_0_auto]">
              <span className="relative w-fit mt-[-1.00px] font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-white text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
                Order Total
              </span>

              <span className="relative w-fit mt-[-1.00px] font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-[length:var(--body-large-large-semibold-font-size)] text-right tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[var(--body-large-large-semibold-line-height)] whitespace-nowrap [font-style:var(--body-large-large-semibold-font-style)]">
                {orderDetails.total}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 