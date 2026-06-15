import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'buyer' | 'seller' | 'driver' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  ownedRoles: Role[];
  activeRole: Role | null;
  
  login: (user: User, token: string, roles: Role[]) => void;
  logout: () => void;
  setActiveRole: (role: Role) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      ownedRoles: [],
      activeRole: null,

      login: (user, token, roles) => 
        set({ 
          user, 
          token, 
          ownedRoles: roles,
          activeRole: roles.length === 1 ? roles[0] : null 
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          ownedRoles: [], 
          activeRole: null 
        }),

      setActiveRole: (role) => 
        set({ activeRole: role }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
