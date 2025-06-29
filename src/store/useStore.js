import { create } from 'zustand';

const useStore = create((set) => ({
  currentUser: JSON.parse(localStorage.getItem('user')) || null,
  
  setCurrentUser: (user) => {
    set({ currentUser: user });
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  },

  // You can add other global states here, e.g., cart, wishlist for the *authenticated* user
  // For admin management, we'll continue to fetch specific user's cart/wishlist via services
}));

export default useStore;