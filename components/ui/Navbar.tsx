'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Search, ShoppingCart, LogOut, Settings, ArrowLeftRight, ChevronDown } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/hooks/useAuthStore';
import Button from './Button';

export const Navbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, activeRole, ownedRoles } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync state if query param changes externally
  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const renderGuestMenu = () => (
    <>
      <Link href="/products" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Browse Products</Link>
      <Link href="/reviews" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Application Reviews</Link>
    </>
  );

  const renderBuyerMenu = () => (
    <>
      <Link href="/buyer/cart" className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-700 transition-colors">
        <ShoppingCart className="h-4 w-4" />
        Keranjang (0)
      </Link>
      <Link href="/buyer/wallet" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Dompet / Saldo</Link>
      <Link href="/buyer/orders" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pesanan Saya</Link>
    </>
  );

  const renderSellerMenu = () => (
    <>
      <Link href="/seller/store" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Toko Saya</Link>
      <Link href="/seller/orders" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Pesanan Masuk</Link>
      <Link href="/seller/revenue" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Laporan Pendapatan</Link>
    </>
  );

  const renderDriverMenu = () => (
    <>
      <Link href="/driver/jobs" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Cari Pekerjaan</Link>
      <Link href="/driver/tasks" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Tugas Aktif</Link>
      <Link href="/driver/history" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Riwayat & Pendapatan</Link>
    </>
  );

  const renderAdminMenu = () => (
    <>
      <Link href="/admin/monitoring" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Monitoring</Link>
      <Link href="/admin/discounts" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Manajemen Diskon</Link>
      <Link href="/admin/overdue" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Overdue Handling</Link>
    </>
  );

  const renderDynamicMenu = () => {
    if (!user) return renderGuestMenu();
    switch (activeRole) {
      case 'buyer': return renderBuyerMenu();
      case 'seller': return renderSellerMenu();
      case 'driver': return renderDriverMenu();
      case 'admin': return renderAdminMenu();
      default: return null;
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-6">
          
          {/* Logo & Dynamic Links */}
          <div className="flex items-center gap-8 shrink-0">
            <Link href="/" className="text-2xl font-extrabold tracking-tight text-blue-900">
              SEAPEDIA
            </Link>
            <div className="hidden md:flex items-center gap-6">
              {renderDynamicMenu()}
            </div>
          </div>

          {/* Search Bar - Optional UI component */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden lg:flex mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                placeholder="Search across all stores..."
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-4 shrink-0">
            {!user ? (
              // Guest Right Menu
              <>
                <Link href="/login" className="p-2 text-slate-600 hover:text-blue-700 transition-colors" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex items-center gap-3">
                  <Link href="/login">
                    <Button variant="secondary" className="px-5 py-2">Login</Button>
                  </Link>
                  <Link href="/register">
                    <Button variant="primary" className="px-5 py-2">Register</Button>
                  </Link>
                </div>
              </>
            ) : (
              // Authenticated Global Menu
              <>
                {/* Role Badge */}
                {activeRole && (
                  <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-md">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">
                      Mode: {activeRole}
                    </span>
                  </div>
                )}

                {/* Switch Role */}
                {ownedRoles.length > 1 && (
                  <Link href="/select-role" className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors">
                    <ArrowLeftRight className="h-3.5 w-3.5" />
                    Switch Role
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>

                {/* Profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors p-1.5 rounded-md hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-900 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:block">{user.name}</span>
                    <ChevronDown className="h-4 w-4 text-slate-400" />
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-1 z-50 transform origin-top-right transition-all">
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      </div>
                      
                      <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-slate-900">
                        <Settings className="h-4 w-4" />
                        Profile Settings
                      </Link>
                      
                      <button 
                        onClick={() => {
                          logout();
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut className="h-4 w-4" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
