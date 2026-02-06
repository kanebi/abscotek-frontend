import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import AmountCurrency from '../ui/AmountCurrency';
import useStore from '../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../config/routes';
import { PaystackButton } from 'react-paystack';
import { env } from '../../config/env';
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
  onPaystackSuccess,
  onPaystackClose,
  subtotalInUSD = 0,
  deliveryCostInUSD = 0
}) {
  const { cart, userCurrency, getCartTotal, currentUser } = useStore();
  
  // For USD/USDT: Use base USD figures (subtotal + delivery in USD)
  // For NGN: Use converted amounts
  const isUSDOrUSDT = currency === 'USD' || currency === 'USDT';
  
  // Use passed props if available, otherwise calculate from cart
  // Use unitPrice first (includes variant price if variant is selected)
  const finalSubtotalInUSD = subtotalInUSD > 0 
    ? subtotalInUSD 
    : cart.items.reduce((total, item) => {
        // unitPrice is the correct price (includes variant if selected)
        // product.price should now also reflect unitPrice from backend
        return total + (item.unitPrice || item.product?.price || item.price) * item.quantity;
      }, 0);
  
  // Use passed delivery cost in USD if available, otherwise calculate
  const finalDeliveryCostInUSD = deliveryCostInUSD > 0 
    ? deliveryCostInUSD 
    : (deliveryMethod 
        ? (deliveryMethod.currency === 'NGN' 
            ? deliveryMethod.price / 1500  // Approximate fallback conversion
            : deliveryMethod.price)
        : 0);
  
  // Calculate total: subtotal + delivery
  // For USD/USDT: Use base USD figures (subtotal + delivery)
  // For NGN: Use convertedAmount (which is total in NGN) or calculate manually
  let orderTotal = 0;
  if (isUSDOrUSDT) {
    // Base USD figures: subtotal + delivery
    orderTotal = finalSubtotalInUSD + finalDeliveryCostInUSD;
  } else {
    // For NGN: convertedAmount should be (subtotal + delivery) in NGN
    // But if it seems wrong, calculate it manually
    // Get subtotal - might be in USD, so we'll use convertedAmount which should be total
    // Or calculate: convert subtotal USD to NGN + delivery NGN
    if (convertedAmount > 0) {
      // Use convertedAmount which should be the total (subtotal + delivery) in NGN
      orderTotal = convertedAmount;
    } else {
      // Fallback: calculate manually
      // Subtotal in USD needs to be converted to NGN
      const subtotalInNGN = finalSubtotalInUSD * 1500; // Approximate conversion
      const deliveryInNGN = deliveryMethod?.price || 0;
      orderTotal = subtotalInNGN + deliveryInNGN;
    }
  }
  
  const orderTotalCurrency = currency || (cart.currency || 'USDT');

  // Validate Paystack parameters
  const validatePaystackParams = () => {
    const issues = [];
    
    // Check email
    const userEmail = currentUser?.email;
    if (!userEmail || typeof userEmail !== 'string' || userEmail.trim() === '') {
      issues.push('User email is required and must be a valid string');
    }
    
    // Check amount
    const amount = Math.round(orderTotal * 100);
    if (orderTotal <= 0 || amount <= 0) {
      issues.push('Order total must be greater than 0');
    }
    
    if (amount < 100) {
      issues.push('Amount too small. Minimum is 1.00');
    }
    
    // Check currency
    if (!currency || !['USD', 'NGN'].includes(currency)) {
      issues.push('Invalid currency. Must be USD or NGN');
    }
    
    // Check public key
    const publicKey = env.PAYSTACK_PUBLIC_KEY;
    if (!publicKey || typeof publicKey !== 'string' || publicKey.includes('your_public_key') || publicKey.trim() === '') {
      issues.push('Invalid Paystack public key');
    }
    
    return issues;
  };

  const paystackIssues = validatePaystackParams();

  // Debug Paystack parameters
  console.log('Paystack Debug:', {
    email: currentUser?.email,
    amount: Math.round(orderTotal * 100),
    publicKey: env.PAYSTACK_PUBLIC_KEY,
    currency: currency === 'USD' ? 'USD' : 'NGN',
    orderTotal,
    issues: paystackIssues
  });

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
                <AmountCurrency amount={balance} fromCurrency={currency || 'USDT'} />
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
                      fromCurrency={item.currency || item.product?.currency || cart.currency || 'USDT'} 
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
        
         {/* Order Totals */}
         <div className="space-y-3 ">
          <div className="flex justify-between text-white text-base">
            <span>Subtotal</span>
            <span className="font-medium">
              {isUSDOrUSDT ? (
                // For USD/USDT: Show in USD directly (don't convert, use base USD)
                <span className="text-white leading-snug">
                  {currencyConversionService.formatCurrency(finalSubtotalInUSD, 'USD')}
                </span>
              ) : (
                // For NGN: Show converted amount (use cart currency which may be NGN)
                <AmountCurrency 
                  amount={cart.subtotal || getCartTotal()} 
                  fromCurrency={cart.currency || 'USD'} 
                />
              )}
            </span>
          </div>
          
          <div className="flex justify-between text-white text-base">
            <span>Delivery</span>
            <span className="font-medium">
              {isUSDOrUSDT ? (
                // For USD/USDT: Show delivery in USD (convert from NGN to USD)
                <span className="text-white leading-snug">
                  {currencyConversionService.formatCurrency(finalDeliveryCostInUSD, 'USD')}
                </span>
              ) : (
                // For NGN: Show delivery in NGN
                <AmountCurrency 
                  amount={deliveryMethod?.price || 0} 
                  fromCurrency={deliveryMethod?.currency || 'NGN'} 
                />
              )}
            </span>
          </div>
          
          <Separator className="bg-[#38383a]" />
          
          <div className="flex justify-between text-white text-lg font-semibold">
            <span>Order Total</span>
            <span>
              {isUSDOrUSDT ? (
                // For USD/USDT: Show total in USD directly (subtotal + delivery)
                <span className="text-white leading-snug">
                  {currencyConversionService.formatCurrency(orderTotal, 'USD')}
                </span>
              ) : (
                // For NGN: Show converted total
                <AmountCurrency amount={orderTotal} fromCurrency={orderTotalCurrency} />
              )}
            </span>
          </div>
          
      {/* Action Buttons - Outside Card */}
      <div className="space-y-4 pt-6 md:px-2 relative">
        {paymentMethod === 'crypto' ? (
          // Crypto payment button (USDT) - always show amount in USDT, never convert to user currency
          <Button 
            onClick={onPlaceOrder}
            disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
          >
            {isPlacingOrder ? 'Creating Payment...' : (
              <>
                Pay{' '}
                <span className="ml-1 text-white">
                  {currencyConversionService.formatCurrency(orderTotal, 'USDT')}
                </span>
              </>
            )}
          </Button>
        ) : (
          // Paystack payment button (USD/NGN)
          <PaystackButton
            publicKey={env.PAYSTACK_PUBLIC_KEY}
            email={currentUser?.email || ''}
            amount={Math.round(orderTotal * 100)} // Convert to kobo/cent
            currency={currency === 'USD' ? 'USD' : 'NGN'}
            onSuccess={onPaystackSuccess}
            onClose={onPaystackClose}
            disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod) || paystackIssues.length > 0}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
          >
            {isPlacingOrder ? 'Processing...' : (
              <>
                Pay{' '}
                <AmountCurrency 
                  amount={convertedAmount > 0 ? convertedAmount : orderTotal} 
                  fromCurrency={currency || orderTotalCurrency} 
                  className="ml-1"
                />
              </>
            )}
          </PaystackButton>
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