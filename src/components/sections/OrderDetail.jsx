import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbList

} from "@/components/ui/Breadcrumb";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import OrderSummary from "@/components/ui/OrderSummary";
import AmountCurrency from "@/components/ui/AmountCurrency";
import React, { useState, useEffect } from "react";
import orderService from "@/services/orderService";
import useNotificationStore from "@/store/notificationStore";

export const OrderDetailsSection = ({ order, onBackToList, onOrderUpdated }) => {
  const [localOrder, setLocalOrder] = useState(order);
  const [completingPayment, setCompletingPayment] = useState(false);
  const [pollingPayment, setPollingPayment] = useState(false);
  const { addNotification } = useNotificationStore();
  const displayOrder = localOrder || order;

  useEffect(() => {
    setLocalOrder(order);
  }, [order]);

  const handleIHaveCompletedPayment = async () => {
    if (!displayOrder?.id) return;
    setCompletingPayment(true);
    try {
      const result = await orderService.confirmCryptoPayment(displayOrder.id);
      if (result.success) {
        addNotification('Payment confirmed! Your order is being processed.', 'success');
        setLocalOrder({ ...displayOrder, status: 'confirmed', paymentStatus: 'paid' });
        onOrderUpdated?.();
      }
    } catch (err) {
      if (err.response?.status === 400) {
        addNotification('Payment not yet detected. Checking every few seconds...', 'info');
        setPollingPayment(true);
      } else {
        addNotification(err.response?.data?.msg || 'Error confirming payment', 'error');
      }
    } finally {
      setCompletingPayment(false);
    }
  };

  useEffect(() => {
    if (!pollingPayment || !displayOrder?.id || displayOrder.paymentStatus === 'paid') return;
    const interval = setInterval(async () => {
      try {
        const result = await orderService.confirmCryptoPayment(displayOrder.id);
        if (result.success) {
          setPollingPayment(false);
          addNotification('Payment confirmed!', 'success');
          setLocalOrder({ ...displayOrder, status: 'confirmed', paymentStatus: 'paid' });
          onOrderUpdated?.();
        }
      } catch {
        // Ignore, keep polling
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [pollingPayment, displayOrder?.id, displayOrder?.paymentStatus]);
  // Order progress steps based on status - now using backend stages data
  const getProgressSteps = (order) => {
    // Use stages from backend if available, otherwise fallback to old logic
    if (order && order.stages) {
      return order.stages;
    }

    // Fallback logic for backward compatibility
    const steps = [
      { id: 1, name: "Submit Order", completed: true, active: false },
      { id: 2, name: "Waiting for Delivery", completed: false, active: false },
      { id: 3, name: "Out for delivery", completed: false, active: false },
      { id: 4, name: "Transaction Complete", completed: false, active: false },
    ];

    // Determine completion based on status
    const status = order?.status || '';
    switch (status) {
      case "confirmed":
      case "processing":
        steps[0].completed = true;
        steps[1].completed = true;
        steps[1].active = true;
        break;
      case "shipped":
        steps[0].completed = true;
        steps[1].completed = true;
        steps[2].completed = true;
        steps[2].active = true;
        break;
      case "delivered":
        steps.forEach(step => {
          step.completed = true;
          step.active = false;
        });
        steps[3].active = true;
        break;
      default:
        steps[0].active = true;
    }

    return steps;
  };

  const progressSteps = getProgressSteps(displayOrder || order);
  return (
    <div className="flex flex-col items-start justify-start gap-6 relative w-full">
      {/* Breadcrumb Navigation */}
      <div className="w-full mb-4">
         <Breadcrumb>
            <BreadcrumbList>
              
                <React.Fragment key={'1'}>
                  <BreadcrumbItem>
                      <BreadcrumbLink
                        href={'/profile'}
                        className="font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]"
                      >
                        My Order
                      </BreadcrumbLink>
                  </BreadcrumbItem>
                    <BreadcrumbSeparator className="text-defaultgrey-2" />
                  
                </React.Fragment>
                <React.Fragment key={'2'}>
                  <BreadcrumbItem>
                  
                      <BreadcrumbLink
                        href={'#'}
                        className="font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)]"
                      >
                        Order Details
                      </BreadcrumbLink>
                    
                  </BreadcrumbItem>
                </React.Fragment>
              
            </BreadcrumbList>
          </Breadcrumb>
      </div>

      <div className="flex flex-col items-start gap-8 relative self-stretch w-full ">
        {/* Order Status Card - Mobile */}
        <Card className="flex md:hidden w-full border-none flex-col items-start gap-2.5 px-4 py-4 relative bg-defaulttop-background rounded-xl overflow-hidden">
          <CardContent className="flex flex-col items-center gap-8 relative self-stretch w-full flex-[0_0_auto] p-0">
            <div className="flex flex-col items-end gap-8 relative self-stretch w-full flex-[0_0_auto]">
              <div className="flex flex-col items-start gap-[13px] relative self-stretch w-full flex-[0_0_auto]">
                <div className="inline-flex flex-col items-start justify-center gap-1 relative flex-[0_0_auto]">
                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      Order date:
                    </span>
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      {order.date}
                    </span>
                  </div>

                  <div className="inline-flex items-center gap-0.5 relative flex-[0_0_auto]">
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      Order NO:
                    </span>
                    <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-defaultgrey-2 text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
                      {order.number}
                    </span>
                  </div>
                </div>

                <h2 className="relative w-fit font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-defaultgrey-2 text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-6-header-6-semibold-font-style)]">
                  {order.status}
                </h2>
              </div>

              <Separator className="relative self-stretch w-full h-px bg-[#3f3f3f]" />
            </div>

            <div className="inline-flex items-start gap-[35.72px] relative flex-[0_0_auto]">
              <div className="absolute w-[280px] h-px top-1.5 left-5 bg-[#3f3f3f]" />

            
            </div>
          </CardContent>
        </Card>

        {/* Order Status Card - Desktop */}
        <Card className="hidden pt- md:flex border-none w-full bg-defaulttop-background rounded-xl overflow-hidden">
          <CardContent className="p-6  w-full">
            <div className="flex flex-col items-center gap-8 w-full">
              {/* Order Header */}
              <div className="flex flex-col items-end gap-8 w-full">
                <div className="flex items-center justify-between w-full">
                  <div className="inline-flex flex-col items-start justify-center gap-1">
                    <div className="inline-flex items-center gap-0.5">
                      <span className="font-body-large-large-regular text-defaultgrey-2">
                        Order date:
                      </span>
                      <span className="font-body-large-large-medium text-defaultgrey-2">
                        {order.date}
                      </span>
                    </div>
                    <div className="inline-flex items-center gap-0.5">
                      <span className="font-body-large-large-regular text-defaultgrey-2">
                        Order NO:
                      </span>
                      <span className="font-body-large-large-medium text-defaultgrey-2">
                        {order.number}
                      </span>
                    </div>
                  </div>
                  <div className="font-heading-header-5-header-5-semibold text-defaultgrey-2">
                    {order.status}
                  </div>
                </div>
                <Separator className="w-full bg-[#3f3f3f]" />
              </div>

              {/* Order Progress Tracker */}
              <div className="inline-flex items-start gap-8 md:gap-20 relative overflow-x-auto w-full">
                <div className="absolute w-full md:w-[628px] top-[13px] left-4 md:left-11 h-px bg-[#3f3f3f]" />

                {progressSteps.map((step, index) => (
                  <div
                    key={step.id}
                    className="inline-flex flex-col items-center gap-3 min-w-[100px]"
                  >
                    <div
                      className={`relative w-7 h-7 ${step.completed ? "bg-primaryp-300" : "bg-neutralneutral-200"} rounded-full overflow-hidden flex items-center justify-center`}
                    >
                      <svg
                        className="w-5 h-5"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.6663 5L7.49967 14.1667L3.33301 10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <div
                      className={`font-body-large-large-${step.completed ? "medium text-defaultwhite" : "regular text-neutralneutral-200"} text-center text-xs md:text-sm`}
                    >
                      {step.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Details Section */}
        <div className="flex flex-col w-full items-start justify-center gap-8">
          {/* Product Information - Mobile */}
          <div className="flex md:hidden w-full">
            <OrderSummary order={order} />
          </div>

          {/* Product Information - Desktop */}
          <div className="hidden md:flex flex-col items-center gap-[17px] pb-6 w-full rounded-xl border border-solid border-[#3f3f3f]">
            {/* Table Header */}
            <div className="flex flex-col items-start gap-2.5 px-6 py-5 w-full bg-defaulttop-background rounded-[12px_12px_0px_0px] border border-solid border-[#3f3f3f]">
              <div className="flex items-center gap-[133px] w-full">
                <div className="w-[486px] font-body-base-base-regular text-white">
                  Product Information
                </div>
                <div className="w-[74px] font-body-base-base-regular text-white text-center">
                  Qty
                </div>
                <div className="w-[74px] font-body-base-base-regular text-white text-center">
                  Price
                </div>
              </div>
            </div>

            {/* Product Details */}
            <div className="flex flex-col w-full max-w-[913px] px-4 items-end justify-center gap-5">
              <div className="flex h-[127px] items-start gap-5 w-full">
                <div className="relative w-[127px] h-[127px] bg-white rounded-[10.16px] overflow-hidden">
                  {order.product.images && order.product.images.length > 0 ? (
                    <img
                      className="absolute w-[127px] h-[127px] top-0 left-0 object-cover"
                      alt={order.product.name}
                      src={order.product.images[0]}
                    />
                  ) : (
                    <div className="absolute w-[127px] h-[127px] top-0 left-0 bg-neutralneutral-800 rounded-lg flex items-center justify-center">
                      <span className="text-neutralneutral-400 text-sm">No Image</span>
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end justify-center gap-5 flex-1">
                  <div className="flex items-start justify-between w-full">
                    <div className="inline-flex flex-col items-start gap-1">
                      <div className="font-body-xlarge-xlarge-semibold text-defaultgrey-2">
                        {order.product.name}
                      </div>
                      {order.product.variant && (
                        <div className="font-body-large-large-medium text-[#b9babb]">
                          {typeof order.product.variant === 'string' ? order.product.variant : order.product.variant.name}
                        </div>
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
                    <div className="w-[74px] font-body-large-large-semibold text-defaultwhite text-center">
                      x{order.product.quantity}
                    </div>
                    <div className="w-[74px] font-body-large-large-semibold text-defaultwhite text-center">
                      <AmountCurrency 
                        amount={order.product.unitPrice || order.product.price || 0} 
                        fromCurrency={order.product.currency || order.currency || 'USDC'} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="w-full bg-[#3f3f3f]" />

              {/* Order Summary */}
              <div className="flex flex-col w-[325px] items-start gap-3">
                <div className="flex flex-col items-start gap-3 w-full">
                  <div className="flex items-center justify-between w-full">
                    <div className="font-body-large-large-regular text-white">
                      Subtotal
                    </div>
                    <div className="font-body-large-large-medium text-defaultwhite text-right">
                      <AmountCurrency 
                        amount={order.pricing?.subtotal || order.subTotal || 0} 
                        fromCurrency={order.currency || 'USDC'} 
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full">
                    <div className="font-body-large-large-regular text-white">
                      Delivery
                    </div>
                    <div className="font-body-large-large-medium text-defaultwhite text-right">
                      <AmountCurrency 
                        amount={order.pricing?.delivery || order.deliveryFee || 0} 
                        fromCurrency={order.currency || 'USDC'} 
                      />
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-start gap-3 w-full">
                  <Separator className="w-full bg-[#3f3f3f]" />
                  <div className="flex items-center justify-between w-full">
                    <div className="font-body-xlarge-xlarge-regular text-white">
                      Order Total
                    </div>
                    <div className="font-body-xlarge-xlarge-semibold text-defaultwhite text-right">
                      <AmountCurrency 
                        amount={
                          order.pricing?.total || 
                          order.totalAmount || 
                          ((order.pricing?.subtotal || order.subTotal || 0) + (order.pricing?.delivery || order.deliveryFee || 0))
                        } 
                        fromCurrency={order.currency || 'USDC'} 
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator className="w-full bg-[#3f3f3f]" />

          {/* Shipping Address */}
          <div className="flex flex-col w-full md:w-[414px] items-start gap-5">
            <h2 className="font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] w-full">
              Shipping Address
            </h2>
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="inline-flex items-center gap-1">
                <span className="font-body-large-large-medium text-defaultwhite">
                  Name:
                </span>
                <span className="font-body-large-large-regular text-defaultwhite">
                  {order.shipping.name}
                </span>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="font-body-large-large-medium text-defaultwhite">
                  Email:
                </span>
                <span className="font-body-large-large-regular text-defaultwhite">
                  {order.shipping.email}
                </span>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="font-body-large-large-medium text-defaultwhite">
                  Phone:
                </span>
                <span className="font-body-large-large-regular text-defaultwhite">
                  {order.shipping.phone}
                </span>
              </div>
              <div className="inline-flex items-center gap-1">
                <span className="font-body-large-large-medium text-defaultwhite">
                  Address:
                </span>
                <span className="font-body-large-large-regular text-defaultwhite">
                  {order.shipping.address}
                </span>
              </div>
            </div>
          </div>

          {/* Complete Payment - For pending crypto orders */}
          {displayOrder?.status?.toLowerCase() === 'pending' &&
            displayOrder?.paymentMethod === 'crypto' &&
            displayOrder?.paymentStatus !== 'paid' &&
            displayOrder?.paymentAddress && (
            <div className="flex flex-col w-full md:w-[414px] items-start gap-5">
              <h2 className="font-heading-header-6-header-6-semibold text-white w-full">
                Complete Payment
              </h2>
              <p className="text-neutral-300 text-sm">
                Send exactly <strong className="text-white">{displayOrder.total ?? displayOrder.pricing?.total}</strong> USDC to your payment address. After sending, click below.
              </p>
              <div className="bg-[#2C2C2E] rounded-lg p-3 w-full">
                <code className="text-xs text-white break-all font-mono">{displayOrder.paymentAddress}</code>
              </div>
              <Button
                onClick={handleIHaveCompletedPayment}
                disabled={completingPayment}
                className="w-full bg-primaryp-300 hover:bg-primaryp-400 text-white"
              >
                {completingPayment ? (
                  pollingPayment ? 'Checking for payment...' : 'Confirming...'
                ) : (
                  'I have completed payment'
                )}
              </Button>
            </div>
          )}

          <Separator className="w-full bg-[#3f3f3f]" />

          {/* Delivery Method */}
          <div className="flex flex-col w-full md:w-[414px] items-start gap-5">
            <h2 className="font-heading-header-6-header-6-semibold font-[number:var(--heading-header-6-header-6-semibold-font-weight)] text-white text-[length:var(--heading-header-6-header-6-semibold-font-size)] tracking-[var(--heading-header-6-header-6-semibold-letter-spacing)] leading-[var(--heading-header-6-header-6-semibold-line-height)] [font-style:var(--heading-header-6-header-6-semibold-font-style)] w-full">
              Delivery Method
            </h2>
            <div className="flex flex-col items-start gap-3 w-full">
              <div className="inline-flex items-center gap-1">
                <span className="font-body-large-large-medium text-defaultwhite">
                  {order.delivery.method}:
                </span>
                <span className="font-body-large-large-regular text-defaultwhite">
                  {order.delivery.timeframe}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};