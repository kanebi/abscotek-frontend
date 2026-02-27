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
import referralService from "@/services/referralService";
import useNotificationStore from "@/store/notificationStore";

export default function WithdrawBonusDialog({ open, onOpenChange, onSuccess, availableBalance = 0 }) {
  const [walletAddress, setWalletAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { addNotification } = useNotificationStore();

  const handleWithdraw = async () => {
    if (!walletAddress.trim()) {
      setError("Wallet address is required");
      return;
    }

    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    const withdrawAmount = parseFloat(amount);
    
    if (withdrawAmount > availableBalance) {
      setError(`Insufficient balance. Available: ${availableBalance.toFixed(2)} USDC`);
      return;
    }

    // Validate wallet address format
    if (!/^0x[0-9a-fA-F]{40}$/.test(walletAddress)) {
      setError("Invalid wallet address format");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await referralService.withdrawBonus(withdrawAmount, walletAddress);
      
      // Close dialog and show success
      onOpenChange(false);
      setWalletAddress("");
      setAmount("");
      onSuccess(response);
      
      addNotification(`Withdrawal of ${withdrawAmount} USDC submitted successfully!`, 'success');
    } catch (err) {
      const errorMsg = err?.errors?.[0]?.msg || err?.message || 'Withdrawal failed. Please try again.';
      setError(errorMsg);
      addNotification(errorMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMaxClick = () => {
    setAmount(availableBalance.toString());
    setError("");
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
          {/* Available Balance Display */}
          <div className="bg-[#2A2A2C] border border-white/10 rounded-lg p-4">
            <div className="text-sm text-neutralneutral-400 mb-1">Available Balance</div>
            <div className="text-2xl font-bold text-white">{availableBalance.toFixed(2)} USDC</div>
          </div>

          {/* Amount Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-defaultwhite">
              Amount (USDC)
            </label>
            <div className="relative">
              <Input
                type="number"
                step="0.01"
                min="0"
                max={availableBalance}
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError("");
                }}
                className="bg-[#2A2A2C] border border-white/10 text-defaultwhite placeholder:text-neutralneutral-400 focus:border-primaryp-400 focus:ring-primaryp-400/20 pr-16"
                required
              />
              <Button
                type="button"
                onClick={handleMaxClick}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 px-3 text-xs bg-primaryp-500 hover:bg-primaryp-600"
                disabled={availableBalance <= 0}
              >
                MAX
              </Button>
            </div>
          </div>

          {/* Wallet Address Input */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-defaultwhite">
              Wallet Address
            </label>
            <Input
              type="text"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => {
                setWalletAddress(e.target.value);
                setError("");
              }}
              className="bg-[#2A2A2C] border border-white/10 text-defaultwhite placeholder:text-neutralneutral-400 focus:border-primaryp-400 focus:ring-primaryp-400/20"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <p className="text-sm text-red-400">{error}</p>
            </div>
          )}
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => {
                onOpenChange(false);
                setError("");
                setWalletAddress("");
                setAmount("");
              }}
              className="flex-1 border-white/20 text-defaultwhite hover:bg-white/10 bg-transparent"
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              onClick={handleWithdraw}
              disabled={!walletAddress.trim() || !amount || isLoading || availableBalance <= 0}
              className="flex-1 bg-primaryp-500 hover:bg-primaryp-600 text-white disabled:opacity-50"
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