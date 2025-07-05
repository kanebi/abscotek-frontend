import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";

export default function SuccessModal({ open, onOpenChange }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-none bg-transparent p-2.5 md:p-0 shadow-none w-[calc(100vw-20px)] max-w-[530px] left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]">
        <Card className="inline-flex flex-col items-center justify-center gap-6 md:gap-[30px] px-4 md:px-[19px] py-6 md:py-[35px] relative bg-[#121214] rounded-[20px] md:rounded-[30px] border-none">
          <CardContent className="flex-col w-full max-w-[492px] gap-3 md:gap-4 flex items-center justify-center relative flex-[0_0_auto] p-0">
            {/* Success Icon - Using SVG since we don't have the image */}
            <div className="relative w-20 h-20 md:w-[120px] md:h-[120px] bg-primaryp-300 rounded-full flex items-center justify-center">
              <svg
                className="w-10 h-10 md:w-16 md:h-16 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M20 6L9 17L4 12"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h2 className="relative w-fit font-heading-header-3-header-3-semibold font-[number:var(--heading-header-3-header-3-semibold-font-weight)] text-defaultwhite text-lg md:text-[length:var(--heading-header-3-header-3-semibold-font-size)] text-center tracking-[var(--heading-header-3-header-3-semibold-letter-spacing)] leading-[var(--heading-header-3-header-3-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-3-header-3-semibold-font-style)]">
              Success
            </h2>

            <p className="relative self-stretch font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-neutralneutral-50 text-sm md:text-[length:var(--body-large-large-regular-font-size)] text-center tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] [font-style:var(--body-large-large-regular-font-style)] px-2 md:px-0">
              You&apos;ve successfully withdraw to your wallet address.
            </p>
          </CardContent>

          <Button
            onClick={() => onOpenChange(false)}
            className="gap-2.5 px-6 md:px-7 py-3 md:py-[13px] self-stretch w-full bg-primaryp-300 hover:bg-primaryp-400 rounded-xl flex items-center justify-center relative flex-[0_0_auto] h-auto"
            variant="default"
          >
            <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-sm md:text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
              Done
            </span>
          </Button>
        </Card>
      </DialogContent>
    </Dialog>
  );
} 