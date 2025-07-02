import * as React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ShoppingCart } from "lucide-react";
import { Button } from "./button";

export default function SliderCart({ triggerClassName = ""}) {
  const defaultTopBackground = "rgba(36, 36, 36, 1)";
  return (
    <Drawer direction="right">
      <DrawerTrigger  asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative w-10 h-10 items-center justify-center gap-[11.11px] px-[13.33px] py-[11.11px] bg-defaulttop-background rounded-[13.33px] overflow-hidden transition-colors hover:!bg-[rgba(36,36,36,0.8)]"
          style={{ background: `var(--defaulttop-background, ${defaultTopBackground})` }}
          onMouseOver={e => e.currentTarget.style.background = 'rgba(36,36,36,0.8)'}
          onMouseOut={e => e.currentTarget.style.background = `var(--defaulttop-background, ${defaultTopBackground})`}
        >
          <img
            className="w-5 h-5 text-white absolute top-0 left-0 right-0 bottom-0 m-auto"
            alt="Bag"
            src="/images/solar-bag-3-bold.svg"
          />
        </Button>

      </DrawerTrigger>
      <DrawerContent className="w-96 h-[1024px] bg-neutral-900 shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] overflow-hidden border-none p-0">
        <div className="w-96 left-0 top-0 inline-flex flex-col justify-center items-center gap-6">
          <div className="self-stretch pt-5 bg-neutral-900 flex flex-col justify-start items-start gap-2.5 overflow-hidden">
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch px-6 inline-flex justify-between items-center">
                <div className="justify-start text-white text-xl font-semibold font-['Mona_Sans'] leading-relaxed">Cart</div>
                <div className="w-6 h-6 relative overflow-hidden">
                  <div className="w-2.5 h-2.5 left-[6.76px] top-[6.76px] absolute outline outline-[1.50px] outline-offset-[-0.75px] outline-white" />
                </div>
              </div>
              <div className="self-stretch h-px bg-neutral-700" />
            </div>
          </div>
        </div>
        <div className="w-36 left-[143px] top-[274px] absolute inline-flex flex-col justify-start items-center gap-3">
          <div className="w-12 h-12 relative overflow-hidden">
            <div className="w-10 h-9 left-[5.95px] top-[8.67px] absolute bg-white" />
          </div>
          <div className="self-stretch justify-start text-white text-lg font-normal font-['Mona_Sans'] leading-relaxed">Your cart is empty</div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
