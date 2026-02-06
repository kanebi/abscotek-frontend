import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

export default function ComingSoonModal({ open, onOpenChange, title = "Coming Soon" }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#1F1F21] border border-[#2C2C2E] rounded-2xl shadow-xl max-w-md p-0 overflow-hidden">
        <div className="p-6 md:p-8">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
          <div className="flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#FF5059]/20 flex items-center justify-center border border-[#FF5059]/30">
              <span className="text-3xl">🚀</span>
            </div>
            <h2 className="text-xl md:text-2xl font-semibold text-white">
              {title}
            </h2>
            <p className="text-neutral-400 text-sm md:text-base max-w-sm">
              We're working hard to bring this feature to you. Stay tuned!
            </p>
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full max-w-xs bg-[#FF5059] hover:bg-[#FF5059]/90 text-white font-medium py-3 rounded-xl transition-colors"
            >
              Got it
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
