import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from './dropdown-menu';
import copy from '../../assets/images/solar_copy-linear.svg';
import useStore from '@/store/useStore';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

const DiamondIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0 drop-shadow-[0_0_6px_rgba(190,242,255,0.6)]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="popoverDiamondGrad" x1="0" y1="0" x2="24" y2="24" gradientUnits="userSpaceOnUse">
        <stop offset="0" stopColor="#E5FFFB" />
        <stop offset="0.4" stopColor="#9AE6FF" />
        <stop offset="1" stopColor="#F9A8FF" />
      </linearGradient>
    </defs>
    <path d="M12 3L4 9.5L12 21L20 9.5L12 3Z" stroke="url(#popoverDiamondGrad)" strokeWidth="1.6" fill="url(#popoverDiamondGrad)" fillOpacity="0.9" />
  </svg>
);

export default function UserPopover({ children, onReferralBonusClick }) {
  const { currentUser, walletAddress } = useStore();
  const { disconnect } = useWeb3Auth();
  
  // Header popup: show display name/email only (wallet only on profile page)
  const displayName = currentUser?.name || currentUser?.email || 'User';
  const paymentAddress = walletAddress || currentUser?.walletAddress;

  const safeUser = {
    displayText: displayName,
    avatar: '/images/0e48610f4fecc933e17441d93f63ddcc9c4d1943 (1).png',
    profileUrl: '/profile',
  };

  const handleCopy = async () => {
    if (paymentAddress) {
      try {
        await navigator.clipboard.writeText(paymentAddress);
      } catch (err) {
        // Copy failed
      }
    }
  };

  const handleReferralBonusClick = () => {
    onReferralBonusClick?.();
  };
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={8} className="border-none bg-transparent shadow-none p-0">
        <div className="w-72 p-4 bg-neutral-800 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex justify-start items-center gap-2.5 overflow-hidden">
          <div className="flex-1 inline-flex flex-col justify-start items-start gap-6">
            <div className="self-stretch inline-flex justify-between items-center">
              <div className="flex-1 flex justify-start items-start gap-2">
                <div className="w-12 h-12 relative bg-gray-600 rounded-xl overflow-hidden">
                  <div className="w-14 h-14 left-[-2.17px] top-0 absolute">
                    <img className="w-14 h-14 left-0 top-0 absolute rounded-full" src={safeUser.avatar} alt="User avatar" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 inline-flex flex-col justify-center items-start gap-1">
                  <div className="self-stretch inline-flex justify-between items-center gap-2">
                    <div className="min-w-0 flex-1 truncate text-white text-xl font-semibold font-['Mona_Sans'] leading-normal" title={safeUser.displayText}>{safeUser.displayText}</div>
                    <button 
                      onClick={handleCopy}
                      disabled={!paymentAddress}
                      className="w-6 h-6 flex-shrink-0 relative overflow-hidden flex items-center justify-center hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                      title={paymentAddress ? 'Copy payment address' : 'No payment address'}
                    >
                      <img src={copy} alt="Copy payment address" className="w-5 h-5" />
                    </button>
                  </div>
                  <a href={safeUser.profileUrl} className="text-center justify-start text-white text-xs font-normal font-['Mona_Sans'] leading-none hover:underline">Open Profile</a>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-center items-start gap-5">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <style>{`
                  .referral-bonus-row { position: relative; overflow: hidden; }
                  .referral-bonus-row::before { content: ''; position: absolute; inset: 0; background: linear-gradient(105deg, transparent 0%, rgba(255,255,255,0.12) 45%, transparent 55%); animation: referralShimmer 2.5s ease-in-out infinite; pointer-events: none; }
                  @keyframes referralShimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
                `}</style>
                <button
                  type="button"
                  onClick={handleReferralBonusClick}
                  className="referral-bonus-row inline-flex justify-start items-center gap-2 w-full py-1.5 px-2 -mx-2 rounded-lg border border-transparent hover:border-pink-400/40 hover:bg-neutral-700/50 transition-colors cursor-pointer text-left"
                >
                  <DiamondIcon />
                  <span className="justify-start text-gray-200 text-base font-medium font-['Mona_Sans'] leading-normal">Referral Bonus</span>
                </button>
                <div className="self-stretch h-0 outline outline-1 outline-offset-[-0.50px] outline-neutral-700"></div>
                <button 
                  onClick={disconnect}
                  className="inline-flex justify-start items-center gap-2 w-full group"
                >
                  <img src="/images/majesticons_logout.svg" alt="Logout" className="w-6 h-6" />
                  <span className="justify-start text-rose-500 text-base font-medium font-['Mona_Sans'] leading-normal group-hover:underline">Disconnect</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 