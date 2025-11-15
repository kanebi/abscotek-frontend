import { create } from 'zustand';

const useAdminStore = create((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  login: (token, user) => {
    set({ isAuthenticated: true, token, user });
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminUser', JSON.stringify(user));
  },
  logout: () => {
    set({ isAuthenticated: false, token: null, user: null });
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminUser');
  },
  loadFromSession: () => {
    const token = sessionStorage.getItem('adminToken');
    const user = JSON.parse(sessionStorage.getItem('adminUser'));
    if (token && user) {
      set({ isAuthenticated: true, token, user });
    }
  },
}));

export default useAdminStore;
