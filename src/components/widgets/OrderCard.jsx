import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AmountCurrency from "@/components/ui/AmountCurrency";
import React, { useCallback } from "react";

const OrderCard = ({ order, onViewOrder }) => {
  const handleCardClick = useCallback((e) => {
    // Don't trigger if clicking on a button or interactive element
    const target = e.target;
    const isButton = target.closest('button') || target.closest('a');
    
    if (isButton) {
      return;
    }
    
    // Stop propagation to prevent multiple triggers
    e.stopPropagation();
    onViewOrder();
  }, [onViewOrder]);

  return (
    <section 
      className="flex flex-col items-start relative self-stretch w-full flex-[0_0_auto] cursor-pointer"
      onClick={handleCardClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onViewOrder();
        }
      }}
    >
      {/* Order Header */}
      <div className="flex flex-col items-start gap-2.5 px-4 md:px-8 py-3.5 relative self-stretch w-full flex-[0_0_auto] bg-defaulttop-background rounded-[12px_12px_0px_0px] overflow-hidden border border-solid border-[#3f3f3f]">
        <div className="flex flex-col items-start justify-center gap-1 relative self-stretch w-full flex-[0_0_auto]">
          <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
            <span className="mt-[-1.00px] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] leading-[var(--body-large-large-regular-line-height)] relative w-fit font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] tracking-[var(--body-large-large-regular-letter-spacing)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
              Order date:
            </span>
            <span className="relative w-fit mt-[-1.00px] font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
              {order.date}
            </span>
          </div>

          <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
            <span className="mt-[-1.00px] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] leading-[var(--body-large-large-regular-line-height)] relative w-fit font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] tracking-[var(--body-large-large-regular-letter-spacing)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
              Order NO:
            </span>
            <span className="relative w-fit mt-[-1.00px] font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
              {order.number}
            </span>
          </div>
        </div>
      </div>

      {/* Order Content - Mobile Layout */}
      <Card className="flex md:hidden flex-col items-start relative border-none w-full">
        <CardContent className="flex flex-col items-start gap-2.5 p-4 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_23px_12px] overflow-hidden border border-solid border-[#3f3f3f]">
          <div className="flex mt-3 flex-col items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
            <div className="flex items-start gap-5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="relative w-16 h-16 bg-white rounded-[5.12px] overflow-hidden">
                {order.product.images && order.product.images.length > 0 ? (
                  <img
                    className="absolute w-16 h-16 top-0 left-0 object-cover"
                    alt={`${order.product.name}${order.product.variant !== 'N/A' ? ` - ${order.product.variant}` : ''}`}
                    src={order.product.images[0]}
                  />
                ) : (
                  <div className="absolute w-16 h-16 top-0 left-0 bg-neutralneutral-800 rounded-lg flex items-center justify-center">
                    <span className="text-neutralneutral-400 text-xs">No Image</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col items-start gap-3 relative flex-1 grow">
                <div className="flex flex-col items-start gap-1 relative self-stretch w-full flex-[0_0_auto]">
                  <h3 className="relative self-stretch mt-[-1.00px] font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]">
                    {order.product.name}
                  </h3>
                  {order.product.variant && (
                    <p className="relative w-fit font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-neutralneutral-100 text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] whitespace-nowrap [font-style:var(--body-large-large-medium-font-style)]">
                      {typeof order.product.variant === 'string' ? order.product.variant : order.product.variant.name}
                    </p>
                  )}
                  {order.product.specs && order.product.specs.length > 0 && (
                    <div className="text-xs text-neutralneutral-300 mt-1">
                      {order.product.specs.map((spec, idx) => (
                        <span key={idx}>
                          {spec.label}: {spec.value}
                          {idx < order.product.specs.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="inline-flex items-start gap-6 relative flex-[0_0_auto]">
                  <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                    <span className="relative self-stretch mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-[length:var(--body-base-base-regular-font-size)] text-center tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                      Qty
                    </span>
                    <span className="relative self-stretch font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-[length:var(--body-large-large-semibold-font-size)] text-center tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[var(--body-large-large-semibold-line-height)] [font-style:var(--body-large-large-semibold-font-style)]">
                      x{order.product.quantity}
                    </span>
                  </div>

                  <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-[length:var(--body-base-base-regular-font-size)] text-center tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]">
                      Price
                    </span>
                    <span className="relative w-fit font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-[length:var(--body-large-large-semibold-font-size)] text-center tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[var(--body-large-large-semibold-line-height)] whitespace-nowrap [font-style:var(--body-large-large-semibold-font-style)]">
                      <AmountCurrency 
                        amount={order.product.price || 0} 
                        fromCurrency={order.product.currency || order.currency || 'USDT'} 
                      />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end justify-center gap-5 relative self-stretch w-full flex-[0_0_auto]">
              <div className="inline-flex flex-col items-end justify-center gap-6 relative flex-[0_0_auto]">
                <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                  <span className="mt-[-0.50px] text-white text-[length:var(--body-base-base-regular-font-size)] text-right leading-[var(--body-base-base-regular-line-height)] relative w-fit font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] tracking-[var(--body-base-base-regular-letter-spacing)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]">
                    Order Total:
                  </span>
                  <span className="relative w-fit mt-[-1.00px] font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-defaultwhite text-[length:var(--heading-header-6-header-6-semibold-font-size)] text-right tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-6-header-6-semibold-font-style)]">
                    <AmountCurrency 
                      amount={order.total || 0} 
                      fromCurrency={order.currency || 'USDT'} 
                    />
                  </span>
                </div>

                <div className="inline-flex items-center gap-3 relative flex-[0_0_auto]">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle cancel order action here if needed
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-[13px] relative flex-[0_0_auto] rounded-xl border border-solid border-primaryp-300 h-auto hover:bg-defaulttop-background bg-transparent"
                  >
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      Cancel Order
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder();
                    }}
                    className="inline-flex items-center justify-center gap-2.5 px-7 py-[13px] relative flex-[0_0_auto] rounded-xl border border-solid border-primaryp-300 h-auto hover:bg-defaulttop-background bg-transparent"
                  >
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      View Order
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Content - Desktop Layout */}
      <Card className="hidden md:flex flex-col items-start gap-2.5 p-4 md:p-8 relative self-stretch w-full flex-[0_0_auto] rounded-[0px_0px_23px_12px] overflow-hidden border border-solid border-[#3f3f3f] shadow-none">
        <CardContent className="p-0 w-full">
          <div className="flex flex-col md:flex-row h-auto md:h-[127px] items-start gap-3 md:gap-5 relative self-stretch w-full">
            {/* Product Image */}
            <div className="relative w-full md:w-[127px] h-[200px] md:h-[127px] bg-white rounded-[10.16px] overflow-hidden flex-shrink-0">
              {order.product.images && order.product.images.length > 0 ? (
                <img
                  className="absolute w-full h-full top-0 left-0 object-cover"
                  alt={`${order.product.name}${order.product.variant !== 'N/A' ? ` - ${order.product.variant}` : ''}`}
                  src={order.product.images[0]}
                />
              ) : (
                <div className="absolute w-full h-full top-0 left-0 bg-neutralneutral-800 rounded-lg flex items-center justify-center">
                  <span className="text-neutralneutral-400 text-sm">No Image</span>
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex w-full flex-col items-end justify-center gap-3 md:gap-5 relative flex-1 grow">
              <div className="flex flex-col md:flex-row items-start overflow-x-hidden text-ellipsis justify-between relative self-stretch flex-[0_0_auto] gap-3 md:gap-0">
                {/* Product Info */}
                <div className="inline-flex flex-col w-[50%] overflow-hidden items-start gap-1  relative flex-[0_0_auto]">
                  <h3 className="relative w-full mt-[-1.00px] font-body-xlarge-xlarge-semibold font-[number:var(--body-xlarge-xlarge-semibold-font-weight)] text-defaultgrey-2 text-sm md:text-[length:var(--body-xlarge-xlarge-semibold-font-size)] tracking-[var(--body-xlarge-xlarge-semibold-letter-spacing)] leading-[18px] md:leading-[var(--body-xlarge-xlarge-semibold-line-height)] truncate [font-style:var(--body-xlarge-xlarge-semibold-font-style)]">
                    {order.product.name}
                  </h3>
                  {order.product.variant && (
                    <p className="relative w-full font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-neutralneutral-100 text-xs md:text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[16px] md:leading-[var(--body-large-large-medium-line-height)] truncate [font-style:var(--body-large-large-medium-font-style)]">
                      {typeof order.product.variant === 'string' ? order.product.variant : order.product.variant.name}
                    </p>
                  )}
                  {order.product.specs && order.product.specs.length > 0 && (
                    <div className="text-xs text-neutralneutral-300 mt-1">
                      {order.product.specs.map((spec, idx) => (
                        <span key={idx}>
                          {spec.label}: {spec.value}
                          {idx < order.product.specs.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quantity and Price - Mobile: Row, Desktop: Columns */}
                <div className="flex flex-row md:flex-row w-[50%] justify-between md:items-start gap-6 md:gap-4 relative">
                  <div className="flex flex-col w-[74px] items-center md:items-start gap-1 relative">
                    <p className="relative self-stretch mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-xs md:text-[length:var(--body-base-base-regular-font-size)] text-center tracking-[var(--body-base-base-regular-letter-spacing)] leading-[16px] md:leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                      Qty
                    </p>
                    <p className="relative self-stretch font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-sm md:text-[length:var(--body-large-large-semibold-font-size)] text-center tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[18px] md:leading-[var(--body-large-large-semibold-line-height)] [font-style:var(--body-large-large-semibold-font-style)]">
                      x{order.product.quantity}
                    </p>
                  </div>

                  <div className="inline-flex flex-col items-center md:items-start gap-1 relative flex-[0_0_auto]">
                    <p className="relative self-stretch mt-[-1.00px] font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-white text-xs md:text-[length:var(--body-base-base-regular-font-size)] text-center tracking-[var(--body-base-base-regular-letter-spacing)] leading-[16px] md:leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)]">
                      Price
                    </p>
                    <p className="relative w-fit font-body-large-large-semibold font-[number:var(--body-large-large-semibold-font-weight)] text-defaultwhite text-sm md:text-[length:var(--body-large-large-semibold-font-size)] text-center tracking-[var(--body-large-large-semibold-letter-spacing)] leading-[18px] md:leading-[var(--body-large-large-semibold-line-height)] whitespace-nowrap [font-style:var(--body-large-large-semibold-font-style)]">
                      <AmountCurrency 
                        amount={order.product.price || 0} 
                        fromCurrency={order.product.currency || order.currency || 'USDT'} 
                      />
                    </p>
                  </div>
                </div>
              </div>

              {/* Order Total and Actions */}
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 relative flex-[0_0_auto] md:w-auto">
                <div className="inline-flex items-center gap-1 relative flex-[0_0_auto]">
                  <p className="text-white text-xs md:text-[length:var(--body-base-base-regular-font-size)] text-right leading-[16px] md:leading-[var(--body-base-base-regular-line-height)] relative w-fit font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] tracking-[var(--body-base-base-regular-letter-spacing)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]">
                    Order Total:
                  </p>
                  <p className="relative w-fit mt-[-1.00px] font-heading-header-4-header-4-semibold font-[number:var(--heading-header-4-header-4-semibold-font-weight)] text-defaultwhite text-sm md:text-[length:var(--heading-header-4-header-4-semibold-font-size)] text-right tracking-[var(--heading-header-4-header-4-semibold-letter-spacing)] leading-[18px] md:leading-[var(--heading-header-4-header-4-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-4-header-4-semibold-font-style)]">
                    <AmountCurrency 
                      amount={order.total || 0} 
                      fromCurrency={order.currency || 'USDT'} 
                    />
                  </p>
                </div>

                <div className="flex flex-col md:flex-row items-center gap-2 md:gap-3 relative flex-[0_0_auto] w-full md:w-auto">
                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle cancel order action here if needed
                    }}
                    className="h-auto hover:bg-defaulttop-background bg-transparent w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-4 md:px-7 py-2 md:py-[13px] relative flex-[0_0_auto] rounded-xl border border-solid border-primaryp-300"
                  >
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-xs md:text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[16px] md:leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      Cancel Order
                    </span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onViewOrder();
                    }}
                    className="h-auto hover:bg-defaulttop-background bg-transparent w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-4 md:px-7 py-2 md:py-[13px] relative flex-[0_0_auto] rounded-xl border border-solid border-primaryp-300"
                  >
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-xs md:text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[16px] md:leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      View Order
                    </span>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default OrderCard;
