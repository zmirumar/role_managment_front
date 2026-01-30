import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createJSONStorage } from 'zustand/middleware';

interface User {
  id: number;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
}

interface Permissions {
  [key: string]: boolean;
}

interface AuthState {
  token: string | null;
  isLogged: boolean;
  user: User | null;
  permissions: Permissions;
  login: (token: string, user: User, permissions: Permissions) => void;
  logout: () => void;
}

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
