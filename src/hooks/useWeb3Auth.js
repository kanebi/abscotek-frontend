import { useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import authService from '../services/authService';
import useStore from '../store/useStore';
import cartService from '../services/cartService';

export const useWeb3Auth = () => {
  const { user, authenticated, ready, getAccessToken, logout } = usePrivy();
  const sessionValidated = useRef(false);
  const authInProgress = useRef(false);
  const backendAuthSuccessRef = useRef(false);

  const {
    setWalletAddress,
    setIsAuthenticated,
    setToken,
    setCurrentUser,
    fetchCart,
    fetchWishlist
  } = useStore();

  const authenticateAndLogin = useCallback(async () => {
    if (!authenticated || !user) return;
    if (authInProgress.current) return;
    if (backendAuthSuccessRef.current) return;

    const existingToken = localStorage.getItem('token');
    const existingUser = localStorage.getItem('userInfo');
    if (existingToken && existingUser) {
      try {
        const userData = JSON.parse(existingUser);
        const currentState = useStore.getState();
        if (!currentState.isAuthenticated || !currentState.token) {
          setCurrentUser(userData);
          setIsAuthenticated(true);
          setToken(existingToken);
          setWalletAddress(userData.walletAddress || user?.wallet?.address);
        }
        backendAuthSuccessRef.current = true;
        return;
      } catch (e) {
        // Invalid stored data, proceed with fresh auth
      }
    }

    authInProgress.current = true;
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        authInProgress.current = false;
        return;
      }
      const authResponse = await authService.authenticateWithPrivy(accessToken);
      const { token, user: userData } = authResponse;

      setToken(token);
      setIsAuthenticated(true);
      setCurrentUser(userData);
      const walletAddr = user.wallet?.address || userData?.walletAddress || null;
      setWalletAddress(walletAddr);
      backendAuthSuccessRef.current = true;

      await Promise.all([fetchCart(), fetchWishlist()]).catch(() => {});
      await cartService.mergeGuestCart().catch(() => {});
    } catch (error) {
      // Keep Privy state intact; user can retry
    } finally {
      authInProgress.current = false;
    }
  }, [authenticated, user, getAccessToken, setToken, setIsAuthenticated, setCurrentUser, setWalletAddress, fetchCart, fetchWishlist]);

  useEffect(() => {
    const initializeSession = async () => {
      if (sessionValidated.current || !ready) return;
      sessionValidated.current = true;

      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');
      if (!storedToken || !storedUserInfo) return;
      if (authenticated && user) return;

      const { isAuthenticated, fetchCart, fetchWishlist } = useStore.getState();
      if (isAuthenticated) {
        await Promise.all([fetchCart(), fetchWishlist()]).catch(() => {});
      }
    };
    initializeSession();
  }, [ready, authenticated, user]);

  useEffect(() => {
    if (authenticated && user) authenticateAndLogin();
  }, [authenticated, user, authenticateAndLogin]);

  const handleLogout = useCallback(async () => {
    backendAuthSuccessRef.current = false;
    try {
      await logout();
      setToken(null);
      setIsAuthenticated(false);
      setWalletAddress(null);
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('walletAddress');
    } catch (error) {
      setToken(null);
      setIsAuthenticated(false);
      setWalletAddress(null);
      setCurrentUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('walletAddress');
    }
  }, [logout, setToken, setIsAuthenticated, setWalletAddress, setCurrentUser]);

  return {
    address: user?.wallet?.address,
    isConnected: authenticated,
    balance: null, // Privy handles balance internally
    authenticateAndLogin,
    disconnect: handleLogout
  };
};
