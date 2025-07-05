import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import React, { useState } from "react";

export default function WithdrawBonusDialog({ open, onOpenChange, onSuccess }) {
  const [walletAddress, setWalletAddress] = useState("");

  const handleWithdraw = () => {
    // Handle withdrawal logic here
    console.log("Withdrawing to:", walletAddress);
    onSuccess();
    setWalletAddress("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-20px)] max-w-[580px] p-4 md:p-6 bg-[#121214] rounded-[20px] md:rounded-[30px] border-none left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <DialogHeader className="flex items-start justify-center relative w-full">
          <DialogTitle className="font-heading-header-4-header-4-semibold font-[number:var(--heading-header-4-header-4-semibold-font-weight)] text-defaultwhite text-[length:var(--heading-header-4-header-4-semibold-font-size)] tracking-[var(--heading-header-4-header-4-semibold-letter-spacing)] leading-[var(--heading-header-4-header-4-semibold-line-height)] [font-style:var(--heading-header-4-header-4-semibold-font-style)] text-center text-lg md:text-xl">
            Withdraw Bonus
          </DialogTitle>
          <button
            onClick={() => onOpenChange(false)}
            className="absolute w-8 h-8 top-[-3px] right-0 bg-defaulttop-background rounded-[1000px] flex items-center justify-center hover:bg-neutralneutral-300"
          >
            <X className="w-5 h-5 md:w-6 md:h-6 text-defaultgrey" />
          </button>
        </DialogHeader>

        <div className="flex flex-col items-start gap-4 md:gap-6 mt-8 md:mt-12 w-full">
          <div className="flex flex-col items-start justify-center gap-2 w-full rounded-lg">
            <label
              htmlFor="wallet-address"
              className="font-body-large-large-medium font-[number:var(--body-large-large-medium-font-weight)] text-defaultgrey-2 text-sm md:text-[length:var(--body-large-large-medium-font-size)] tracking-[var(--body-large-large-medium-letter-spacing)] leading-[var(--body-large-large-medium-line-height)] [font-style:var(--body-large-large-medium-font-style)]"
            >
              Wallet Address
            </label>

            <div className="flex items-center w-full rounded-lg border border-solid border-[#3f3f3f]">
              <Input
                id="wallet-address"
                placeholder="Enter wallets address"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                className="border-none bg-transparent font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-200 text-sm md:text-[length:var(--body-large-large-regular-font-size)] tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)] px-3 md:px-3.5 py-2.5 md:py-3 h-auto"
              />
            </div>
          </div>

          <Button
            onClick={handleWithdraw}
            disabled={!walletAddress.trim()}
            className="w-full bg-primaryp-300 hover:bg-primaryp-400 disabled:bg-neutralneutral-300 disabled:cursor-not-allowed rounded-xl px-6 md:px-7 py-3 md:py-[13px] h-auto font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-sm md:text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)]"
          >
            Withdraw Bonuses
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 