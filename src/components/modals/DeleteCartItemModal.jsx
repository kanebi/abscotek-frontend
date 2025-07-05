import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { X, AlertTriangle } from "lucide-react";
import { DIALOG_CLASSES } from "../constants";

export default function DeleteCartItemModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  itemName, 
  isDeleting = false 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={DIALOG_CLASSES.contentMobile}>
        <DialogHeader className={DIALOG_CLASSES.header}>
          <DialogTitle className={DIALOG_CLASSES.title}>
            Remove Item
          </DialogTitle>
          <button
            onClick={onClose}
            className={DIALOG_CLASSES.closeButton}
            aria-label="Close modal"
          >
            <X size={16} />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4 md:gap-6 mt-4 md:mt-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-warningw-500/20 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-warningw-500" />
            </div>
          </div>

          {/* Content */}
          <div className="text-center">
            <p className="text-neutralneutral-200 font-body-base-base-regular mb-4">
              Are you sure you want to remove this item from your cart?
            </p>
            
            {itemName && (
              <div className="bg-[#2A2A2C] border border-white/10 rounded-lg p-3 mb-4">
                <p className="text-white font-medium text-sm truncate">
                  {itemName}
                </p>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="outline"
              onClick={onClose}
              disabled={isDeleting}
              className="flex-1 border-white/20 text-defaultwhite hover:bg-white/10 bg-transparent"
            >
              Cancel
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isDeleting}
              className="flex-1 bg-red-500 hover:bg-red-600 text-white font-medium"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Removing...
                </div>
              ) : (
                'Remove'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 