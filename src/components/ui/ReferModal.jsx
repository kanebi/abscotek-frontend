import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { Button } from './button';
import WalletConnectButton from '@/components/widgets/WalletConnectButton';
import { usePrivy } from '@privy-io/react-auth';
import { Loader2 } from 'lucide-react';

import referralService from '@/services/referralService';
import copySVG from '@/assets/images/solar_copy-linear.svg'

const REFERRAL_REWARD_AMOUNT = 4; // This should ideally come from backend config

export default function ReferModal({ open, onClose }) {
  const { currentUser, token } = useStore();
  const { authenticated, user: privyUser } = usePrivy();

  const [referralCode, setReferralCode] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copying, setCopying] = useState(false);

  useEffect(() => {
    const fetchReferralCode = async () => {
      if (authenticated) {
        try {
          setLoading(true);
          setError(null);

          // Wait for token to be available (retry logic)
          let authToken = token || localStorage.getItem('token');
          let attempts = 0;
          const maxAttempts = 15; // Increased attempts

          while (!authToken && attempts < maxAttempts) {
            await new Promise(resolve => setTimeout(resolve, 300)); // Slightly faster polling
            authToken = token || localStorage.getItem('token');
            attempts++;
            console.log(`ReferModal - Attempt ${attempts}: Token available:`, !!authToken);
          }

          console.log('ReferModal - Final token check:', {
            storeToken: !!token,
            localStorageToken: !!localStorage.getItem('token'),
            authenticated,
            attempts
          });

          if (!authToken) {
            throw new Error('Authentication token not available. Please refresh the page and try again.');
          }

          console.log('ReferModal - Calling referral service...');
          const data = await referralService.generateReferralLink();
          console.log('ReferModal - Referral code response:', data);
          setReferralCode(data.referralCode);
        } catch (err) {
          console.error('ReferModal - Failed to fetch referral code:', err);
          setError(err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('ReferModal - Not authenticated, skipping referral code fetch');
        setLoading(false);
      }
    };

    // Start fetching immediately when authenticated
    if (authenticated) {
      fetchReferralCode();
    } else {
      setLoading(false);
    }
  }, [token, authenticated]);

  if (!open) return null;

  const fullReferralLink = referralCode ? `https://abscotek.io/refer/${referralCode}` : '';

  const handleCopyLink = async () => {
    if (!fullReferralLink || copying) return;

    setCopying(true);
    try {
      await navigator.clipboard.writeText(fullReferralLink);
      // Could add a success notification here
    } catch (error) {
      console.error('Failed to copy link:', error);
    } finally {
      setTimeout(() => setCopying(false), 1000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[653px] p-8 bg-neutral-900 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-2.5 overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-white text-2xl">×</button>
        {authenticated ? (
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
                  <div className="flex justify-center items-center gap-3 flex-1">
                    <img src="/images/ph_link-bold.svg" className="w-5 h-5" alt="link" />
                    <div className="justify-start text-rose-500 text-base font-medium font-['Mona_Sans'] leading-normal flex-1">
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading referral link...</span>
                        </div>
                      ) : error ? (
                        <div className="flex flex-col gap-2">
                          <span className="text-red-400">Error: {error.message || 'Failed to load'}</span>
                          <button
                            onClick={async () => {
                              setError(null);
                              setLoading(true);

                              // Wait for token to be available
                              let authToken = token || localStorage.getItem('token');
                              let attempts = 0;
                              const maxAttempts = 5;

                              while (!authToken && attempts < maxAttempts) {
                                await new Promise(resolve => setTimeout(resolve, 300));
                                authToken = token || localStorage.getItem('token');
                                attempts++;
                              }

                              if (authToken) {
                                try {
                                  const data = await referralService.generateReferralLink();
                                  setReferralCode(data.referralCode);
                                } catch (err) {
                                  setError(err);
                                }
                              } else {
                                setError(new Error('Authentication token not available. Please try again.'));
                              }
                              setLoading(false);
                            }}
                            className="text-xs bg-blue-600 hover:bg-blue-700 px-2 py-1 rounded text-white self-start"
                          >
                            Retry
                          </button>
                        </div>
                      ) : fullReferralLink}
                    </div>
                  </div>
                  {fullReferralLink && !loading && !error && (
                    <button
                      className="w-9 h-9 relative bg-zinc-900 rounded-lg flex items-center justify-center hover:bg-zinc-700 transition-colors"
                      onClick={handleCopyLink}
                      disabled={copying}
                    >
                      {copying ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <img src={copySVG} alt="copy" width={20} height={20} />
                      )}
                    </button>
                  )}
                </div>
              </div>
              <Button className="self-stretch w-full px-7 py-3 bg-blue-600 hover:bg-blue-700 rounded-xl inline-flex justify-center items-center gap-2.5 text-white text-sm font-medium font-['Mona_Sans'] leading-tight mt-2 transition-colors" onClick={handleCopyLink} disabled={!fullReferralLink || loading || copying}>
                {copying ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Copying...
                  </>
                ) : (
                  'Copy Link'
                )}
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