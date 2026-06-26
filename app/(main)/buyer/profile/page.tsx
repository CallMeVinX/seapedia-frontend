"use client";

import { Suspense } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useBuyerProfile } from '@/hooks/useBuyerProfile';
import { ProfileTabs } from '@/components/buyer/ProfileTabs';
import { WalletCard } from '@/components/buyer/WalletCard';
import { AddressManager } from '@/components/buyer/AddressManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { User, Mail, Shield, ArrowLeft, Loader2, Edit3 } from 'lucide-react';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';

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
    handleDeleteAddress,
    isEditProfileOpen,
    setIsEditProfileOpen,
    isUpdatingProfile,
    editProfileForm,
    setEditProfileForm,
    handleUpdateProfile
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
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-5">
                {user.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar_url} alt={user.name} className="w-20 h-20 rounded-2xl object-cover shadow-lg shadow-slate-200/50 border border-slate-200" />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-blue-600/20">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
                  <p className="text-slate-500 text-sm">{user.email}</p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditProfileOpen(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profil
              </button>
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

        <Modal
          isOpen={isEditProfileOpen}
          onClose={() => setIsEditProfileOpen(false)}
          title="Edit Profil"
          footer={
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditProfileOpen(false)}
                disabled={isUpdatingProfile}
                className="px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateProfile}
                disabled={isUpdatingProfile}
                className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingProfile && <Loader2 className="w-4 h-4 animate-spin" />}
                Simpan Profil
              </button>
            </div>
          }
        >
          <div className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700">Foto Profil</label>
              <ImageUpload
                uploadType="user"
                defaultImage={editProfileForm.avatar_url}
                onImageUploaded={(url) => setEditProfileForm(prev => ({ ...prev, avatar_url: url }))}
                onImageRemoved={() => setEditProfileForm(prev => ({ ...prev, avatar_url: '' }))}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-slate-700">Nama Lengkap</label>
              <input
                type="text"
                value={editProfileForm.full_name}
                onChange={(e) => setEditProfileForm(prev => ({ ...prev, full_name: e.target.value }))}
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
                placeholder="Masukkan nama lengkap"
              />
            </div>
          </div>
        </Modal>
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
