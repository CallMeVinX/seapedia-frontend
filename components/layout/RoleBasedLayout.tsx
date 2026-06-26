'use client';

import { ReactNode, useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { GuestBuyerLayout } from './GuestBuyerLayout';
import { RoleSelectionModal } from '@/components/ui/RoleSelectionModal';

export const RoleBasedLayout = ({ children }: { children: ReactNode }) => {
  const { activeRole } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && pathname === '/') {
      const role = activeRole?.toLowerCase();
      if (role === 'admin') {
        router.replace('/admin/dashboard');
      } else if (role === 'seller') {
        router.replace('/seller/dashboard');
      } else if (role === 'driver') {
        router.replace('/driver/dashboard');
      }
    }
  }, [mounted, pathname, activeRole, router]);

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
      case 'driver':
        return <>{children}</>;
      case 'buyer':
      default:
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
