'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import { LayoutDashboard, Ticket, Shield, Home } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import Button from '@/components/ui/Button';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';

/**
 * 🛡️ Guard Agent: Admin Layout
 * 
 * Route Guard untuk seluruh halaman Admin.
 * RULE: Hanya render children jika activeRole === 'ADMIN'.
 *       Jika gagal validasi, arahkan ke EmptyState tanpa memuat komponen anak.
 *       (Sesuai Context/Guard Agents di AGENTS.md §1.D)
 * 
 * Theme: Rose/Red accent untuk membedakan dari Seller (blue) dan Driver (indigo).
 */

const ADMIN_NAVIGATION = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Voucher & Promo', href: '/admin/vouchers', icon: Ticket },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, activeRole } = useAuthStore();

  const isAdmin = activeRole?.toUpperCase() === 'ADMIN';

  // ── Guard: Tolak akses jika bukan Admin ──
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center bg-slate-50 p-6">
        <EmptyState 
          icon={Shield}
          title="Akses Ditolak"
          description="Halaman ini khusus untuk Admin. Pastikan Anda sudah login dan menggunakan role Admin."
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
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white border-r border-slate-200 flex-shrink-0 md:sticky md:top-0 md:h-screen overflow-y-auto">
        <div className="p-6 h-full flex flex-col min-h-max">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-lg flex items-center justify-center shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 truncate">
                Admin Panel
              </h2>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <nav className="space-y-1 flex-1">
            {ADMIN_NAVIGATION.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`
                    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                    ${isActive 
                      ? 'bg-rose-50 text-rose-700' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-rose-600' : 'text-slate-400'}`} />
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
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 hover:text-rose-700 transition-colors text-left"
            >
              <Home className="w-4 h-4 text-slate-400" />
              Kembali ke Marketplace
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
