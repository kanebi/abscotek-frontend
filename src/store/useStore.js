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
    console.warn('Session validation failed, clearing stored data:', error.message);
    // Clear invalid session data
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('walletAddress');
    return null;
  }
};

const useStore = create((set, get) => {
  // Initialize with guest cart loaded from localStorage
  const initialState = {
    token: null,
    walletAddress: null,
    currentUser: null,
    isAuthenticated: false,
    isLoading: false,
    userCurrency: 'USDT',
    isSessionValidating: false,
    cart: (() => {
      const cart = localStorage.getItem('guestCart');
      if (cart) {
        try {
          return JSON.parse(cart);
        } catch (error) {
          console.error('Error parsing guest cart from localStorage:', error);
          localStorage.removeItem('guestCart');
        }
      }
      return { items: [], total: 0, subtotal: 0 };
    })()
  };

  return {
  // User state
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
        set({
          token,
          currentUser: user,
          isAuthenticated: true,
          userCurrency: user?.preferences?.currency || 'USDT',
          walletAddress: user?.walletAddress || localStorage.getItem('walletAddress') || null
        });
        console.log('Session validated successfully:', { user: user.name, email: user.email });
        return true;
      } else {
        // Clear any stale data
        set({
          token: null,
          currentUser: null,
          isAuthenticated: false,
          walletAddress: null,
          userCurrency: 'USDT'
        });
        return false;
      }
    } catch (error) {
      console.error('Session validation error:', error);
      // Clear any stale data on error
      set({
        token: null,
        currentUser: null,
        isAuthenticated: false,
        walletAddress: null,
        userCurrency: 'USDT'
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
      // Clear all user data on logout
      set({
        currentUser: null,
        token: null,
        walletAddress: null,
        userCurrency: 'USDT'
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
    set({ currentUser: user, userCurrency: user?.preferences?.currency || 'USDT' });
    if (user) {
      localStorage.setItem('userInfo', JSON.stringify(user));
    } else {
      localStorage.removeItem('userInfo');
    }
  },
  setIsLoading: (isLoading) => set({ isLoading }),
  setUserCurrency: (currency) => set({ userCurrency: currency }),
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
    console.log('useStore - setChainId:', id);
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
      console.log('fetchCart - isAuthenticated:', isAuthenticated);
      if (isAuthenticated) {
        console.log('fetchCart - Fetching authenticated user cart...');
        const response = await cartService.getCart();
        console.log('fetchCart - Cart response:', response);
        set({ cart: response });
        console.log('fetchCart - Cart set in store');
      } else {
        console.log('fetchCart - User not authenticated, loading guest cart...');
        // For non-authenticated users, get guest cart
        const guestCart = localStorage.getItem('guestCart');
        if (guestCart) {
          try {
            const parsedCart = JSON.parse(guestCart);
            console.log('fetchCart - Guest cart loaded:', parsedCart);
            set({ cart: parsedCart });
          } catch (error) {
            console.error('Error parsing guest cart:', error);
            set({ cart: { items: [], total: 0, subtotal: 0 } });
          }
        } else {
          console.log('fetchCart - No guest cart found, setting empty cart');
          set({ cart: { items: [], total: 0, subtotal: 0 } });
        }
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1, color) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, userCurrency, walletAddress } = get();
      let response;
      response = await cartService.addToCart(productId, quantity, userCurrency, color, isAuthenticated, walletAddress);
      set({ cart: response });
      useNotificationStore.getState().addNotification('Item added to cart', 'success');
    } catch (error) {
      console.error('Failed to add to cart:', error);
      useNotificationStore.getState().addNotification('Failed to add item to cart', 'error');
    } finally {
      set({ cartUpdating: false });
    }
  },

  updateCartQuantity: async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, walletAddress } = get();
      if (isAuthenticated || walletAddress) {
        // Note: The service function is updateItemQuantity
        const response = await cartService.updateItemQuantity(productId, newQuantity);
        set({ cart: response });
      } else {
        // Handle guest cart update
        const cart = cartService.getGuestCart();
        const itemIndex = cart.items.findIndex((item) => item.product._id === productId);
        if (itemIndex > -1) {
          const newItems = [...cart.items];
          newItems[itemIndex].quantity = newQuantity;
          const newCart = { ...cart, items: newItems };
          localStorage.setItem('guestCart', JSON.stringify(newCart));
          set({ cart: newCart });
        }
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
      useNotificationStore.getState().addNotification('Failed to update cart quantity', 'error');
    } finally {
      set({ cartUpdating: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated, currentUser, walletAddress } = get();
      let response;
      if (isAuthenticated || walletAddress) {
        // Ensure we have a valid user ID
        const userId = currentUser?._id || currentUser?.id;
        if (!userId) {
          console.error('No user ID found for cart removal:', currentUser);
          throw new Error('User ID not found');
        }
        response = await cartService.removeFromCart(userId, productId);
      } else {
        response = await cartService.removeFromCart(null, productId);
      }
      set({ cart: response });
      useNotificationStore.getState().addNotification('Item removed from cart', 'success');
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      useNotificationStore.getState().addNotification('Failed to remove item from cart', 'error');
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
        console.log('Backend cart cleared successfully');
      }
      
      // Clear frontend state
      set({
        cart: {
          items: [],
          total: 0,
          subtotal: 0,
        }
      });
      
      // Also clear localStorage guest cart
      localStorage.removeItem('guestCart');
      console.log('Frontend cart cleared successfully');
    } catch (error) {
      console.error('Error clearing cart:', error);
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
      console.error('Failed to fetch wishlist:', error);
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
      console.error('Failed to add to wishlist:', error);
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
      console.error('Failed to remove from wishlist:', error);
    } finally {
      set({ wishlistUpdating: false });
    }
  },
  };
});

export default useStore;