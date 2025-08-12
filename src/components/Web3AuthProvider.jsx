import React from 'react';
import { useWeb3Auth } from '@/hooks/useWeb3Auth';

export default function Web3AuthProvider({ children }) {
  useWeb3Auth();
  return <>{children}</>;
} 