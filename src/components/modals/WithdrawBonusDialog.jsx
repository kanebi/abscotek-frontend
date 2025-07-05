import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DIALOG_CLASSES } from "@/components/constants";

export default function WithdrawBonusDialog({ open, onOpenChange, onSuccess }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleWithdraw = async () => {
    if (!walletAddress.trim()) return;
    
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    
    // Close dialog and show success
    onOpenChange(false);
    onSuccess();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CLASSES.contentMobile}>
        <DialogHeader className={DIALOG_CLASSES.header}>
          <DialogTitle className={DIALOG_CLASSES.title}>
            Withdraw Bonus
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 md:gap-6 mt-4 md:mt-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-defaultwhite">
              Wallet Address
            </label>
            <Input
              type="text"
              placeholder="Enter your wallet address"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="bg-[#2A2A2C] border border-white/10 text-defaultwhite placeholder:text-neutralneutral-400 focus:border-primaryp-400 focus:ring-primaryp-400/20"
              required
            />
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-white/20 text-defaultwhite hover:bg-white/10 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!walletAddress.trim() || isLoading}
              className="flex-1 bg-primaryp-500 hover:bg-primaryp-600 text-white"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Processing...
                </div>
              ) : (
                'Withdraw'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 