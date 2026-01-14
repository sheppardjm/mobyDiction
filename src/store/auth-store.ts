import { create } from 'zustand';

interface AuthStore {
  isAuthModalOpen: boolean;
  authMode: 'signIn' | 'signUp';

  openAuthModal: (mode: 'signIn' | 'signUp') => void;
  closeAuthModal: () => void;
  setAuthMode: (mode: 'signIn' | 'signUp') => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  isAuthModalOpen: false,
  authMode: 'signIn',

  openAuthModal: (mode) => set({ isAuthModalOpen: true, authMode: mode }),
  closeAuthModal: () => set({ isAuthModalOpen: false }),
  setAuthMode: (mode) => set({ authMode: mode }),
}));
