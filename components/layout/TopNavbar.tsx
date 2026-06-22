'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search, ShoppingCart, Menu, X } from 'lucide-react';
import { useAuthStore } from '@/hooks/useAuthStore';
import Button from '@/components/ui/Button';
import { ProfileDropdown } from '@/components/ui/ProfileDropdown';
import { RoleSwitcher } from '@/components/ui/RoleSwitcher';
import { useCartStore } from '@/hooks/useCartStore';

export const TopNavbar = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, activeRole } = useAuthStore();
  const { totalItems, fetchCartCount } = useCartStore();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setSearchQuery(searchParams.get('search') || '');
  }, [searchParams]);

  useEffect(() => {
    if (activeRole?.toLowerCase() === 'buyer') {
      fetchCartCount();
    }
  }, [activeRole, fetchCartCount]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/products');
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4 sm:gap-6">
          
          <div className="flex items-center gap-4 sm:gap-8 shrink-0">
            {/* Hamburger Button */}
            <button 
              className="lg:hidden p-2 text-slate-500 hover:text-blue-700 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href="/" className="text-xl sm:text-2xl font-extrabold tracking-tight text-blue-900">
              SEAPEDIA
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <Link href="/" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Beranda</Link>
              <Link href="/products" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Katalog</Link>
              <Link href="/reviews" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Ulasan</Link>
            </div>
          </div>

          {/* Desktop Search */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-xl hidden md:flex mx-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent sm:text-sm transition-all"
                placeholder="Cari produk..."
              />
            </div>
          </form>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {!user ? (
              <>
                <Link href="/login" className="p-2 text-slate-600 hover:text-blue-700 transition-colors" title="Cart">
                  <ShoppingCart className="h-5 w-5" />
                </Link>
                <div className="h-6 w-px bg-slate-200 hidden sm:block"></div>
                <div className="flex items-center gap-2 sm:gap-3">
                  <Link href="/login">
                    <Button variant="secondary" className="px-3 sm:px-5 py-1.5 sm:py-2 text-sm">Login</Button>
                  </Link>
                  <Link href="/register" className="hidden sm:block">
                    <Button variant="primary" className="px-5 py-2 text-sm">Register</Button>
                  </Link>
                </div>
              </>
            ) : (
              <>
                {activeRole?.toLowerCase() === 'buyer' && (
                  <div className="flex items-center mr-1 sm:mr-4">
                    <Link href="/buyer/cart" className="relative p-2 text-slate-500 hover:text-blue-700 transition-colors" title="Keranjang">
                      <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                      {totalItems > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                          {totalItems > 99 ? '99+' : totalItems}
                        </span>
                      )}
                    </Link>
                  </div>
                )}
                
                <div className="hidden sm:block">
                  <RoleSwitcher />
                </div>
                <div className="h-6 w-px bg-slate-200 hidden sm:block mx-1"></div>
                <ProfileDropdown />
              </>
            )}
          </div>
        </div>

        {/* Mobile Search Row */}
        <form onSubmit={handleSearchSubmit} className="lg:hidden pb-3 px-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-600 focus:border-transparent text-sm transition-all"
              placeholder="Cari produk..."
            />
          </div>
        </form>

        {/* Mobile Nav Links Dropdown */}
        {isMobileMenuOpen && (
          <div className="lg:hidden flex flex-col gap-2 px-2 pb-4 border-t border-slate-100 pt-4">
            <Link 
              href="/" 
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/products" 
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Katalog
            </Link>
            <Link 
              href="/reviews" 
              className="block px-4 py-3 text-base font-semibold text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-xl transition-colors"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Ulasan
            </Link>
          </div>
        )}

      </div>
    </nav>
  );
};
