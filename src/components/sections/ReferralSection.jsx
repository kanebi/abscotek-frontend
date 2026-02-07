import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import WithdrawBonusDialog from "@/components/modals/WithdrawBonusDialog";
import SuccessModal from "@/components/modals/SuccessModal";
import React, { useState, useEffect } from "react";
import referralService from "@/services/referralService";
import userService from "@/services/userService";
import useStore from "@/store/useStore";

const ReferralSection = () => {
  const { walletAddress, currentUser } = useStore();
  const [showWithdrawDialog, setShowWithdrawDialog] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [stats, setStats] = useState({ totalReferrals: 0, referralBonus: 0 });
  const [walletBalance, setWalletBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  const walletToUse = walletAddress || currentUser?.walletAddress;

  useEffect(() => {
    fetchReferralStats();
  }, []);

  useEffect(() => {
    if (walletToUse) {
      fetchWalletBalance();
    } else {
      setWalletBalance(null);
    }
  }, [walletToUse]);

  const fetchWalletBalance = async () => {
    try {
      const data = await userService.getWalletBalance();
      setWalletBalance(parseFloat(data.balance || 0));
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setWalletBalance(null);
    }
  };

  const fetchReferralStats = async () => {
    try {
      setLoading(true);
      const data = await referralService.getReferralStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching referral stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawClick = () => {
    if (stats.referralBonus <= 0) {
      return;
    }
    setShowWithdrawDialog(true);
  };

  const handleWithdrawSuccess = () => {
    setShowWithdrawDialog(false);
    setShowSuccessModal(true);
    // Refresh stats after withdrawal
    fetchReferralStats();
  };

  const referralStats = [
    {
      icon: (
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-8 h-8"
        >
          <path
            d="M16 16C19.6819 16 22.6667 13.0152 22.6667 9.33333C22.6667 5.65143 19.6819 2.66667 16 2.66667C12.3181 2.66667 9.33334 5.65143 9.33334 9.33333C9.33334 13.0152 12.3181 16 16 16Z"
            fill="#FF5059"
          />
          <path
            d="M24 18.6667H8.00001C5.05334 18.6667 2.66667 21.0533 2.66667 24V26.6667C2.66667 28.1333 3.86667 29.3333 5.33334 29.3333H26.6667C28.1333 29.3333 29.3333 28.1333 29.3333 26.6667V24C29.3333 21.0533 26.9467 18.6667 24 18.6667Z"
            fill="#FF5059"
          />
        </svg>
      ),
      value: loading ? "..." : stats.totalReferrals.toString(),
      label: "Total User Referred",
      bgColor: "bg-[#ff50591a]",
    },
    {
      icon: (
        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.625 8.99982H17.375V15.9998H27.625C27.9897 15.9998 28.3394 15.855 28.5973 15.5971C28.8551 15.3392 29 14.9895 29 14.6248V10.3748C29 10.0101 28.8551 9.66041 28.5973 9.40255C28.3394 9.14469 27.9897 8.99982 27.625 8.99982H23.8862C24.3925 7.95708 24.5105 6.76798 24.2188 5.64611C23.9272 4.52424 23.2451 3.54311 22.295 2.87896C21.345 2.21482 20.1893 1.91117 19.0355 2.02255C17.8817 2.13394 16.8054 2.65307 16 3.4867C15.1932 2.65764 14.1178 2.14253 12.9661 2.03342C11.8144 1.9243 10.6615 2.22831 9.71332 2.8911C8.76516 3.55389 8.0836 4.53226 7.79045 5.65135C7.4973 6.77044 7.61167 7.9573 8.11312 8.99982H4.375C4.01033 8.99982 3.66059 9.14469 3.40273 9.40255C3.14487 9.66041 3 10.0101 3 10.3748V14.6248C3 14.9895 3.14487 15.3392 3.40273 15.5971C3.53041 15.7248 3.68199 15.8261 3.84881 15.8952C4.01563 15.9643 4.19443 15.9998 4.375 15.9998H14.625V8.99982ZM17.375 6.87482C17.375 6.45454 17.4996 6.04369 17.7331 5.69423C17.9666 5.34478 18.2985 5.07241 18.6868 4.91158C19.0751 4.75074 19.5024 4.70866 19.9146 4.79065C20.3268 4.87265 20.7054 5.07503 21.0026 5.37222C21.2998 5.66941 21.5022 6.04805 21.5842 6.46025C21.6662 6.87246 21.6241 7.29973 21.4632 7.68802C21.3024 8.07632 21.03 8.4082 20.6806 8.6417C20.3311 8.87519 19.9203 8.99982 19.5 8.99982H17.375V6.87482ZM10.375 6.87482C10.375 6.31124 10.5989 5.77073 10.9974 5.37222C11.3959 4.9737 11.9364 4.74982 12.5 4.74982C13.0636 4.74982 13.6041 4.9737 14.0026 5.37222C14.4011 5.77073 14.625 6.31124 14.625 6.87482V8.99982H12.5C11.9364 8.99982 11.3959 8.77594 10.9974 8.37742C10.5989 7.97891 10.375 7.43841 10.375 6.87482ZM17.375 29.9998H25.625C25.9897 29.9998 26.3394 29.855 26.5973 29.5971C26.8551 29.3392 27 28.9895 27 28.6248V17.9998H17.375V29.9998ZM5 28.6248C5 28.9895 5.14487 29.3392 5.40273 29.5971C5.66059 29.855 6.01033 29.9998 6.375 29.9998H14.625V17.9998H5V28.6248Z" fill="#FF5059"/>
        </svg>
      ),
      value: loading ? "..." : `${stats.referralBonus.toFixed(2)} USDC`,
      label: "Referral Bonus",
      bgColor: "bg-[#ff50591a]",
    },
    // Only show Wallet Balance when user has an address (from crypto checkout)
    ...(walletToUse
      ? [
          {
            icon: (
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4L4 10v12l12 6 12-6V10L16 4z" stroke="#FF5059" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                <path d="M4 10l12 6 12-6M16 16v12" stroke="#FF5059" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            ),
            value: walletBalance === null ? "..." : `${(walletBalance || 0).toFixed(2)} USDC`,
            label: "Wallet Balance",
            bgColor: "bg-[#ff50591a]",
          },
        ]
      : []),
  ];

  return (
    <>
      {/* Desktop Version */}
      <div className="hidden md:flex flex-col items-center justify-center gap-6 relative w-full">
        <Card className="flex flex-col items-start gap-2.5 px-[281px] py-[87px] relative self-stretch w-full flex-[0_0_auto] bg-defaulttop-background rounded-2xl overflow-hidden border-0">
          <CardContent className="flex w-[709px] items-center justify-between relative flex-[0_0_auto] p-0">
            {referralStats.map((stat, index) => (
              <div
                key={index}
                className="inline-flex items-center gap-3 relative flex-[0_0_auto]"
              >
                <div className="relative w-[72px] h-[72px] bg-[#ff50591a] rounded-xl overflow-hidden flex items-center justify-center">
                  {stat.icon}
                </div>

                <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                  <div className="relative w-fit mt-[-1.00px] font-heading-header-1-header-1-semibold font-[number:var(--heading-header-1-header-1-semibold-font-weight)] text-white text-[length:var(--heading-header-1-header-1-semibold-font-size)] tracking-[var(--heading-header-1-header-1-semibold-letter-spacing)] leading-[var(--heading-header-1-header-1-semibold-line-height)] whitespace-nowrap [font-style:var(--heading-header-1-header-1-semibold-font-style)]">
                    {stat.value}
                  </div>

                  <div className="relative w-fit font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-[#ffffffa3] text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] whitespace-nowrap [font-style:var(--body-base-base-regular-font-style)]">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          onClick={handleWithdrawClick}
          disabled={stats.referralBonus <= 0 || loading}
          className="flex w-[614px] items-center justify-center gap-2.5 px-7 py-[13px] relative flex-[0_0_auto] bg-primaryp-300 rounded-xl h-auto hover:bg-primaryp-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] whitespace-nowrap [font-style:var(--body-base-base-medium-font-style)]">
            {stats.referralBonus <= 0 ? 'No Balance to Withdraw' : 'Withdraw Bonuses'}
          </span>
        </Button>
      </div>

      {/* Mobile Version */}
      <div className="flex md:hidden flex-col w-full items-center justify-center gap-6 relative">
        <Card className="flex flex-col items-start gap-2.5 px-6 py-12 relative self-stretch w-full flex-[0_0_auto] bg-defaulttop-background rounded-2xl overflow-hidden border-0">
          <CardContent className="flex flex-col items-start justify-center gap-[52px] relative self-stretch w-full flex-[0_0_auto] p-0">
            {referralStats.map((stat, index) => (
              <div
                key={`referral-stat-${index}`}
                className="inline-flex items-center gap-3 relative flex-[0_0_auto]"
              >
                <div className={`relative w-16 h-16 ${stat.bgColor} rounded-[10.67px] overflow-hidden flex items-center justify-center`}>
                  {stat.icon}
                </div>

                <div className="inline-flex flex-col items-start gap-1 relative flex-[0_0_auto]">
                  <div
                    className={`relative w-fit mt-[-1.00px] ${
                      index === 0 
                        ? "font-heading-header-2-header-2-semibold font-[number:var(--heading-header-2-header-2-semibold-font-weight)] text-[length:var(--heading-header-2-header-2-semibold-font-size)] tracking-[var(--heading-header-2-header-2-semibold-letter-spacing)] leading-[var(--heading-header-2-header-2-semibold-line-height)] [font-style:var(--heading-header-2-header-2-semibold-font-style)]" 
                        : "font-heading-header-3-header-3-semibold font-[number:var(--heading-header-3-header-3-semibold-font-weight)] text-[length:var(--heading-header-3-header-3-semibold-font-size)] tracking-[var(--heading-header-3-header-3-semibold-letter-spacing)] leading-[var(--heading-header-3-header-3-semibold-line-height)] [font-style:var(--heading-header-3-header-3-semibold-font-style)]"
                    } text-white whitespace-nowrap`}
                  >
                    {stat.value}
                  </div>
                  <div className="relative w-fit font-body-base-base-regular font-[number:var(--body-base-base-regular-font-weight)] text-[#ffffffa3] text-[length:var(--body-base-base-regular-font-size)] tracking-[var(--body-base-base-regular-letter-spacing)] leading-[var(--body-base-base-regular-line-height)] [font-style:var(--body-base-base-regular-font-style)] whitespace-nowrap">
                    {stat.label}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Button 
          onClick={handleWithdrawClick}
          disabled={stats.referralBonus <= 0 || loading}
          className="flex items-center justify-center gap-2.5 px-7 py-[13px] relative self-stretch w-full flex-[0_0_auto] bg-primaryp-300 rounded-xl h-auto hover:bg-primaryp-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="relative w-fit mt-[-1.00px] font-body-base-base-medium font-[number:var(--body-base-base-medium-font-weight)] text-white text-[length:var(--body-base-base-medium-font-size)] tracking-[var(--body-base-base-medium-letter-spacing)] leading-[var(--body-base-base-medium-line-height)] [font-style:var(--body-base-base-medium-font-style)] whitespace-nowrap">
            {stats.referralBonus <= 0 ? 'No Balance to Withdraw' : 'Withdraw Bonuses'}
          </span>
        </Button>
      </div>

      {/* Withdrawal Dialog */}
      <WithdrawBonusDialog 
        open={showWithdrawDialog}
        onOpenChange={setShowWithdrawDialog}
        onSuccess={handleWithdrawSuccess}
        availableBalance={stats.referralBonus}
      />

      {/* Success Modal */}
      <SuccessModal 
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title="Withdrawal Successful!"
        message="You've successfully withdrawn to your wallet address. Please allow up to 24 hours for processing."
      />
    </>
  );
};

export default ReferralSection;
