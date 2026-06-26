import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Role = 'buyer' | 'seller' | 'driver' | 'admin' | 'BUYER' | 'SELLER' | 'DRIVER' | 'ADMIN';

interface User {
  id: string;
  name: string;
  email: string;
  avatar_url?: string | null;
}

interface AuthState {
  user: User | null;
  ownedRoles: Role[];
  activeRole: Role | null;
  isRoleModalOpen: boolean;
  
  login: (user: User, roles: Role[]) => void;
  logout: () => void;
  setActiveRole: (role: Role) => void;
  setRoleModalOpen: (isOpen: boolean) => void;
  addOwnedRole: (role: Role) => void;
  updateUser: (data: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      ownedRoles: [],
      activeRole: null,
      isRoleModalOpen: false,

      login: (user, roles) => 
        set({ 
          user, 
          ownedRoles: roles,
          activeRole: roles.length === 1 ? roles[0] : null,
          isRoleModalOpen: roles.length > 1
        }),

      logout: () => 
        set({ 
          user: null, 
          ownedRoles: [], 
          activeRole: null,
          isRoleModalOpen: false
        }),

      setActiveRole: (role) => 
        set(() => ({ 
          activeRole: role, 
          isRoleModalOpen: false
        })),

      setRoleModalOpen: (isOpen) =>
        set({ isRoleModalOpen: isOpen }),
        
        addOwnedRole: (role) =>
        set((state) => {
          if (!state.ownedRoles.includes(role)) {
            return { ownedRoles: [...state.ownedRoles, role] };
          }
          return {};
        }),

      updateUser: (data) =>
        set((state) => {
          if (state.user) {
            return { user: { ...state.user, ...data } };
          }
          return {};
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        ownedRoles: state.ownedRoles,
        activeRole: state.activeRole,
        isRoleModalOpen: state.isRoleModalOpen,
        // Omitting 'token' so it only stays in memory (Memory State)
      }),
    }
  )
);
