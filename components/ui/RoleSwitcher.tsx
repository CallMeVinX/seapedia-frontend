'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { ChevronDown } from 'lucide-react';

export const RoleSwitcher = () => {
  const { ownedRoles, activeRole, setRoleModalOpen } = useAuthStore();

  if (ownedRoles.length <= 1) return null;

  return (
    <button
      onClick={() => setRoleModalOpen(true)}
      className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-full transition-colors group focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
    >
      <span className="text-xs font-semibold text-blue-900 tracking-tight">
        Role: <span className="capitalize">{activeRole}</span>
      </span>
      <ChevronDown className="h-3.5 w-3.5 text-blue-600 group-hover:text-blue-800 transition-colors" />
    </button>
  );
};
