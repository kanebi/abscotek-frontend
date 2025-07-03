import { create } from 'zustand';

const useStore = create((set, get) => ({
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  userCurrency: "USDT",

  setCurrentUser: (user) => {
    set({ currentUser: user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
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