import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import group from "../../assets/images/solar_copy-linear.svg";


const ProfileHeader = () => {
  const walletAddress = "0xCbdc...3432";

  const summaryCards = [
    { title: "Balance", value: "0" },
    { title: "Order", value: "0" },
  ];

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(walletAddress);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between top-0 w-full gap-6 md:gap-0">
      <div className="flex flex-col items-start gap-2 md:gap-3.5">
        <h2 className="text-lg md:text-2xl font-heading-header-1-header-1-semibold font-[number:var(--heading-header-1-header-1-semibold-font-weight)] text-defaultwhite text-[length:var(--heading-header-1-header-1-semibold-font-size)] tracking-[var(--heading-header-1-header-1-semibold-letter-spacing)] leading-[var(--heading-header-1-header-1-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-1-header-1-semibold-font-style)]">
          {walletAddress}
        </h2>

        <div className="flex items-center gap-1 md:gap-2 w-full">
          <div className="flex items-start gap-1">
            <span className="text-xs md:text-base font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] text-center tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
              address:
            </span>

            <span className="text-xs md:text-base font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultwhite text-[length:var(--body-large-large-regular-font-size)] text-center tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
              {walletAddress}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 md:w-6 md:h-6 p-0 hover:bg-defaulttop-background ml-1"
            onClick={handleCopyAddress}
            aria-label="Copy address"
          >
            <img
              className="w-4 h-4 md:w-5 md:h-[22px] mx-auto"
              alt="Copy address"
              src={group}
            />
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-[18px] w-full md:w-auto">
        {summaryCards.map((card, index) => (
          <Card
            key={index}
            className="border-none flex-1 md:flex-none px-4 py-3 md:px-6 md:py-4 w-full md:w-[151px] h-[70px] md:h-[90px] bg-defaulttop-background rounded-xl md:rounded-2xl overflow-hidden"
          >
            <CardContent className="flex flex-col items-center gap-1 md:gap-3 p-0">
              <h3 className="self-stretch mt-[-1.00px] [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-white text-xs md:text-base text-center tracking-[0] leading-[16px] md:leading-[22.4px]">
                {card.title}
              </h3>
              <p className="self-stretch [font-family:'Mona_Sans-SemiBold',Helvetica] font-semibold text-white text-sm md:text-base text-center tracking-[0] leading-[18px] md:leading-[22.4px]">
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProfileHeader;
