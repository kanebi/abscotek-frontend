import { create } from 'zustand';

const useUserStore = create((set) => ({
  walletAddress: null,
  isAuthenticated: false,
  token: null,
  user: null,
  chainId: null,
  setWalletAddress: (walletAddress) => set({ walletAddress }),
  setAuthenticated: (isAuthenticated, token) => set({ isAuthenticated, token }),
  setUser: (user) => set({ user }),
  setChainId: (chainId) => set({ chainId }),
  logout: () =>
    set({
      walletAddress: null,
      isAuthenticated: false,
      token: null,
      user: null,
      chainId: null,
    }),
}));

export default useUserStore;