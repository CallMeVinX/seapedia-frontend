'use client';

import { ReactNode, useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { GuestBuyerLayout } from './GuestBuyerLayout';
import { SellerAdminLayout } from './SellerAdminLayout';
import { DriverLayout } from './DriverLayout';
import { RoleSelectionModal } from '@/components/ui/RoleSelectionModal';

export const RoleBasedLayout = ({ children }: { children: ReactNode }) => {
  const { activeRole } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // To prevent hydration errors since activeRole comes from localStorage via zustand
  if (!mounted) {
    return (
      <div className="min-h-screen flex flex-col">
        {/* Placeholder skeleton before hydration */}
        <div className="h-16 bg-white border-b border-slate-200"></div>
        <main className="flex-grow flex flex-col w-full bg-slate-50">
          {children}
        </main>
      </div>
    );
  }

  const renderLayout = () => {
    const role = activeRole?.toLowerCase();
    switch (role) {
      case 'seller':
      case 'admin':
        return <SellerAdminLayout>{children}</SellerAdminLayout>;
      case 'driver':
        return <DriverLayout>{children}</DriverLayout>;
      case 'buyer':
      default:
        // Includes 'buyer' and guest (null or undefined)
        return <GuestBuyerLayout>{children}</GuestBuyerLayout>;
    }
  };

  return (
    <>
      {renderLayout()}
      <RoleSelectionModal />
    </>
  );
};
