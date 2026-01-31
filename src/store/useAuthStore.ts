import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';
import type {  AuthState } from '../interfaces/interfaces';

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      isLogged: false,
      user: null,
      permissions: {},
      login: (token, user, permissions) => {
        set({ token, isLogged: true, user, permissions });
      },
      logout: () => {
        set({ token: null, isLogged: false, user: null, permissions: {} });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
