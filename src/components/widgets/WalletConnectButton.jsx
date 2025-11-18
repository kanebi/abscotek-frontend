import React from 'react';
import { usePrivy } from '@privy-io/react-auth';
import useStore from '@/store/useStore';

export default function WalletConnectButton({
  className = "",
  children = "Login/Signup",
  variant = "default", // "default", "primary", "green", "compact"
  disabled = false,
  onConnect,
  ...props
}) {
  const { login, authenticated, user } = usePrivy();
  const { isAuthenticated, currentUser, walletAddress } = useStore();

  const handleClick = () => {
    // If onConnect is provided, use it (this will handle the full auth flow)
    // Otherwise, just call Privy login
    if (onConnect) {
      onConnect();
    } else if (!authenticated) {
      login();
    }
  };

  // Use the same pattern as Header - check Privy's authenticated state
  const displayName = currentUser?.name || currentUser?.email || user?.email?.address || 'User';
  const displayWalletAddress = walletAddress || user?.wallet?.address;

  const getDisplayText = () => {
    if (authenticated) {
      if (displayWalletAddress && typeof displayWalletAddress === 'string') {
        return `Connected: ${displayWalletAddress.slice(0, 6)}...${displayWalletAddress.slice(-4)}`;
      } else if (displayName && typeof displayName === 'string') {
        return `Connected: ${displayName}`;
      } else {
        return 'Connected';
      }
    }
    return children;
  };

  return (
    <button
      className={`px-6 py-3 bg-primaryp-300 text-white rounded-lg hover:bg-primaryp-400 transition-colors ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {getDisplayText()}
    </button>
  );
}