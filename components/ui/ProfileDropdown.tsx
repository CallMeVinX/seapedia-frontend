'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { ChevronDown, LogOut, Settings, Wallet, Package, MapPin, Store, Truck, Users } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import { RoleSwitcher } from './RoleSwitcher';
import { showToast } from '@/utils/toast';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';

export const ProfileDropdown = () => {
  const { user, activeRole, ownedRoles, setActiveRole, logout, addOwnedRole, setRoleModalOpen } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showSellerTerms, setShowSellerTerms] = useState(false);
  const [showDriverTerms, setShowDriverTerms] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleNavigate = async (path: string) => {
    if (activeRole?.toUpperCase() !== 'BUYER') {
      try {
        await authService.selectRole('BUYER');
        setActiveRole('BUYER');
      } catch (error) {
        showToast.error("Gagal", "Tidak dapat membuka profil.");
        return;
      }
    }
    setDropdownOpen(false);
    router.push(path);
  };

  const handleAddRole = async (role: string) => {
    try {
      // Add the role in backend
      await authService.addRole(role);
      // Refresh the token to include the new role as active
      await authService.selectRole(role);
      setActiveRole(role as any);
      addOwnedRole(role as any);
      showToast.success("Berhasil", `Berhasil mendaftar sebagai ${role}!`);
      
      setDropdownOpen(false);
      // Redirect to the appropriate dashboard
      if (role === 'SELLER') {
        router.push('/seller/dashboard');
      } else if (role === 'DRIVER') {
        router.push('/driver/dashboard');
      }
    } catch (error) {
      showToast.error("Gagal", `Tidak dapat mendaftar sebagai ${role}.`);
    }
  };

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className={`flex items-center gap-2 text-sm font-medium transition-all p-1.5 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-1 ${dropdownOpen ? 'bg-slate-100 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-slate-900'}`}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold shadow-inner ring-2 ring-white overflow-hidden">
          {user.avatar_url ? (
            <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user.name.charAt(0).toUpperCase()
          )}
        </div>
        <span className="hidden sm:block font-semibold tracking-tight pr-1">{user.name}</span>
        <ChevronDown className={`h-4 w-4 mr-1 transition-transform duration-200 ${dropdownOpen ? 'rotate-180 text-blue-600' : 'text-slate-400'}`} />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] py-2 z-50 transform origin-top-right transition-all ease-out duration-200 animate-in fade-in slide-in-from-top-2">
          <div className="px-4 py-3 border-b border-slate-100/80 mb-1 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-700 to-blue-500 flex items-center justify-center text-white font-bold shadow-sm shrink-0 overflow-hidden">
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
              <p className="text-[11px] font-medium text-slate-500 truncate">{user.email}</p>
            </div>
          </div>
          
          <div className="py-1">
            <button onClick={() => handleNavigate('/buyer/profile?tab=wallet')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left">
              <Wallet className="h-4 w-4 text-slate-400" />
              Dompet
            </button>
            <button onClick={() => handleNavigate('/buyer/orders')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left">
              <Package className="h-4 w-4 text-slate-400" />
              Riwayat Pesanan
            </button>
            <button onClick={() => handleNavigate('/buyer/profile?tab=address')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left">
              <MapPin className="h-4 w-4 text-slate-400" />
              Pengaturan Alamat
            </button>
            <div className="h-px bg-slate-100 my-1 mx-2"></div>
            
            <button onClick={() => handleNavigate('/buyer/profile?tab=personal')} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors text-left">
              <Settings className="h-4 w-4 text-slate-400" />
              Profile Settings
            </button>
            
            {ownedRoles.length > 1 && (
              <button 
                onClick={() => { setDropdownOpen(false); setRoleModalOpen(true); }} 
                className="w-full sm:hidden flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-indigo-700 hover:bg-indigo-50 hover:text-indigo-800 transition-colors text-left"
              >
                <Users className="h-4 w-4 text-indigo-500" />
                Ganti Peran (Role)
              </button>
            )}
            
            {(!ownedRoles.includes('SELLER') || !ownedRoles.includes('DRIVER')) && (
              <div className="h-px bg-slate-100 my-1 mx-2"></div>
            )}
            
            {!ownedRoles.includes('SELLER') && (
              <button 
                onClick={() => { setDropdownOpen(false); setShowSellerTerms(true); }} 
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 transition-colors text-left"
              >
                <Store className="h-4 w-4 text-emerald-500" />
                Buka Toko Gratis
              </button>
            )}

            {!ownedRoles.includes('DRIVER') && (
              <button 
                onClick={() => { setDropdownOpen(false); setShowDriverTerms(true); }} 
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-amber-700 hover:bg-amber-50 hover:text-amber-800 transition-colors text-left"
              >
                <Truck className="h-4 w-4 text-amber-500" />
                Daftar Jadi Driver
              </button>
            )}

            <div className="h-px bg-slate-100 my-1 mx-2"></div>
            
            <button 
              onClick={async () => {
                await authService.logout();
                logout();
                showToast.success("Berhasil", "Logout berhasil!");
                setDropdownOpen(false);
                router.push("/login");
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50/50 hover:text-red-700 transition-colors"
            >
              <LogOut className="h-4 w-4 text-red-500" />
              Sign out
            </button>
          </div>
        </div>
      )}

      {/* Seller Terms Modal */}
      <Modal 
        isOpen={showSellerTerms} 
        onClose={() => setShowSellerTerms(false)} 
        title="Syarat & Ketentuan Penjual (Seller)"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowSellerTerms(false)}>Batal</Button>
            <Button variant="primary" onClick={() => { setShowSellerTerms(false); handleAddRole('SELLER'); }}>Saya Setuju & Lanjutkan</Button>
          </div>
        }
      >
        <p>Dengan mendaftar sebagai Penjual di SEAPEDIA, Anda menyetujui kebijakan berikut:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Anda hanya akan menjual barang yang legal dan sesuai dengan kategori yang diizinkan.</li>
            <li>Anda menyetujui potongan biaya administrasi platform sebesar 3% dari setiap transaksi yang berhasil.</li>
            <li>Dana penjualan akan ditahan di sistem Escrow SEAPEDIA dan baru dapat ditarik ke Wallet Anda setelah pembeli mengkonfirmasi penerimaan barang.</li>
            <li>Anda bersedia memproses pesanan maksimal dalam 2x24 jam kerja, atau pesanan akan dibatalkan otomatis.</li>
        </ul>
      </Modal>

      {/* Driver Terms Modal */}
      <Modal 
        isOpen={showDriverTerms} 
        onClose={() => setShowDriverTerms(false)} 
        title="Syarat & Ketentuan Mitra Driver"
        footer={
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => setShowDriverTerms(false)}>Batal</Button>
            <Button variant="primary" onClick={() => { setShowDriverTerms(false); handleAddRole('DRIVER'); }}>Saya Setuju & Lanjutkan</Button>
          </div>
        }
      >
        <p>Dengan mendaftar sebagai Mitra Driver di SEAPEDIA, Anda menyetujui kebijakan berikut:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Anda bertanggung jawab menjaga kondisi barang pesanan dari titik penjemputan hingga ke tangan pelanggan.</li>
            <li>Anda harus memiliki Surat Izin Mengemudi (SIM) yang masih berlaku sesuai dengan jenis kendaraan yang didaftarkan.</li>
            <li>Sistem akan memotong 20% dari tarif pengantaran sebagai biaya layanan platform SEAPEDIA.</li>
            <li>Tindakan penipuan, penahanan paket, atau penyalahgunaan akun akan mengakibatkan akun Anda diblokir secara permanen.</li>
        </ul>
      </Modal>

    </div>
  );
};
