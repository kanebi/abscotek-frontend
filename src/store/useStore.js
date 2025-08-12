import { create } from 'zustand';
import authService from '../services/authService';
import userService from '../services/userService';
import cartService from '../services/cartService';

const useStore = create((set, get) => ({
  // User state
  walletAddress: null,
  isAuthenticated: false,
  token: null,
  currentUser: null,
  chainId: null,

  // User actions
  setWalletAddress: (walletAddress) => set({ walletAddress }),
  setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
  setToken: (token) => set({ token }),
  setCurrentUser: (user) => set({ currentUser: user }),
  setChainId: (chainId) => set({ chainId }),

  // Cart state management
  cart: {
    items: [],
  },
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
      }
    } catch (error) {
      console.error('Failed to fetch cart:', error);
    } finally {
      set({ cartLoading: false });
    }
  },

  addToCart: async (productId, quantity = 1) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await cartService.addToCart(productId, quantity);
        set({ cart: response });
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
    } finally {
      set({ cartUpdating: false });
    }
  },

  updateCartQuantity: async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    set({ cartUpdating: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await cartService.updateCartQuantity(productId, newQuantity);
        set({ cart: response });
      }
    } catch (error) {
      console.error('Failed to update cart quantity:', error);
    } finally {
      set({ cartUpdating: false });
    }
  },

  removeFromCart: async (productId) => {
    set({ cartUpdating: true });
    try {
      const { isAuthenticated } = get();
      if (isAuthenticated) {
        const response = await cartService.removeFromCart(productId);
        set({ cart: response });
      }
    } catch (error) {
      console.error('Failed to remove from cart:', error);
    } finally {
      set({ cartUpdating: false });
    }
  },

  clearCart: () => {
    set({
      cart: {
        items: []
      }
    });
  },

  getCartTotal: () => {
    const { cart } = get();
    return cart.items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
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
    set({ wishlistUpdating: false });
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
}));

export default useStore;