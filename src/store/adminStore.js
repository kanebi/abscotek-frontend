import { create } from 'zustand';

const useAdminStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  login: (token, user) => {
    set({ isAuthenticated: true, token, user });
    localStorage.setItem('adminToken', token);
    localStorage.setItem('adminUser', JSON.stringify(user));
  },
  logout: () => {
    set({ isAuthenticated: false, token: null, user: null });
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  },
  loadFromStorage: () => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ isAuthenticated: true, token, user });
      } catch (error) {
        console.error('Error parsing admin user from storage:', error);
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
      }
    }
  },
}));

// Initialize admin store from localStorage on module load
useAdminStore.getState().loadFromStorage();

export default useAdminStore;
