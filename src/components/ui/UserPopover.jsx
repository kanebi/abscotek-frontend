import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from './dropdown-menu';
import copy from '../../assets/images/solar_copy-linear.svg';
import useStore from '@/store/useStore';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

export default function UserPopover({ children }) {
  const { currentUser, walletAddress } = useStore();
  const { disconnect } = useWeb3Auth();
  
  // Header popup: show display name/email only (wallet only on profile page)
  const displayName = currentUser?.name || currentUser?.email || 'User';
  
  const safeUser = {
    displayText: displayName,
    avatar: '/images/0e48610f4fecc933e17441d93f63ddcc9c4d1943 (1).png',
    profileUrl: '/profile',
  };

  const handleCopy = async () => {
    const toCopy = currentUser?.email || currentUser?.name || displayName;
    if (toCopy) {
      try {
        await navigator.clipboard.writeText(toCopy);
        // You could add a toast notification here
        console.log('Address copied to clipboard');
      } catch (err) {
        console.error('Failed to copy address:', err);
      }
    }
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
                <div className="flex-1 inline-flex flex-col justify-center items-start gap-1">
                  <div className="self-stretch inline-flex justify-between items-start">
                    <div className="justify-start text-white text-xl font-semibold font-['Mona_Sans'] leading-normal break-all pr-1">{safeUser.displayText}</div>
                    <button 
                      onClick={handleCopy}
                      className="w-6 h-6 flex-shrink-0 relative overflow-hidden flex items-center justify-center hover:bg-gray-700 rounded"
                    >
                      <img src={copy} alt="Copy" className="w-5 h-5" />
                    </button>
                  </div>
                  <a href={safeUser.profileUrl} className="text-center justify-start text-white text-xs font-normal font-['Mona_Sans'] leading-none hover:underline">Open Profile</a>
                </div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-center items-start gap-5">
              <div className="self-stretch flex flex-col justify-start items-start gap-4">
                <div className="inline-flex justify-start items-center gap-2">
                  <div className="w-7 h-6 relative">
                    <img className="w-7 h-6 left-0 top-0 absolute" src="/images/888948fb760dd8e2ec180b95d37c0716fc2dd539.png" alt="Gem" />
                  </div>
                  <div className="justify-start text-gray-200 text-base font-medium font-['Mona_Sans'] leading-normal">Referral Bous</div>
                </div>
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