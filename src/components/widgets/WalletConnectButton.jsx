import React from 'react';
import { useAccount } from 'wagmi';

export default function WalletConnectButton({ 
  className = "", 
  children = "Connect Wallet",
  variant = "default", // "default", "primary", "green", "compact"
  disabled = false,
  ...props 
}) {
  return (
    <appkit-button
      className={className}
      disabled={disabled}
      {...props}
    >
      {children}
    </appkit-button>
  );
} 