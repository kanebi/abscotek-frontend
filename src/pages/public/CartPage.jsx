import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout';
import { Button } from '../../components/ui/button';
import { Card } from '../../components/ui/card';
import { Separator } from '../../components/ui/separator';
import AmountCurrency from '../../components/ui/AmountCurrency';
import { DeleteCartItemModal } from '../../components/modals';
import useStore from '../../store/useStore';
import { AppRoutes } from '../../config/routes';
import { Minus, Plus, Trash2 } from 'lucide-react';

function CartPage() {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, item: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  
  const { 
    cart, 
    cartLoading, 
    cartUpdating, 
    userCurrency,
    updateCartQuantity,
    removeFromCart,
    getCartTotal,
    getCartItemCount
  } = useStore();

  const handleUpdateQuantity = (productId, newQuantity) => {
    updateCartQuantity(productId, newQuantity);
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.item) return;
    
    setIsDeleting(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      removeFromCart(deleteModal.item.productId);
      setDeleteModal({ isOpen: false, item: null });
    } catch (error) {
      console.error('Error removing item:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, item: null });
  };

  const handleCheckout = () => {
    navigate(AppRoutes.checkout.path);
  };

  if (cartLoading) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <div className="text-center text-white">Loading cart...</div>
        </div>
      </Layout>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Layout>
        <div className="w-[86%] mx-auto py-8">
          <h1 className="md:text-2xl text-xl font-semibold font-heading-header-2-header-2-bold text-white mb-8">Shopping Cart</h1>
          
          {/* Empty State - Centered */}
          <div className="flex flex-col items-center justify-center md:min-h-[400px] min-h-[500px] text-center">
            <div className="w-16 h-16 mb-6">
              <img 
                src="/images/solar_bag-3-bold.svg" 
                alt="Empty cart" 
                className="w-full h-full opacity-90"
              />
            </div>
            <p className="text-neutralneutral-100 font-body-base-base-regular text-lg">
              Your cart is empty
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="w-[86%] mx-auto py-8">
        <h1 className="md:text-3xl text-xl font-heading-header-2-header-2-bold text-white mb-8">Shopping Cart</h1>
        
        {/* Mobile Layout - Show on small screens */}
        <div className="md:hidden">
          {/* Cart Items - Mobile */}
          <div className="space-y-4 mb-6">
            {cart.items.map((item, index) => (
              <div key={item.productId}>
                <div className="flex items-start py-4 relative">
                  {/* Product Image */}
                  <div className="w-[90px] h-[90px] bg-neutralneutral-800 rounded-lg flex-shrink-0 mr-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1 pr-10">
                    <h3 className="text-white font-medium text-base mb-2">{item.name}</h3>
                    <div className="text-white text-lg font-semibold mb-3">
                      <AmountCurrency amount={item.price} fromCurrency={userCurrency} />
                    </div>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 border border-[#404040] rounded-lg w-fit">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={cartUpdating || item.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutralneutral-700 disabled:opacity-50 rounded-l-lg"
                      >
                        <Minus size={14} className="text-white" />
                      </button>
                      <span className="text-white font-medium px-3 py-1 min-w-[2.5rem] text-center bg-transparent text-sm">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={cartUpdating}
                        className="w-8 h-8 flex items-center justify-center hover:bg-neutralneutral-700 disabled:opacity-50 rounded-r-lg"
                      >
                        <Plus size={14} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Delete Button - Bottom Right */}
                  <button
                    onClick={() => handleDeleteClick(item)}
                    disabled={cartUpdating}
                    className="absolute bottom-4 right-0 p-2 hover:bg-neutralneutral-700 rounded-lg disabled:opacity-50"
                  >
                    <Trash2 size={18} className="text-neutralneutral-400 hover:text-white" />
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          {/* Summary - Mobile */}
          <div className="mt-8">
            <div className="bg-neutralneutral-800 rounded-xl p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
              <Separator className="mb-6 bg-[#404040] h-0.3" />
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span className="text-sm">
                    <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
                  </span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Order Total</span>
                  <span className="font-semibold">
                    <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-xl font-medium"
                disabled={cartUpdating}
              >
                Checkout
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop Layout - Show on medium screens and up */}
        <div className="hidden md:grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 rounded-lg p-6" style={{ backgroundColor: '#1F1F21' }}>
            {cart.items.map((item, index) => (
              <div key={item.productId}>
                <div className="flex items-center py-6">
                  {/* Product Image */}
                  <div className="w-20 h-20 bg-neutralneutral-800 rounded-lg flex-shrink-0 mr-4">
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="text-white font-medium text-base mb-3">{item.name}</h3>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-0 border border-[#404040] rounded-lg w-fit">
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={cartUpdating || item.quantity <= 1}
                        className="w-10 h-10 flex items-center justify-center hover:bg-neutralneutral-700 disabled:opacity-50 rounded-l-lg"
                      >
                        <Minus size={16} className="text-white" />
                      </button>
                      <span className="text-white font-medium px-4 py-2 min-w-[3rem] text-center bg-transparent">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={cartUpdating}
                        className="w-10 h-10 flex items-center justify-center hover:bg-neutralneutral-700 disabled:opacity-50 rounded-r-lg"
                      >
                        <Plus size={16} className="text-white" />
                      </button>
                    </div>
                  </div>
                  
                  {/* Price and Delete Column */}
                  <div className="flex flex-col items-end gap-2">
                    {/* Price */}
                    <div className="text-white text-lg font-heading-header-3-header-3-semibold">
                      <AmountCurrency amount={item.price} fromCurrency={userCurrency} />
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => handleDeleteClick(item)}
                      disabled={cartUpdating}
                      className="p-2 hover:bg-neutralneutral-700 rounded-lg disabled:opacity-50"
                    >
                      <Trash2 size={18} className="text-neutralneutral-400 hover:text-white" />
                    </button>
                  </div>
                </div>
                
                {/* Separator - Show after every item except the last */}
                {index !== cart.items.length - 1 && (
                  <Separator className="bg-[#404040] h-0.3" />
                )}
              </div>
            ))}
          </div>
          
          {/* Summary */}
          <div className="lg:col-span-1 space-y-4">
            <div className="rounded-xl p-6 sticky top-4" style={{ backgroundColor: '#1F1F21' }}>
              <h2 className="text-xl font-semibold text-white mb-4">Summary</h2>
              <Separator className="mb-6 bg-[#404040] h-0.3" />
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span className="text-sm ">
                    <AmountCurrency  amount={getCartTotal()} fromCurrency={userCurrency} />
                  </span>
                </div>
                <div className="flex justify-between text-white text-lg">
                  <span>Order Total</span>
                  <span className="font-semibold" >
                    <AmountCurrency amount={getCartTotal()} fromCurrency={userCurrency} />
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleCheckout}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-xl font-medium"
                disabled={cartUpdating}
              >
                Checkout
              </Button>
            </div>
            
            {/* Continue Shopping - Outside Summary Card */}
            <Link to={AppRoutes.home.path} className="flex items-center text-sm justify-center text-white hover:text-neutralneutral-200 transition-colors">
              <img 
                src="/images/ic_outline-arrow-back-ios.svg" 
                alt="Back" 
                className="w-4 h-4 mr-[5px]"
              />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCartItemModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.item?.name}
        isDeleting={isDeleting}
      />
    </Layout>
  );
}

export default CartPage; 