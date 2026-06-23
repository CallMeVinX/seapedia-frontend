"use client";

import { Suspense } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';
import { ProfileTabs } from '@/components/buyer/ProfileTabs';
import { WalletCard } from '@/components/buyer/WalletCard';
import { AddressManager } from '@/components/buyer/AddressManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { User, Mail, Shield, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';

function BuyerProfileContent() {
  const { user } = useAuthStore();
  const {
    activeTab,
    setActiveTab,
    wallet,
    isLoadingWallet,
    isTopingUp,
    handleTopUp,
    addresses,
    isLoadingAddresses,
    isAddingAddress,
    handleAddAddress,
    isDeletingId,
    handleDeleteAddress
  } = useBuyerProfile();

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center p-6">
        <EmptyState
          icon={User}
          title="Akses Ditolak"
          description="Silakan login untuk melihat profil Anda."
          action={<Link href="/login"><Button variant="primary" className="px-8">Login Sekarang</Button></Link>}
        />
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-black text-slate-900">Profil Saya</h1>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Tab Content */}
        {activeTab === 'personal' && (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-8">
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                <p className="text-slate-500 text-sm">{user.email}</p>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <User className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</p>
                  <p className="text-sm font-semibold text-slate-900">{user.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Mail className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</p>
                  <p className="text-sm font-semibold text-slate-900">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                <div className="p-2 bg-white rounded-lg border border-slate-200">
                  <Shield className="w-5 h-5 text-slate-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">ID Akun</p>
                  <p className="text-sm font-semibold text-slate-900 font-mono">{user.id}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'address' && (
          <AddressManager
            addresses={addresses}
            isLoading={isLoadingAddresses}
            isAdding={isAddingAddress}
            isDeletingId={isDeletingId}
            onAddAddress={handleAddAddress}
            onDeleteAddress={handleDeleteAddress}
          />
        )}

        {activeTab === 'wallet' && (
          <WalletCard
            wallet={wallet}
            isLoading={isLoadingWallet}
            isTopingUp={isTopingUp}
            onTopUp={handleTopUp}
          />
        )}
      </div>
    </div>
  );
}

export default function BuyerProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}>
      <BuyerProfileContent />
    </Suspense>
  );
}
