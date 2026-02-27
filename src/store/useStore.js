import { create } from 'zustand';
import authService from '../services/authService';
import userService from '../services/userService';
import cartService from '../services/cartService';
import wishlistService from '../services/wishlistService';
import useNotificationStore from './notificationStore';

// Session validation function
const validateSession = async () => {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    // Try to fetch current user to validate token
    const user = await userService.getUser();
    return { token, user };
  } catch (error) {
    // Clear invalid session data
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('walletAddress');
    return null;
  }
};

const useStore = create((set, get) => {
  // Initialize with data from localStorage if available
  const storedToken = localStorage.getItem('token');
  const storedUserInfo = localStorage.getItem('userInfo');
  const storedWalletAddress = localStorage.getItem('walletAddress');
  
  let initialUser = null;
  // Prefer localStorage userCurrency so header/default match what user last had (e.g. NGN); only then user prefs, then USD
  const storedCurrency = localStorage.getItem('userCurrency');
  let initialCurrency = storedCurrency
    ? (storedCurrency === 'USDT' ? 'USDC' : storedCurrency)
    : 'USD';
  if (storedUserInfo) {
    try {
      initialUser = JSON.parse(storedUserInfo);
      if (!storedCurrency && initialUser?.preferences?.currency) {
        initialCurrency = initialUser.preferences.currency === 'USDT' ? 'USDC' : initialUser.preferences.currency;
      }
    } catch (error) {
      localStorage.removeItem('userInfo');
    }
  }
  
  const initialState = {
    token: storedToken,
    walletAddress: storedWalletAddress,
    currentUser: initialUser,
    isAuthenticated: !!storedToken && !!initialUser,
    isLoading: false,
    userCurrency: initialCurrency,
    isSessionValidating: false,
    cart: (() => {
      const cart = localStorage.getItem('guestCart');
      if (cart) {
        try {
          return JSON.parse(cart);
        } catch (error) {
          localStorage.removeItem('guestCart');
        }
      }
      return { items: [], total: 0, subtotal: 0 };
    })()
  };

  return {
  // User state (initialize from localStorage)
  isAuthenticated: initialState.isAuthenticated,
  token: initialState.token,
  currentUser: initialState.currentUser,
  isLoading: initialState.isLoading,
  userCurrency: initialState.userCurrency,
  isConnectWalletModalOpen: false,
  isSessionValidating: initialState.isSessionValidating,

  // Cart state (initialize with guest cart)
  cart: initialState.cart,

  // Session management
  validateSession: async () => {
    set({ isSessionValidating: true });
    try {
      const sessionData = await validateSession();
      if (sessionData) {
        const { token, user } = sessionData;
        // Prefer localStorage (so header matches NGN when user has it), then user prefs, then current store
        const fromStorage = localStorage.getItem('userCurrency');
        const currency = (fromStorage && fromStorage !== 'USDT' ? fromStorage : null) || user?.preferences?.currency || get().userCurrency || initialCurrency;
        const normalizedCurrency = currency === 'USDT' ? 'USDC' : currency;
        set({
          token,
          currentUser: user,
          isAuthenticated: true,
          userCurrency: normalizedCurrency,
          walletAddress: user?.walletAddress || localStorage.getItem('walletAddress') || null
        });
        return true;
      } else {
        // Clear any stale data; keep current currency (e.g. NGN from geo) so UI doesn't flip to USDC
        set({
          token: null,
          currentUser: null,
          isAuthenticated: false,
          walletAddress: null,
          userCurrency: get().userCurrency || 'USD'
        });
        return false;
      }
    } catch (error) {
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        walletAddress: null,
        userCurrency: get().userCurrency || 'USD'
      });
      return false;
    } finally {
      set({ isSessionValidating: false });
    }
  },

  // User actions
  setIsAuthenticated: (isAuthenticated) => {
    set({ isAuthenticated });
    if (!isAuthenticated) {
      // Clear all user data on logout; keep display currency (e.g. NGN) so UI doesn't flip to USDC
      set({
        currentUser: null,
        token: null,
        walletAddress: null,
        userCurrency: get().userCurrency || 'USD'
      });
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      localStorage.removeItem('walletAddress');
    }
  },
  setToken: (token) => {
    set({ token });
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  },
  setCurrentUser: (user) => {
    let currency = user?.preferences?.currency || get().userCurrency || 'USD';
    if (currency === 'USDT') currency = 'USDC';
    const updates = { currentUser: user, userCurrency: currency };
    // Sync walletAddress from user (set during crypto checkout) when store doesn't have one
    if (user?.walletAddress && !get().walletAddress) {
      updates.walletAddress = user.walletAddress;
      try { localStorage.setItem('walletAddress', user.walletAddress); } catch (e) { void e; }
    }
    set(updates);
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setUserCurrency: (currency) => {
    const c = currency === 'USDT' ? 'USDC' : currency;
    set({ userCurrency: c });
    try { localStorage.setItem('userCurrency', c); } catch (e) { void e; }
    // Sync to backend session (24h) so X-User-Currency is consistent
    import('../services/currencyService').then((m) => m.default.setUserCurrency(c)).catch(() => {});
  },
  initDefaultCurrency: async () => {
    const stored = localStorage.getItem('userCurrency');
    const noStored = !stored;
    // Treat USD/USDC as "no preference" so we use geo for country-based default (e.g. NGN for Nigeria)
    const useGeo = noStored || stored === 'USD' || stored === 'USDC';
    if (!useGeo) return;
    try {
      const currencyService = (await import('../services/currencyService')).default;
      const isAuth = get().isAuthenticated;
      let currency;
      if (isAuth && noStored) {
        // Authenticated, first visit: use backend (user prefs); only fallback to geo if backend returns USD
        currency = await currencyService.getUserCurrency();
        if (!currency || currency === 'USD') {
          const byLocation = await currencyService.getUserCurrencyByLocation();
          currency = byLocation === 'USDC' ? 'USD' : (byLocation || 'USD');
        }
      } else if (!isAuth || stored === 'USD' || stored === 'USDC') {
        // Guest or stored generic default: set currency from country (NGN, GHC, etc.)
        currency = await currencyService.getUserCurrencyByLocation();
        currency = currency === 'USDC' ? 'USD' : (currency || 'USD');
      } else {
        return;
      }
      const chosen = currency === 'USDT' ? 'USDC' : currency;
      set({ userCurrency: chosen });
      try { localStorage.setItem('userCurrency', chosen); } catch (e) { void e; }
      await currencyService.setUserCurrency(chosen);
    } catch (e) {
      set({ userCurrency: 'USD' });
    }
  },
  setConnectWalletModalOpen: (isOpen) => set({ isConnectWalletModalOpen: isOpen }),

  // Wallet and Chain ID (managed externally by a React component using useReownWalletInfo)
  walletAddress: null,
  chainId: null,
  setWalletAddress: (address) => {
    set({ walletAddress: address });
    if (address) {
      localStorage.setItem('walletAddress', address);
    } else {
      localStorage.removeItem('walletAddress');
    }
  },
  setChainId: (id) => {
    set({ chainId: id });
  },

  loadGuestCart: () => {
    const guestCart = cartService.getGuestCart();
    set({ cart: guestCart });
  },

  // Cart state management
  cartLoading: false,
  cartUpdating: false,

  // Wishlist state management
  wishlist: {
    items: [],
  },
  wishlistLoading: false,
  wishlistUpdating: false,

  // Cart actions
  fetchCart: async () => {
    set({ cartLoading: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await cartService.getCart();
        set({ cart: response });
      } else {
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart);
            set({ cart: parsedCart });
          } catch (error) {
            set({ cart: { items: [], total: 0, subtotal: 0 } });
          }
        } else {
          set({ cart: { items: [], total: 0, subtotal: 0 } });
        }
      }
    } catch (error) {
      // Fetch failed
    } finally {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, currency, variantName, specs) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, userCurrency, walletAddress, cart } = get();
      
      // Check if item already exists (for better UX messaging)
      let itemExists = false;
      if (isAuthenticated || walletAddress) {
        // For authenticated users, backend handles this
        itemExists = cart?.items?.some(item => {
          const sameProduct = item.product?._id === productId || item.productId === productId;
          const sameVariant = item.variant?.name === variantName;
          const sameSpecs = JSON.stringify(item.specs || []) === JSON.stringify(specs || []);
          return sameProduct && sameVariant && sameSpecs;
        });
      } else {
        // For guest users, check local cart
        const guestCart = cartService.getGuestCart();
        itemExists = guestCart.items.some(item => {
          const sameProduct = item.product?._id === productId;
          const sameVariant = item.variant?.name === variantName;
          const sameSpecs = JSON.stringify(item.specs || []) === JSON.stringify(specs || []);
          return sameProduct && sameVariant && sameSpecs;
        });
      }
      
      const response = await cartService.addToCart(productId, quantity, userCurrency || currency, variantName, specs, isAuthenticated, walletAddress);
      set({ cart: response });
      
      const message = itemExists ? 'Cart item quantity updated' : 'Item added to cart';
      useNotificationStore.getState().addNotification(message, 'success');
    } catch (error) {
      useNotificationStore.getState().addNotification('Failed to add item to cart', 'error');
    } finally {
      set({ cartUpdating: false });
    }
  },

  updateCartQuantity: async (productId, newQuantity, variantName = null, specs = null) => {
    if (newQuantity < 1) return;
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, walletAddress } = get();
      // Use service function for both authenticated and guest users for consistency
      const response = await cartService.updateItemQuantity(productId, newQuantity, variantName, specs);
      set({ cart: response });
    } catch (error) {
      useNotificationStore.getState().addNotification('Failed to update cart quantity', 'error');
    } finally {
      set({ cartUpdating: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, currentUser, walletAddress, fetchCart } = get();
      if (isAuthenticated || walletAddress) {
        // Ensure we have a valid user ID
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) throw new Error('User ID not found');
        await cartService.removeFromCart(userId, productId);
        // Reload cart from backend to ensure structure is correct
        await fetchCart();
      } else {
        await cartService.removeFromCart(null, productId);
        // Reload structured cart from localStorage
        const guestCart = cartService.getGuestCart();
        set({ cart: guestCart });
      }
      useNotificationStore.getState().addNotification('Item removed from cart', 'success');
    } catch (error) {
      useNotificationStore.getState().addNotification('Failed to remove item from cart', 'error');
      try {
        const { isAuthenticated, fetchCart } = get();
        if (isAuthenticated || get().walletAddress) {
          await fetchCart();
        } else {
          const guestCart = cartService.getGuestCart();
          set({ cart: guestCart });
        }
      } catch (reloadError) {
        // Reload failed
      }
    } finally {
      set({ cartUpdating: false });
    }
  },

  clearCart: async () => {
    try {
      const { isAuthenticated } = get();
      
      // Clear backend cart if authenticated
      if (isAuthenticated) {
        await cartService.clearCart();
      }
      set({
        cart: {
          items: [],
          total: 0,
          subtotal: 0,
        }
      });
      localStorage.removeItem('guestCart');
    } catch (error) {
      // Still clear frontend state even if backend fails
      set({
        cart: {
          items: [],
          total: 0,
          subtotal: 0,
        }
      });
      localStorage.removeItem('guestCart');
    }
  },

  getCartTotal: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => {
      const price = item.product.price + (item.variant?.additionalPrice || 0);
      return total + price * item.quantity;
    }, 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
    if (!cart || !cart.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  setCartLoading: (loading) => set({ cartLoading: loading }),
  setCartUpdating: (updating) => set({ cartUpdating: updating }),


  // Wishlist actions
  fetchWishlist: async () => {
    set({ wishlistLoading: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await wishlistService.getWishlist();
        set({ wishlist: response });
      }
    } catch (error) {
      // Fetch failed
    } finally {
      set({ wishlistLoading: false });
    }
  },

  addToWishlist: async (productId) => {
    set({ wishlistUpdating: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await wishlistService.addToWishlist(productId);
        set({ wishlist: response });
      }
    } catch (error) {
      // Add failed
    } finally {
      set({ wishlistUpdating: false });
    }
  },

  removeFromWishlist: async (productId) => {
    set({ wishlistUpdating: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await wishlistService.removeFromWishlist(productId);
        set({ wishlist: response });
      }
    } catch (error) {
      // Remove failed
    } finally {
      set({ wishlistUpdating: false });
    }
  },
  };
});

export default useStore;
