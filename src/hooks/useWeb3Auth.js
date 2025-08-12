import { useEffect } from 'react';
import { useAccount, useSignMessage, useDisconnect } from 'wagmi';
import authService from '../services/authService';
import userService from '../services/userService';
import useStore from '../store/useStore';

export const useWeb3Auth = () => {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { disconnect } = useDisconnect();

  const setWalletAddress = useStore((state) => state.setWalletAddress);
  const setIsAuthenticated = useStore((state) => state.setIsAuthenticated);
  const setToken = useStore((state) => state.setToken);
  const setCurrentUser = useStore((state) => state.setCurrentUser);
  const setChainId = useStore((state) => state.setChainId);

  useEffect(() => {
    const authenticateUser = async () => {
      if (isConnected && address) {
        try {
          // Check for existing token in localStorage
          const storedToken = localStorage.getItem('token');
          const storedWalletAddress = localStorage.getItem('walletAddress');
          
          // If we have a stored token and it matches the current wallet address
          if (storedToken && storedWalletAddress === address) {
            setToken(storedToken);
            setIsAuthenticated(true);
            setWalletAddress(address);
            
            // Try to get user data
            try {
              const user = await userService.getUser();
              setCurrentUser(user);
            } catch (error) {
              console.error('Failed to fetch user data:', error);
              // If user fetch fails, clear stored data and re-authenticate
              localStorage.removeItem('token');
              localStorage.removeItem('walletAddress');
              localStorage.removeItem('userInfo');
              throw new Error('User data fetch failed');
            }
            return;
          }

          // Request signature if no token or wallet address changed
          const { nonce } = await authService.requestSignature(address);
          const message = `Please sign this message to authenticate: ${nonce}`;
          const signature = await signMessageAsync({ message });

          // Verify signature and get token
          const { token, user } = await authService.verifySignature(address, signature);

          // Set user state
          setToken(token);
          setIsAuthenticated(true);
          setWalletAddress(address);
          setCurrentUser(user);

          // Store token and user info in local storage
          localStorage.setItem('token', token);
          localStorage.setItem('walletAddress', address);
          localStorage.setItem('userInfo', JSON.stringify(user));
        } catch (error) {
          console.error('Web3 authentication failed:', error);
          // Only clear state on authentication failure, not on disconnect
          if (error.message !== 'User data fetch failed') {
            setToken(null);
            setIsAuthenticated(false);
            setWalletAddress(null);
            setCurrentUser(null);
            localStorage.removeItem('token');
            localStorage.removeItem('walletAddress');
            localStorage.removeItem('userInfo');
          }
        }
      }
      // Don't clear state when !isConnected - let the user stay logged in
      // Only clear on explicit disconnect
    };

    authenticateUser();
  }, [address, isConnected, signMessageAsync, disconnect, setWalletAddress, setIsAuthenticated, setToken, setCurrentUser, setChainId]);

  // Handle explicit disconnect
  useEffect(() => {
    const handleDisconnect = () => {
      setToken(null);
      setIsAuthenticated(false);
      setWalletAddress(null);
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('userInfo');
    };

    // Listen for disconnect events
    const handleStorageChange = (e) => {
      if (e.key === 'wagmi.disconnected' && e.newValue === 'true') {
        handleDisconnect();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [setToken, setIsAuthenticated, setWalletAddress, setCurrentUser]);

  // You can return any state or functions you want to expose from this hook
  return { address, isConnected };
};