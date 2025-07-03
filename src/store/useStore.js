import { create } from 'zustand';
import userService from '../services/userService';

const MOCK_USER = {
  address: '0xCbdc...3432',
  avatar: '/images/0e48610f4fecc933e17441d93f63ddcc9c4d1943 (1).png',
  name: 'John Doe',
  balance: 0,
  profileUrl: '/profile',
};

const useStore = create((set, get) => ({
  currentUser: null,
  userCurrency: "USDT",

  setCurrentUser: (user) => {
    set({ currentUser: user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  connectUserWallet: async () => {
    // Simulate wallet connect and user creation
    const walletUser = {
      address: '0xCbdc...3432',
      avatar: '/images/0e48610f4fecc933e17441d93f63ddcc9c4d1943 (1).png',
      name: 'John Doe',
      balance: 0,
      profileUrl: '/profile',
    };
    // Optionally call userService.createUser(walletUser) if you want to persist
    // await userService.createUser(walletUser);
    set({ currentUser: walletUser });
    localStorage.setItem('user', JSON.stringify(walletUser));
  },

  setUserCurrency: (currency) => set({ userCurrency: currency }),

  // Cart state management
  cart: {
    items: [
      {
        productId: '1',
        name: 'New Apple iPhone 16 Plus ESIM 128GB',
        price: 450.36,
        quantity: 1,
        image: '/images/desktop-1.png'
      },
      {
        productId: '2', 
        name: 'New Apple iPhone 16 Plus ESIM 128GB',
        price: 450.36,
        quantity: 1,
        image: '/images/desktop-1.png'
      },
      {
        productId: '3',
        name: 'New Apple iPhone 16 Plus ESIM 128GB', 
        price: 450.36,
        quantity: 1,
        image: '/images/desktop-1.png'
      }
    ]
  },
  cartLoading: false,
  cartUpdating: false,

  // Cart actions
  addToCart: (product) => {
    const { cart } = get();
    const existingItem = cart.items.find(item => item.productId === product.productId);
    
    if (existingItem) {
      set({
        cart: {
          ...cart,
          items: cart.items.map(item =>
            item.productId === product.productId
              ? { ...item, quantity: item.quantity + 1 }
              : item
          )
        }
      });
    } else {
      set({
        cart: {
          ...cart,
          items: [...cart.items, { ...product, quantity: 1 }]
        }
      });
    }
  },

  updateCartQuantity: (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.map(item =>
          item.productId === productId
            ? { ...item, quantity: newQuantity }
            : item
        )
      }
    });
  },

  removeFromCart: (productId) => {
    const { cart } = get();
    set({
      cart: {
        ...cart,
        items: cart.items.filter(item => item.productId !== productId)
      }
    });
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
    return cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },

  getCartItemCount: () => {
    const { cart } = get();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  },

  setCartLoading: (loading) => set({ cartLoading: loading }),
  setCartUpdating: (updating) => set({ cartUpdating: updating }),
}));

export default useStore;