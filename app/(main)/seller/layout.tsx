'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSellerDashboard } from '@/hooks/useSellerDashboard';
import { StoreRegistrationForm } from '@/components/seller/StoreRegistrationForm';
import { LayoutDashboard, Store, Package, Inbox, Loader2, Tag } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';
import { Home } from 'lucide-react';

const SELLER_NAVIGATION = [
  { name: 'Overview', href: '/seller/dashboard', icon: LayoutDashboard },
  { name: 'Profil Toko', href: '/seller/profile', icon: Store },
  { name: 'Produk Saya', href: '/seller/products', icon: Package },
  { name: 'Kelola Promo', href: '/seller/promos', icon: Tag },
  { name: 'Kelola Pesanan', href: '/seller/orders', icon: Inbox },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuthStore();
  const {
    storeStatus,
    isLoadingStatus,
    isCreatingStore,
    registerStore
  } = useSellerDashboard();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center bg-slate-50 p-6">
        <EmptyState 
          icon={Store}
          title="Akses Ditolak"
          description="Silakan login untuk mengakses halaman Seller."
          iconTextColor="text-slate-300"
          iconBgColor="bg-slate-100"
          action={
            <Link href="/login">
              <Button variant="primary" className="px-8">Login Sekarang</Button>
            </Link>
          }
        />
      </div>
    );
  }

  if (isLoadingStatus) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Memeriksa status toko Anda...</p>
      </div>
    );
  }

  // Jika user belum punya toko, paksa ke halaman registrasi
  if (!storeStatus?.has_store) {
    return (
      <div className="bg-slate-50 min-h-screen">
        <StoreRegistrationForm onSubmit={registerStore} isLoading={isCreatingStore} />
      </div>
    );
  }

  // Layout untuk seller yang sudah memiliki toko
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div className="p-6 h-full flex flex-col min-h-max">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center shrink-0">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 truncate" title={storeStatus.store_name}>
                {storeStatus.store_name || "Toko Anda"}
              </h2>
              <p className="text-xs text-slate-500">Seller Dashboard</p>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            {SELLER_NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-blue-600' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto pt-8 space-y-4">
            <RoleSwitcher />
            <button
              onClick={async () => {
                try {
                  await import('@/services/authService').then(mod => mod.authService.selectRole('BUYER'));
                  useAuthStore.getState().setActiveRole('BUYER');
                  window.location.href = '/';
                } catch (error) {
                  console.error("Failed to switch role", error);
                  window.location.href = '/';
                }
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-blue-700 transition-colors text-left"
            >
              <Home className="w-4 h-4 text-slate-400" />
              Kembali ke Marketplace
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
