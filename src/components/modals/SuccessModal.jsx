import React from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { DIALOG_CLASSES } from "@/components/constants";

export default function SuccessModal({ open, onOpenChange, title = "Success!", message = "Operation completed successfully." }) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={DIALOG_CLASSES.contentMobile}>
        <div className="flex flex-col items-center text-center gap-4 md:gap-6 py-4">
          {/* Success Icon */}
          <div className="w-16 h-16 md:w-20 md:h-20 bg-successs-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 md:w-10 md:h-10 text-successs-500" />
          </div>
          
          {/* Title */}
          <h2 className="font-heading-header-3-header-3-bold text-defaultwhite text-xl md:text-2xl">
            {title}
          </h2>
          
          {/* Message */}
          <p className="font-body-base-base-regular text-neutralneutral-200 text-sm md:text-base max-w-sm">
            {message}
          </p>
          
          {/* Done Button */}
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full max-w-xs bg-primaryp-500 hover:bg-primaryp-600 text-white font-medium py-3 rounded-xl"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 