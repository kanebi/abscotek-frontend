import React from "react";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "../../lib/utils";

export default function DeleteCartItemModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  isDeleting = false 
}) {
  if (!isOpen) return null;

  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  return (
    <>
      {/* Backdrop Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className={cn(
          "bg-neutral-950 border border-neutralneutral-700 rounded-2xl shadow-2xl max-w-md w-full mx-4 transform transition-all duration-300 ease-out",
          isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
        )}>
          {/* Header */}
          <div className="flex items-center justify-between p-6">
            <h2 className="text-lg text-white font-heading-header-4-header-4-bold font-bold">
              Remove Item
            </h2>
            <button
              onClick={onClose}
              className="w-6 h-6 text-neutralneutral-400 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-6">
            <p className="text-neutralneutral-200 font-body-base-base-regular mb-4">
              Are you sure you want to remove this item from your cart?
            </p>
            
            {itemName && (
              <div className="bg-neutralneutral-900 rounded-lg p-3 mb-6">
                <p className="text-white font-medium text-sm truncate">
                  {itemName}
                </p>
              </div>
            )}
            
            {/* Actions */}
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isDeleting}
                className="flex-1 border-neutralneutral-600 text-white hover:bg-neutralneutral-800 bg-transparent h-11"
              >
                No
              </Button>
              <Button
                onClick={onConfirm}
                disabled={isDeleting}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white h-11 font-medium"
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Removing...
                  </div>
                ) : (
                  'Yes'
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 