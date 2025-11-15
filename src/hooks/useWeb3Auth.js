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
        // Check if we already have a valid token and session is validated
        const existingToken = localStorage.getItem('token');
        const existingUser = localStorage.getItem('userInfo');
        
        if (existingToken && existingUser && sessionValidated.current) {
          console.log('useWeb3Auth - Valid session already exists, skipping re-authentication');
          // Just ensure store is in sync with localStorage
          try {
            const userData = JSON.parse(existingUser);
            const currentState = useStore.getState();
            
            // Only update if store is out of sync
            if (!currentState.isAuthenticated || !currentState.token) {
              console.log('useWeb3Auth - Syncing store with localStorage');
              setCurrentUser(userData);
              setIsAuthenticated(true);
              setToken(existingToken);
              setWalletAddress(userData.walletAddress || user?.wallet?.address);
            }
            return;
          } catch (e) {
            console.log('useWeb3Auth - Invalid stored user data, proceeding with fresh auth');
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
        console.log('useWeb3Auth - Loading user data after auth...');
        await Promise.all([
          fetchCart(),
          fetchWishlist()
        ]).catch(err => {
          console.error('useWeb3Auth - Error loading user data:', err);
        });
        console.log('useWeb3Auth - User data loaded successfully');

        // Merge guest cart after successful login
        await cartService.mergeGuestCart().catch(err => {
          console.error('useWeb3Auth - Error merging guest cart:', err);
        });

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

      // Check if we have stored auth data
      const storedToken = localStorage.getItem('token');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (!storedToken || !storedUserInfo) {
        console.log('useWeb3Auth - No stored auth data, skipping validation');
        sessionValidated.current = true;
        return;
      }

      console.log('useWeb3Auth - Found stored auth data, validating session...');
      const isValid = await validateSession();

      if (isValid) {
        console.log('useWeb3Auth - Session validated successfully');
        // Note: validateSession already loads user data, so we don't need to fetch again
        // But we should still fetch cart and wishlist for authenticated users
        const { isAuthenticated, fetchCart, fetchWishlist } = useStore.getState();
        if (isAuthenticated) {
          console.log('useWeb3Auth - Fetching user data for validated session...');
          await Promise.all([
            fetchCart(),
            fetchWishlist()
          ]).catch(err => {
            console.error('useWeb3Auth - Error fetching user data:', err);
          });
        }
      } else {
        console.log('useWeb3Auth - Session validation failed, auth state cleared');
      }

      sessionValidated.current = true;
    };

    // Always validate session on mount if we have stored data
    if (!isSessionValidating) {
      initializeSession();
    }
  }, [isSessionValidating, validateSession]);

  // Handle Privy authentication state changes
  useEffect(() => {
    if (authenticated && user) {
      console.log('useWeb3Auth - Privy authenticated, starting auth flow...');
      authenticateAndLogin();
    }
    // Note: We don't clear auth state when Privy is not authenticated
    // because the user might have a valid session from localStorage
    // Only the explicit logout function should clear the auth state
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
