import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Button } from './button';
import WalletConnectButton from '@/components/widgets/WalletConnectButton';

import referralService from '@/services/referralService';

const REFERRAL_REWARD_AMOUNT = 10.36; // This should ideally come from backend config

export default function ReferModal({ open, onClose }) {
  const { currentUser, token } = useStore();

  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (token) {
        try {
          setLoading(true);
          const data = await referralService.generateReferralLink();
          setReferralCode(data.referralCode);
        } catch (err) {
          setError(err);
          console.error('Failed to fetch referral code:', err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchReferralCode();
  }, [token]);

  if (!open) return null;

  const fullReferralLink = referralCode ? `https://abscotek.io/refer/${referralCode}` : 'Loading...';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[653px] p-8 bg-neutral-900 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">×</button>
        {currentUser ? (
          <div className="self-stretch flex flex-col justify-start items-start gap-6">
            <div className="inline-flex justify-start items-center gap-6">
              <div className="w-28 h-24 flex items-center justify-center relative overflow-visible">
                <img className="w-36 h-24 object-contain" src="/images/37d9c2dc9cdf22d7f774367c73f44cede984e6c0.png" alt="cash" />
              </div>
              <div className="w-52 inline-flex flex-col justify-start items-start gap-[3px]">
                <div className="self-stretch flex flex-col justify-start items-start gap-2">
                  <div className="self-stretch justify-start text-white text-sm font-semibold font-['Mona_Sans'] leading-tight">REFER A FRIEND AND GET</div>
                  <div className="self-stretch justify-start text-fuchsia-700 text-3xl font-bold font-['Mona_Sans'] leading-loose">{REFERRAL_REWARD_AMOUNT} USDT</div>
                </div>
                <div className="self-stretch justify-start text-white text-base font-medium font-['Mona_Sans'] leading-normal">Invite friends, earn money.</div>
              </div>
            </div>
            <div className="self-stretch flex flex-col justify-start items-start gap-4">
              <div className="self-stretch flex flex-col justify-start items-start gap-2">
                <div className="justify-start text-white text-sm font-medium font-['Mona_Sans'] tracking-tight">Referral link</div>
                <div className="self-stretch px-3 py-2 bg-zinc-800 rounded-lg inline-flex justify-between items-center">
                  <div className="flex justify-center items-center gap-3">
                    <img src="/images/ph_link-bold.svg" className="w-5 h-5" alt="link" />
                    <div className="justify-start text-rose-500 text-base font-medium font-['Mona_Sans'] leading-normal">{loading ? 'Loading...' : error ? 'Error' : fullReferralLink}</div>
                  </div>
                  <button className="w-9 h-9 relative bg-zinc-900 rounded-lg flex items-center justify-center" onClick={() => {navigator.clipboard.writeText(fullReferralLink)}}>
                    <img src="/images/solar_copy-linear.svg" className="w-6 h-6" alt="copy" />
                  </button>
                </div>
              </div>
              <Button className="self-stretch w-full px-7 py-3 bg-rose-500 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-sm font-medium font-['Mona_Sans'] leading-tight mt-2" onClick={() => {navigator.clipboard.writeText(fullReferralLink)}}>
                Copy Link
              </Button>
            </div>
          </div>
        ) : (
          <div className="w-full flex flex-col items-center justify-center gap-8 py-8">
            <img src="/images/37d9c2dc9cdf22d7f774367c73f44cede984e6c0.png" className="w-32 h-28 object-contain" alt="cash" />
            <div className="text-center">
              <div className="text-white text-xl font-bold font-['Mona_Sans'] mb-2">Refer friends and earn USDT!</div>
              <div className="text-neutral-300 text-base font-['Mona_Sans']">Connect your wallet to get your unique referral link and start earning rewards.</div>
            </div>
            <WalletConnectButton />
          </div>
        )}
      </div>
    </div>
  );
} 