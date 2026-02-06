import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import React, { useState, useEffect } from "react";
import group from "../../assets/images/solar_copy-linear.svg";
import useStore from "@/store/useStore";
import userService from "@/services/userService";
import orderService from "@/services/orderService";
import useNotificationStore from "@/store/notificationStore";

const ProfileHeader = () => {
  const { currentUser, walletAddress } = useStore();
  const { addNotification } = useNotificationStore();
  const [userBalance, setUserBalance] = useState(0);
  const [orderCount, setOrderCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Payment address (tied to user for crypto orders) takes priority; fallback to wallet/email
  const paymentAddress = currentUser?.cryptoPaymentAddress;
  const walletToShow = walletAddress || currentUser?.walletAddress;
  const addressToShow = paymentAddress || walletToShow;
  const displayAddress = addressToShow
    ? `${addressToShow.slice(0, 6)}...${addressToShow.slice(-4)}`
    : currentUser?.email || currentUser?.name || "Not connected";

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setLoading(true);

        // Fetch user profile to get latest walletAddress (attached during crypto checkout)
        const userData = await userService.getUser();
        if (userData) {
          useStore.getState().setCurrentUser?.(userData);
          if (userData.walletAddress) {
            useStore.getState().setWalletAddress?.(userData.walletAddress);
          }
          // Fetch crypto payment address if not in profile (lazy-create)
          if (!userData.cryptoPaymentAddress) {
            try {
              const addrRes = await userService.getCryptoPaymentAddress();
              if (addrRes?.address) {
                useStore.getState().setCurrentUser?.({ ...userData, cryptoPaymentAddress: addrRes.address });
              }
            } catch (e) {
              void e;
            }
          }
        }

        const statsData = await userService.getUserStats();
        setUserBalance(statsData.balance ?? userData?.balance ?? 0);
        setOrderCount(statsData.orderCount ?? 0);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        try {
          const userData = await userService.getUser();
          setUserBalance(userData?.balance ?? 0);
          const orders = await orderService.getOrders();
          setOrderCount(orders?.length ?? 0);
        } catch (fallbackError) {
          console.error('Error in fallback profile data fetch:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  const summaryCards = [
    { title: "Balance", value: loading ? "..." : `${userBalance.toFixed(2)} USDT` },
    { title: "Order", value: loading ? "..." : orderCount.toString() },
  ];

  const handleCopyAddress = () => {
    const fullAddress = addressToShow || currentUser?.email || "";
    if (fullAddress) {
      navigator.clipboard.writeText(fullAddress);
      addNotification({
        id: Date.now(),
        message: 'Address copied to clipboard!',
        type: 'success'
      });
    }
  };

  // When address is available, use it as primary display
  const primaryDisplay = addressToShow ? displayAddress : (currentUser?.name || currentUser?.email || "Not connected");

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between top-0 w-full gap-6 md:gap-0">
      <div className="flex flex-col items-start gap-2 md:gap-3.5">
        <h2 className="text-lg md:text-2xl font-heading-header-1-header-1-semibold font-[number:var(--heading-header-1-header-1-semibold-font-weight)] text-defaultwhite text-[length:var(--heading-header-1-header-1-semibold-font-size)] tracking-[var(--heading-header-1-header-1-semibold-letter-spacing)] leading-[var(--heading-header-1-header-1-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-1-header-1-semibold-font-style)]">
          {primaryDisplay}
        </h2>

      <div className="flex items-center gap-1 md:gap-2 w-full">
        <div className="flex items-start gap-1">
          <span className="text-xs md:text-base font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultgrey-2 text-[length:var(--body-large-large-regular-font-size)] text-center tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
            {paymentAddress ? "payment address:" : walletToShow ? "wallet:" : "address:"}
          </span>

          <span className="text-xs md:text-base font-body-large-large-regular font-[number:var(--body-large-large-regular-font-weight)] text-defaultwhite text-[length:var(--body-large-large-regular-font-size)] text-center tracking-[var(--body-large-large-regular-letter-spacing)] leading-[var(--body-large-large-regular-line-height)] whitespace-nowrap [font-style:var(--body-large-large-regular-font-style)]">
            {displayAddress}
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
