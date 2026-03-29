import { create } from 'zustand';
import type { User, AuthState } from '../types';

interface AuthStore extends AuthState {
  setUser: (user: User, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
  updateBalance: (amount: number) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user:            null,
  isAuthenticated: false,
  isLoading:       true,
  token:           null,

  setUser: (user, token) =>
    set({ user, token, isAuthenticated: true, isLoading: false }),

  logout: () =>
    set({ user: null, token: null, isAuthenticated: false, isLoading: false }),

  setLoading: (isLoading) => set({ isLoading }),

  updateBalance: (amount) =>
    set((state) => ({
      user: state.user
        ? { ...state.user, cashBalance: state.user.cashBalance + amount }
        : null,
    })),
}));
