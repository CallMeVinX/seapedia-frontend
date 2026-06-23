'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { ChevronDown, ShoppingCart, Store, Truck, Shield } from 'lucide-react';

const ROLE_CONFIG: Record<string, { icon: React.ElementType; label: string; color: string; bg: string }> = {
  buyer:  { icon: ShoppingCart, label: 'Buyer',  color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  seller: { icon: Store,        label: 'Seller', color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200 hover:bg-blue-100' },
  driver: { icon: Truck,        label: 'Driver', color: 'text-amber-700',   bg: 'bg-amber-50 border-amber-200 hover:bg-amber-100' },
  admin:  { icon: Shield,       label: 'Admin',  color: 'text-purple-700',  bg: 'bg-purple-50 border-purple-200 hover:bg-purple-100' },
};

export const RoleSwitcher = () => {
  const { ownedRoles, activeRole, setRoleModalOpen } = useAuthStore();

  const config = ROLE_CONFIG[activeRole?.toLowerCase() || 'buyer'] || ROLE_CONFIG.buyer;
  const Icon = config.icon;
  const hasMultipleRoles = ownedRoles.length > 1;

  return (
    <button
      onClick={() => hasMultipleRoles && setRoleModalOpen(true)}
      className={`flex items-center gap-2 px-3 py-1.5 border rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 ${config.bg} ${hasMultipleRoles ? 'cursor-pointer group' : 'cursor-default'}`}
    >
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className={`text-xs font-bold tracking-tight ${config.color}`}>
        {config.label}
      </span>
      {hasMultipleRoles && (
        <ChevronDown className={`h-3.5 w-3.5 ${config.color} opacity-60 group-hover:opacity-100 transition-opacity`} />
      )}
    </button>
  );
};
