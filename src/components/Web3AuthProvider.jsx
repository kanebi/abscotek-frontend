import React, { useEffect } from 'react';
import { PrivyProvider } from '@privy-io/react-auth';
import { PrivyConfig } from '@/config/privy';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

function Web3AuthInitializer({ children }) {
  // This ensures useWeb3Auth runs and validates session on app start
  useWeb3Auth();

  return <>{children}</>;
}

export default function Web3AuthProvider({ children }) {
  return (
    <PrivyProvider
      appId={PrivyConfig.appId}
      config={PrivyConfig.config}
    >
      <Web3AuthInitializer>
        {children}
      </Web3AuthInitializer>
    </PrivyProvider>
  );
}