import React from 'react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import AmountCurrency from '../ui/AmountCurrency';
import useStore from '../../store/useStore';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AppRoutes } from '../../config/routes';

function OrderSummary({ onPlaceOrder, isPlacingOrder = false, hasSelectedAddress = false }) {
  const { cart, userCurrency, getCartTotal } = useStore();

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <>
        <div className="rounded-xl p-6 border border-[#2C2C2E]" style={{ backgroundColor: '#1F1F21' }}>
          <h2 className="text-xl font-semibold text-white mb-4">My Order</h2>
          <Separator className="mb-4 bg-[#2C2C2E]" />
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
      <div className="rounded-xl p-6 sm:pb-4 bottom-10 md:mb-0 sticky top-4 border border-none md:border-[#2C2C2E] md:bg-[#1F1F21] bg-opacity-0">
        <h2 className="text-xl font-semibold text-white mb-6">My Order</h2>
        <Separator className="mb-6 bg-[#2C2C2E]" />
        
        {/* Order Items */}
        <div className="space-y-4 mb-6">
          {cart.items.map((item, index) => (
            <div key={item.productId}>
              <div className="flex items-center gap-3">
                {/* Product Image */}
                <div className="w-20 h-20 bg-neutralneutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                
                {/* Product Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium text-base mb-1 leading-tight">{item.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-neutralneutral-400 mb-2">
                    <span>Qty: {item.quantity}</span>
                    <span>Color: Blue</span>
                  </div>
                  <div className="text-white font-semibold text-base">
                    <AmountCurrency amount={item.price * item.quantity} fromCurrency={userCurrency} />
                  </div>
                </div>
              </div>
              
              {index < cart.items.length - 1 && (
                <Separator className="my-4 bg-[#2C2C2E]" />
              )}
            </div>
          ))}
        </div>
        
         {/* Order Totals */}
         <div className="space-y-3 mb-6">
          <div className="flex justify-between text-white text-base">
            <span>Subtotal</span>
            <span className="font-medium">
              <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
            </span>
          </div>
          
          <div className="flex justify-between text-white text-base">
            <span>Delivery</span>
            <span className="font-medium">
              <AmountCurrency amount={0} fromCurrency={userCurrency} />
            </span>
          </div>
          
          <Separator className="bg-[#2C2C2E]" />
          
          <div className="flex justify-between text-white text-lg font-semibold">
            <span>Order Total</span>
            <span>
              <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
            </span>
          </div>
          
      {/* Action Buttons - Outside Card */}
      <div className="space-y-4 pt-6 px-2 relative">
        <Button 
          onClick={onPlaceOrder}
          disabled={isPlacingOrder || !hasSelectedAddress}
          className="w-full bg-red-500 hover:bg-red-600 text-white px-12 py-3 rounded-lg font-medium disabled:opacity-50 text-base"
        >
          {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
        </Button>
        
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