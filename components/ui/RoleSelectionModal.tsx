'use client';

import { useAuthStore } from '@/hooks/useAuthStore';
import { UserCheck, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export const RoleSelectionModal = () => {
  const { user, ownedRoles, activeRole, setActiveRole, isRoleModalOpen, setRoleModalOpen } = useAuthStore();
  const router = useRouter();

  if (!isRoleModalOpen || !user) return null;

  // If user has no active role, they are forced to pick one, cannot close.
  const isClosable = activeRole !== null;

  const handleSelectRole = async (role: string) => {
    const roleUpper = role.toUpperCase() as any;
    
    try {
      await authService.selectRole(roleUpper);
      setActiveRole(roleUpper);
      setRoleModalOpen(false);
      
      switch (roleUpper) {
        case 'SELLER': router.push('/seller/dashboard'); break;
        case 'DRIVER': router.push('/driver/dashboard'); break;
        case 'ADMIN': router.push('/admin/monitoring'); break;
        case 'BUYER': router.push('/'); break;
      }
    } catch (error) {
      toast.error('Gagal memilih role.');
    }
  };

  const roleDescriptions: Record<string, string> = {
    'BUYER': 'Jelajahi dan beli produk terbaik di SEAPEDIA.',
    'SELLER': 'Kelola toko Anda dan pantau penjualan.',
    'DRIVER': 'Ambil pesanan dan antar ke pelanggan.',
    'ADMIN': 'Pantau dan kelola seluruh sistem SEAPEDIA.'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={() => isClosable && setRoleModalOpen(false)}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-all p-6 sm:p-8 m-4">
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900">Pilih Mode Aktif</h2>
          <p className="mt-2 text-sm text-slate-500">
            {isClosable 
              ? "Ganti peran Anda saat ini untuk mengakses fitur yang berbeda." 
              : "Akun Anda memiliki beberapa peran. Pilih salah satu untuk memulai sesi."}
          </p>
        </div>

        <div className="space-y-3">
          {ownedRoles.map((roleStr) => {
            const roleUpper = roleStr.toUpperCase();
            const isActive = activeRole?.toUpperCase() === roleUpper;

            // Helper to format role string nicely
            const roleDisplay = roleStr.charAt(0).toUpperCase() + roleStr.slice(1).toLowerCase();

            return (
              <div 
                key={roleStr}
                onClick={() => handleSelectRole(roleStr)}
                className={`
                  relative flex items-center p-4 rounded-xl border-2 transition-all cursor-pointer hover:border-blue-400 hover:shadow-md
                  ${isActive ? 'border-blue-600 bg-blue-50/50' : 'border-slate-200 bg-white'}
                `}
              >
                <div className={`
                  flex items-center justify-center w-10 h-10 rounded-full mr-4 shrink-0
                  ${isActive ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-600'}
                `}>
                  <UserCheck className="w-5 h-5" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <p className={`text-base font-bold ${isActive ? 'text-blue-900' : 'text-slate-900'}`}>
                    {roleDisplay}
                  </p>
                  <p className="text-sm text-slate-500 truncate">
                    {roleDescriptions[roleUpper] || 'Fitur SEAPEDIA'}
                  </p>
                </div>

                <div className="ml-4 shrink-0">
                  <div className={`
                    flex items-center justify-center w-6 h-6 rounded-full border-2
                    ${isActive ? 'border-blue-600 bg-blue-600' : 'border-slate-300'}
                  `}>
                    {isActive && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {isClosable && (
          <div className="mt-8 text-center">
            <button 
              onClick={() => setRoleModalOpen(false)}
              className="text-sm font-semibold text-slate-500 hover:text-slate-700"
            >
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
