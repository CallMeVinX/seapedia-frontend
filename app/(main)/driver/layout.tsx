'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LayoutDashboard, Truck, Wallet, FileText, Home } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

const DRIVER_NAVIGATION = [
  { name: 'Dashboard', href: '/driver/dashboard', icon: LayoutDashboard },
  { name: 'Tugas Aktif', href: '/driver/tasks', icon: Truck },
  { name: 'Riwayat Pengiriman', href: '/driver/history', icon: FileText },
];

export default function DriverLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, activeRole } = useAuthStore();

  const isDriver = activeRole?.toUpperCase() === 'DRIVER';

  if (!user || !isDriver) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center bg-slate-50 p-6">
        <EmptyState 
          icon={Truck}
          title="Akses Ditolak"
          description="Halaman ini khusus untuk Driver. Pastikan Anda sudah login dan menggunakan role Driver."
          iconTextColor="text-slate-300"
          iconBgColor="bg-slate-100"
          action={
            <Link href="/">
              <Button variant="primary" className="px-8">Kembali ke Beranda</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar - Matching Seller Theme */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div className="p-6 h-full flex flex-col min-h-max">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 truncate">
                Driver Portal
              </h2>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            {DRIVER_NAVIGATION.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-indigo-50 text-indigo-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-indigo-700 transition-colors text-left"
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
