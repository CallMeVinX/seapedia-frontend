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
  isRoleModalOpen: boolean;
  
  login: (user: User, token: string, roles: Role[]) => void;
  logout: () => void;
  setActiveRole: (role: Role, token?: string) => void;
  setRoleModalOpen: (isOpen: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      ownedRoles: [],
      activeRole: null,
      isRoleModalOpen: false,

      login: (user, token, roles) => 
        set({ 
          user, 
          token, 
          ownedRoles: roles,
          activeRole: roles.length === 1 ? roles[0] : null,
          isRoleModalOpen: roles.length > 1
        }),

      logout: () => 
        set({ 
          user: null, 
          token: null, 
          ownedRoles: [], 
          activeRole: null,
          isRoleModalOpen: false
        }),

      setActiveRole: (role, token) => 
        set((state) => ({ 
          activeRole: role, 
          isRoleModalOpen: false,
          ...(token ? { token } : {})
        })),

      setRoleModalOpen: (isOpen) =>
        set({ isRoleModalOpen: isOpen }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
