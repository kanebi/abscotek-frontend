import React, { useEffect } from 'react';
import useStore from '@/store/useStore';
import { usePrivy } from '@privy-io/react-auth';

export default function ConnectWalletModal() {
  const { isConnectWalletModalOpen, setConnectWalletModalOpen, currentUser, walletAddress, isAuthenticated } = useStore();
  const { login, authenticated: privyAuthenticated, user } = usePrivy();

  // Use store's isAuthenticated as source of truth
  const userIsAuthenticated = isAuthenticated && currentUser;

  // Check if welcome back modal was dismissed recently
  useEffect(() => {
    if (isConnectWalletModalOpen && userIsAuthenticated) {
      const lastWelcomeDismissal = localStorage.getItem('welcomeBackModalDismissed');
      const now = Date.now();
      const twentyFourHours = 24 * 60 * 60 * 1000;
      
      // Reset dismissal flag if 24+ hours have passed
      if (lastWelcomeDismissal && (now - parseInt(lastWelcomeDismissal)) > twentyFourHours) {
        localStorage.removeItem('welcomeBackModalDismissed');
        console.log('Welcome back modal dismissal reset - 24 hours have passed');
      }
      
      // If dismissed within 24 hours, close the modal automatically
      if (lastWelcomeDismissal && (now - parseInt(lastWelcomeDismissal)) < twentyFourHours) {
        setConnectWalletModalOpen(false);
        console.log('Welcome back modal auto-closed - dismissed recently');
      }
    }
  }, [isConnectWalletModalOpen, userIsAuthenticated, setConnectWalletModalOpen]);

  if (!isConnectWalletModalOpen) return null;

  const displayName = currentUser?.name || currentUser?.email || user?.email?.address || 'User';
  const displayAddress = walletAddress || user?.wallet?.address;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[450px] p-8 bg-neutral-900 rounded-2xl shadow-[0px_16px_32px_0px_rgba(0,0,0,0.20)] inline-flex flex-col justify-start items-start gap-6 overflow-hidden relative">
        <button 
          onClick={() => {
            setConnectWalletModalOpen(false);
            // If this is a welcome back modal (user is authenticated), set dismissal timestamp
            if (userIsAuthenticated) {
              localStorage.setItem('welcomeBackModalDismissed', Date.now().toString());
              console.log('Welcome back modal dismissed, will not show again for 24 hours');
            }
          }} 
          className="absolute top-4 right-4 text-white text-2xl"
        >
          ×
        </button>
        <div className="w-full flex flex-col items-center justify-center gap-8 py-8">
          {userIsAuthenticated ? (
            // Authenticated user content
            <>
              <div className="text-center">
                <div className="text-white text-xl font-bold font-['Mona_Sans'] mb-2">Welcome Back!</div>
                <div className="text-neutral-300 text-base font-['Mona_Sans'] mb-4">
                  You are successfully connected as:
                </div>
                <div className="text-primaryp-300 text-lg font-semibold font-['Mona_Sans']">
                  {displayAddress && typeof displayAddress === 'string' ? `${displayAddress.slice(0, 6)}...${displayAddress.slice(-4)}` : displayName}
                </div>
              </div>
              <button
                onClick={() => {
                  setConnectWalletModalOpen(false);
                  // Set dismissal timestamp for welcome back modal
                  localStorage.setItem('welcomeBackModalDismissed', Date.now().toString());
                  console.log('Welcome back modal dismissed via Continue Shopping button');
                }}
                className="px-6 py-3 bg-primaryp-300 text-white rounded-lg hover:bg-primaryp-400 transition-colors"
              >
                Continue Shopping
              </button>
            </>
          ) : (
            // Not authenticated content
            <>
              <div className="text-center">
                <div className="text-white text-xl font-bold font-['Mona_Sans'] mb-2">Connect Your Wallet</div>
                <div className="text-neutral-300 text-base font-['Mona_Sans']">Please connect your wallet to add items to your cart and proceed with your purchase.</div>
              </div>
              <button
                onClick={() => {
                  login();
                  setConnectWalletModalOpen(false);
                }}
                className="px-6 py-3 bg-primaryp-300 text-white rounded-lg hover:bg-primaryp-400 transition-colors"
              >
                Login/Signup
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
