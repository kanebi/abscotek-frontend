import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import AmountCurrency from '../ui/AmountCurrency';
import useStore from '../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../config/routes';
import { PaystackButton } from 'react-paystack';

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
  onPaystackClose
}) {
  const { cart, userCurrency, getCartTotal, currentUser } = useStore();
  
  const deliveryCost = deliveryMethod ? deliveryMethod.price : 0;
  // For order total calculation, we should use the converted amount if available
  // Otherwise, we need to handle currency conversion properly
  const orderTotal = convertedAmount > 0 ? convertedAmount : getCartTotal();

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
    const publicKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
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
    publicKey: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
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
                {balance.toFixed(4)} {currency}
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
                  {(item.image || item.product?.images?.[0]) && (
                    <img
                      src={item.image || item.product?.images?.[0]}
                      alt={item.name || item.product?.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-base mb-1 leading-tight">{item.product?.name || item.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-neutralneutral-400 mb-2">
                    <span>Qty: {item.quantity}</span>
                    <span>Color: Blue</span>
                  </div>
                  <div className="text-white font-[510] text-base">
                    <AmountCurrency amount={(item.product?.price || item.price || item.unitPrice) * item.quantity} fromCurrency={userCurrency} />
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
              <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
            </span>
          </div>
          
          <div className="flex justify-between text-white text-base">
            <span>Delivery</span>
            <span className="font-medium">
              <AmountCurrency amount={deliveryCost} fromCurrency={deliveryMethod?.currency || 'NGN'} />
            </span>
          </div>
          
          <Separator className="bg-[#38383a]" />
          
          <div className="flex justify-between text-white text-lg font-semibold">
            <span>Order Total</span>
            <span>
              <AmountCurrency amount={orderTotal} fromCurrency={userCurrency} />
            </span>
          </div>
          
      {/* Action Buttons - Outside Card */}
      <div className="space-y-4 pt-6 md:px-2 relative">
        {paymentMethod === 'wallet' ? (
          <Button 
            onClick={onPlaceOrder}
            disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod)}
            className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
          >
            {isPlacingOrder ? 'Placing Order...' : 'Pay with Wallet'}
          </Button>
        ) : (
          <div>
            {paystackIssues.length > 0 && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-500 rounded-lg">
                <div className="text-red-400 text-sm font-medium mb-2">Payment Issues:</div>
                <ul className="text-red-300 text-xs space-y-1">
                  {paystackIssues.map((issue, index) => (
                    <li key={index}>• {issue}</li>
                  ))}
                </ul>
              </div>
            )}
            <PaystackButton
              text={isPlacingOrder ? 'Processing...' : `Pay ${currency} ${paymentAmount.toFixed(2)}`}
              className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-6 rounded-lg font-medium disabled:opacity-50 text-base"
              onSuccess={onPaystackSuccess}
              onClose={onPaystackClose}
              disabled={isPlacingOrder || !hasSelectedAddress || (requireDeliveryMethod && !deliveryMethod) || paystackIssues.length > 0}
              email={currentUser?.email || 'customer@example.com'}
              amount={Math.round(paymentAmount * 100)}
              publicKey={import.meta.env.VITE_PAYSTACK_PUBLIC_KEY || 'pk_test_512a1b247e7f092f2f5de3d95bb70daa246c0cde'}
              currency={currency === 'USD' ? 'USD' : 'NGN'}
              metadata={{
                order_total: paymentAmount,
                currency: currency,
                user_wallet: userWalletAddress,
                user_id: currentUser?._id || 'guest'
              }}
            />
          </div>
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