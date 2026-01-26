import React, { useState, useEffect } from "react";
import { X, Minus, Plus, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";
import { Separator } from "./separator";
import AmountCurrency from "./AmountCurrency";
import DeleteCartItemModal from "../modals/DeleteCartItemModal";
import useStore from "../../store/useStore";
import { cn } from "../../lib/utils";

export default function SliderCart({ triggerClassName = ""}) {
  const [isOpen, setIsOpen] = useState(false);
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
    getCartItemCount,
    loadGuestCart,
    token
  } = useStore();
  
  const defaultTopBackground = "rgba(36, 36, 36, 1)";

  useEffect(() => {
    if (!token) {
      loadGuestCart();
    }
  }, [token, loadGuestCart]);

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when drawer is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleUpdateQuantity = (productId, newQuantity, variantName = null, specs = null) => {
    updateCartQuantity(productId, newQuantity, variantName, specs);
  };

  const handleDeleteClick = (item) => {
    setDeleteModal({ isOpen: true, item });
  };

  const handleDeleteConfirm = async () => {
console.log('handleDeleteConfirm deleteModal.item', deleteModal.item);
if (!deleteModal.item) return;

setIsDeleting(true);
try {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  const productIdToDelete = deleteModal.item.product?._id || deleteModal.item.productId;
  removeFromCart(productIdToDelete);
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

  const closeDrawer = () => {
    setIsOpen(false);
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeDrawer();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <>
      {/* Cart Trigger Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]",
          triggerClassName
        )}
        style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
        onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
        onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
      >
        <img
          className="w-5 h-5 absolute top-0 left-0 right-0 bottom-0 m-auto"
          alt="Bag"
          src="/images/solar-bag-3-bold.svg"
        />
        {/* Cart Item Count Badge */}
        {cart && getCartItemCount() > 0 && (
          <span className="absolute top-[2px] right-[4px] w-[14px] h-[14px] bg-primaryp-300 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
            {getCartItemCount()}
          </span>
        )}
      </Button>

      {/* Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeDrawer}
          aria-hidden="true"
        />
      )}

      {/* Cart Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-full sm:w-96 bg-neutral-950  shadow-2xl z-50 transition-transform duration-300 ease-in-out flex flex-col",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
                 {/* Header */}
         <div className="flex items-center justify-between p-6 border-b border-neutralneutral-700">
           <h2 className="text-xl text-white font-heading-header-3-header-3-bold font-bold">
             Cart
           </h2>
           <button
             onClick={closeDrawer}
             className="w-6 h-6 text-neutralneutral-200 hover:text-white transition-colors"
             aria-label="Close cart"
           >
             <X size={24} />
           </button>
         </div>

        {/* Cart Content */}
        <div className="flex-1 overflow-y-auto">
          {cartLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
          ) : !cart || !cart.items || cart.items.length === 0 ? (
             /* Empty State */
             <div className="flex flex-col items-center text-white justify-center h-full px-6" style={{ paddingTop: '-20px' }}>
               <div className="w-16 h-16 mb-4">
                 <img 
                   src="/images/solar_bag-3-bold.svg" 
                   alt="Empty cart" 
                   className="w-full h-full opacity-100"
                 />
               </div>
               <p className="text-lg font-body-large-large-regular text-white text-center">
                 Your cart is empty
               </p>
             </div>
                     ) : (
             /* Cart Items */
             <div className="p-6 space-y-6">
               {cart.items.map((item, index) => (
                 <div key={item.product?._id || item.productId || index} className="flex items-start gap-4">
                   {/* Product Image */}
                   <div className="w-20 h-20 bg-neutralneutral-800 rounded-lg flex-shrink-0 overflow-hidden">
                     {item.product && item.product.images && item.product.images.length > 0 ? (
                       <img
                         src={item.product.images[0]}
                         alt={item.product.name}
                         className="w-full h-full object-cover"
                       />
                     ) : (
                       <div className="w-full h-full flex items-center justify-center text-neutralneutral-400 text-xs">
                         No Image
                       </div>
                     )}
                   </div>

                   {/* Product Info */}
                   <div className="flex-1 min-w-0">
                     <h3 className="text-white font-medium text-base mb-2 leading-tight">
                       {item.product?.name || item.name || 'Product'}
                     </h3>

                     <div className="text-white font-bold text-lg mb-4">
                       <AmountCurrency 
                         amount={item.unitPrice || item.product?.price || item.price} 
                         fromCurrency={item.currency || item.product?.currency || cart.currency || 'USDT'} 
                       />
                     </div>
                     
                     {/* Quantity Controls and Delete Button Row */}
                     <div className="flex items-center justify-between">
                       {/* Quantity Controls */}
                       <div className="flex items-center gap-0 border border-neutralneutral-600 rounded-lg w-fit">
                         <button
                           onClick={() => handleUpdateQuantity(item.product?._id || item.productId, item.quantity - 1, item.variant?.name, item.specs)}
                           disabled={cartUpdating || item.quantity <= 1}
                           className="w-10 h-10 flex items-center justify-center hover:bg-neutralneutral-800 disabled:opacity-50 rounded-l-lg"
                         >
                           <Minus size={16} className="text-white" />
                         </button>
                         <span className="text-white font-medium px-4 py-2 min-w-[3rem] text-center bg-transparent">
                           {item.quantity}
                         </span>
                         <button
                           onClick={() => handleUpdateQuantity(item.product?._id || item.productId, item.quantity + 1, item.variant?.name, item.specs)}
                           disabled={cartUpdating}
                           className="w-10 h-10 flex items-center justify-center hover:bg-neutralneutral-800 disabled:opacity-50 rounded-r-lg"
                         >
                           <Plus size={16} className="text-white" />
                         </button>
                       </div>

                       {/* Delete Button */}
                       <button
                         onClick={() => handleDeleteClick(item)}
                         disabled={cartUpdating}
                         className="p-2 hover:bg-neutralneutral-800 rounded-lg disabled:opacity-50"
                       >
                         <img
                           src="/images/fluent_delete-20-regular.svg"
                           alt="Delete"
                           className="w-6 h-6"
                         />
                       </button>
                     </div>
                   </div>
                 </div>
               ))}
             </div>
           )}
        </div>

                 {/* Footer with Total and Checkout (only show if cart has items) */}
         {cart && cart.items && cart.items.length > 0 && (
           <div className="border-t border-neutralneutral-700 p-6 mt-auto">
             <div className="space-y-6">
               {/* Subtotal */}
               <div className="flex flex-col items-end text-right">
                 <span className="text-white text-sm">Subtotal</span>
                 <div className="text-white text-2xl font-bold">
                   <AmountCurrency amount={cart.subtotal || getCartTotal()} fromCurrency={cart.currency || 'USDT'} />
                 </div>
               </div>
               
               {/* Buttons */}
               <div className="space-y-3">
                 <Button
                   variant="outline"
                   className="w-full border border-red-500 text-white hover:bg-neutralneutral-800 bg-transparent py-6 rounded-xl font-medium text-base h-14"
                   onClick={() => {
                     closeDrawer();
                     navigate('/cart');
                   }}
                 >
                   View Cart
                 </Button>

                 <Button
                   className="w-full bg-red-500 hover:bg-red-600 text-white py-6 rounded-xl font-medium text-base h-14 border-0"
                   onClick={() => {
                     closeDrawer();
                     // Navigate to funding or checkout page
                     navigate('/checkout');
                   }}
                 >
                   Checkout
                 </Button>
               </div>
             </div>
           </div>
         )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteCartItemModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteModal.item?.product?.name || deleteModal.item?.name || 'Product'}
        isDeleting={isDeleting}
      />
    </>
  );
}