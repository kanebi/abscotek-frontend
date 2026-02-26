import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import AmountCurrency from '../ui/AmountCurrency';
import useStore from '../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../config/routes';
// Seerbit for NGN card/bank (Paystack muted)
import currencyConversionService from '../../services/currencyConversionService';

function OrderSummary({ 
  onPlaceOrder, 
  isPlacingOrder = false, 
  hasSelectedAddress = false, 
  deliveryMethod = null, 
  requireDeliveryMethod = true, 
  balance, 
  currency,
  convertedAmount = 0,
  paymentAmount = 0,
  paymentMethod = 'wallet',
  userWalletAddress = null,
  subtotalInUSD = 0,
  deliveryCostInUSD = 0,
  subtotalDisplay = 0,
  deliveryDisplay = 0
}) {
  const { cart, currentUser } = useStore();
  
  // Display currency: parent passes subtotalDisplay/deliveryDisplay (native USD or converted NGN)
  const displayCurrency = currency || 'USDC';
  
  // Use passed display values (parent computes from native USD)
  const subtotalToShow = subtotalDisplay > 0 ? subtotalDisplay : subtotalInUSD;
  const deliveryToShow = deliveryDisplay > 0 ? deliveryDisplay : deliveryCostInUSD;
  const orderTotal = convertedAmount > 0 ? convertedAmount : (subtotalToShow + deliveryToShow);

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <div className="rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
          <h2 className="text-xl font-semibold text-white mb-4">My Order</h2>
          <Separator className="mb-4 bg-[#38383a]" />
          <p className="text-neutralneutral-400">No items in cart</p>
        </div>
        
        {/* Continue Shopping Link - Outside Card */}
        <div className="flex justify-center pt-6 px-2">
          <Link
            to={AppRoutes.home.path}
            className="flex items-center text-neutralneutral-400 hover:text-white gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="rounded-xl md:p-6 sm:pb-4 bottom-10 md:mb-0 md:sticky md:top-4 border border-none md:border-[#2C2C2E] md:bg-[#1F1F21] bg-opacity-0">
        <h2 className="text-xl font-semibold text-white mb-6">My Order</h2>
        <Separator className="bg-[#38383a] md:mb-6 mb-8" />
        
        {/* Wallet Balance */}
        {balance && (
          <div className="mb-6">
            <div className="flex justify-between text-white text-base">
              <span>Your Balance</span>
              <span className="font-medium">
                <AmountCurrency amount={balance} fromCurrency={currency === 'USDT' ? 'USDC' : (currency || 'USDC')} />
              </span>
            </div>
            <Separator className="mt-4 bg-[#38383a]" />
          </div>
        )}

        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item, index) => (
            <div key={item.productId || item.product?._id}>
              <div className="flex items-center gap-3">
                {/* Product Image */}
                <div className="w-20 h-20 bg-neutralneutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                  {(item.image || item.product?.images?.[0]) ? (
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name || item.product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-full h-full bg-neutralneutral-800 rounded-lg flex items-center justify-center">
                      <span className="text-neutralneutral-400 text-xs">No Image</span>
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-base mb-1 leading-tight">{item.product?.name || item.name}</h3>
                  {item.variant?.name && (
                    <div className="text-neutralneutral-300 text-sm mb-1">
                      Variant: {item.variant.name}
                    </div>
                  )}
                  {item.specs && item.specs.length > 0 && (
                    <div className="text-neutralneutral-300 text-sm mb-1">
                      {item.specs.map((spec, idx) => (
                        <span key={idx}>
                          {spec.label}: {spec.value}
                          {idx < item.specs.length - 1 && ', '}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-neutralneutral-400 mb-2">
                    <span>Qty: {item.quantity}</span>
                  </div>
                  <div className="text-white font-[510] text-base">
                    <AmountCurrency 
                      amount={(item.unitPrice || item.product?.price || item.price) * item.quantity} 
                      fromCurrency="USD"
                    />
                  </div>
                </div>
              </div>
              
              {index < cart.items.length - 1 && (
                <Separator className="my-4 bg-[#38383a]" />
              )}
            </div>
          ))}
        </div>
        
         {/* Order Totals - all in display currency (native USD for USD/USDC, converted NGN for Paystack) */}
         <div className="space-y-3 ">
          <div className="flex justify-between text-white text-base">
            <span>Subtotal</span>
            <span className="font-medium">
              {currencyConversionService.formatCurrency(subtotalToShow, displayCurrency)}
            </span>
          </div>
          
          <div className="flex justify-between text-white text-base">
            <span>Delivery</span>
            <span className="font-medium">
              {currencyConversionService.formatCurrency(deliveryToShow, displayCurrency)}
            </span>
          </div>
          
          <Separator className="bg-[#38383a]" />
          
          <div className="flex justify-between text-white text-lg font-semibold">
            <span>Order Total</span>
            <span>
              {currencyConversionService.formatCurrency(orderTotal, displayCurrency)}
            </span>
          </div>
          
      {/* Action Buttons - Outside Card */}
      <div className="space-y-4 pt-6 md:px-2 relative">
        {paymentMethod === 'crypto' ? (
          // Crypto payment button (USDC) - always show amount in USDC, never convert to user currency
          <Button 
            onClick={onPlaceOrder}
            disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
          >
            {isPlacingOrder ? 'Creating Payment...' : (
              <>
                Pay{' '}
                <span className="ml-1 text-white">
                  {currencyConversionService.formatCurrency(orderTotal, 'USDC')}
                </span>
              </>
            )}
          </Button>
        ) : (
          // Seerbit payment (NGN card/bank) – Place order triggers checkout then redirect to Seerbit
          <Button
            onClick={onPlaceOrder}
            disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
          >
            {isPlacingOrder ? 'Redirecting to payment...' : (
              <>
                Pay{' '}
                <span className="ml-1 text-white">
                  {currencyConversionService.formatCurrency(convertedAmount > 0 ? convertedAmount : orderTotal, displayCurrency)}
                </span>
                {' via Seerbit'}
              </>
            )}
          </Button>
        )}
        
        {/* Continue Shopping Link */}
        <div className="flex justify-center pt-2 absolute right-0 left-0 -bottom-[4rem] ">
          <Link
            to={AppRoutes.home.path}
            className="flex items-center text-neutralneutral-200 hover:text-white gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Continue Shopping
          </Link>
        </div>
      </div>
        </div>
      </div>

    </>
  );
}

export default OrderSummary; 