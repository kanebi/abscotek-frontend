import { useEffect, useCallback, useRef } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import authService from '../services/authService';
import userService from '../services/userService';
import useStore from '../store/useStore';
import cartService from '../services/cartService';

export const useWeb3Auth = () => {
  const { user, authenticated, getAccessToken, logout } = usePrivy();
  const sessionValidated = useRef(false);

  console.log('useWeb3Auth - Privy user:', user);
  console.log('useWeb3Auth - Privy authenticated:', authenticated);

  const {
    setWalletAddress,
    setIsAuthenticated,
    setToken,
    setCurrentUser,
    validateSession,
    fetchCart,
    fetchWishlist,
    isSessionValidating
  } = useStore();

  

  const authenticateAndLogin = useCallback(async () => {
    if (authenticated && user) {
      try {
        // Check if we already have a valid token to avoid calling Privy repeatedly
        const existingToken = localStorage.getItem('token');
        if (existingToken) {
          console.log('useWeb3Auth - Valid token already exists, skipping Privy API call');
          // Just update the store with existing data
          const existingUser = localStorage.getItem('userInfo');
          if (existingUser) {
            try {
              const userData = JSON.parse(existingUser);
            setCurrentUser(userData);
              setIsAuthenticated(true);
              setToken(existingToken);
              setWalletAddress(userData.walletAddress || user?.wallet?.address);
              return;
            } catch (e) {
              console.log('useWeb3Auth - Invalid stored user data, proceeding with fresh auth');
            }
          }
        }

        console.log('useWeb3Auth - Starting Privy authentication flow');

        const accessToken = await getAccessToken();
        if (!accessToken) {
          throw new Error('Failed to get access token from Privy');
        }

        console.log('useWeb3Auth - Got access token, calling auth service...');
        const authResponse = await authService.authenticateWithPrivy(accessToken);
        const { token, user: userData } = authResponse;

        // Update all auth-related store values
        setToken(token);
        setIsAuthenticated(true);
        setCurrentUser(userData);

        // Set wallet address from Privy user or userData
        const walletAddr = user.wallet?.address || userData?.walletAddress || null;
        setWalletAddress(walletAddr);

        console.log('useWeb3Auth - Authentication successful:', {
          user: userData.name,
          email: userData.email,
          wallet: walletAddr
        });

        // Load user-specific data after successful auth
        await Promise.all([
          fetchCart(),
          fetchWishlist()
        ]);

        // Merge guest cart after successful login
        await cartService.mergeGuestCart();

      } catch (error) {
        console.error('Privy authentication failed:', error);
        // Don't clear auth state on failure - user might still be authenticated in Privy
        // Just log the error and let the user try again
        console.log('useWeb3Auth - Authentication failed, but keeping Privy state intact');
      }
    }
  }, [authenticated, user, getAccessToken, setToken, setIsAuthenticated, setCurrentUser, setWalletAddress, fetchCart, fetchWishlist]);

  // Validate session on app start (only once)
  useEffect(() => {
    const initializeSession = async () => {
      if (sessionValidated.current) return;

      console.log('useWeb3Auth - Validating existing session...');
      const isValid = await validateSession();

      if (isValid) {
        console.log('useWeb3Auth - Session validated, user data already loaded by validateSession');
        // Note: validateSession already loads user data, so we don't need to fetch again
      } else {
        console.log('useWeb3Auth - No valid session found');
      }

      sessionValidated.current = true;
    };

    // Only validate if not currently validating and not authenticated by Privy
    if (!isSessionValidating && !authenticated) {
      initializeSession();
    }
  }, [isSessionValidating, authenticated]); // Depend on session validation state

  // Handle Privy authentication state changes
  useEffect(() => {
    if (authenticated && user) {
      console.log('useWeb3Auth - Privy authenticated, starting auth flow...');
      authenticateAndLogin();
    } else if (!authenticated && sessionValidated.current) {
      // Handle logout/disconnection - only clear if we were previously authenticated
      const currentToken = localStorage.getItem('token');
      if (currentToken) {
        console.log('useWeb3Auth - Privy disconnected, clearing auth state...');
          setToken(null);
          setIsAuthenticated(false);
          setWalletAddress(null);
          setCurrentUser(null);
          localStorage.removeItem('token');
          localStorage.removeItem('userInfo');
        localStorage.removeItem('walletAddress');
      }
    }
  }, [authenticated, user, authenticateAndLogin]);

  const handleLogout = useCallback(async () => {
    try {
      // Call Privy logout
      await logout();

      // Clear all auth state
      setToken(null);
      setIsAuthenticated(false);
      setWalletAddress(null);
      setCurrentUser(null);

       // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
       localStorage.removeItem('walletAddress');

      console.log('useWeb3Auth - Logout completed successfully');
    } catch (error) {
      console.error('useWeb3Auth - Logout error:', error);
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
