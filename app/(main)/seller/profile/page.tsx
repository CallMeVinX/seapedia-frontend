"use client";

import React, { useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSellerDashboard } from '@/hooks/useSellerDashboard';
import { sellerService } from '@/services/sellerService';
import { Store, Loader2, MapPin, CalendarDays, Edit3, Settings } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';
import Modal from '@/components/ui/Modal';
import { ImageUpload } from '@/components/ui/ImageUpload';
import { showToast } from '@/utils/toast';

dayjs.locale('id');

export default function SellerProfilePage() {
  const { } = useAuthStore();
  const { storeStatus, isLoadingStatus, refreshStoreStatus } = useSellerDashboard();
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    store_name: '',
    logo_url: ''
  });

  if (isLoadingStatus) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!storeStatus?.has_store) return null;

  const openEditModal = () => {
    setEditForm({
      store_name: storeStatus.store_name || '',
      logo_url: storeStatus.logo_url || ''
    });
    setIsEditModalOpen(true);
  };

  const handleSave = async () => {
    if (!editForm.store_name.trim()) {
      showToast.error("Gagal", "Nama toko tidak boleh kosong.");
      return;
    }

    setIsSaving(true);
    try {
      await sellerService.updateStore({
        store_name: editForm.store_name,
        logo_url: editForm.logo_url
      });
      showToast.success("Berhasil", "Profil toko berhasil diperbarui.");
      setIsEditModalOpen(false);
      await refreshStoreStatus();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal memperbarui toko.";
      showToast.error("Gagal", msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl pb-20">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Profil Toko</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola informasi dan identitas toko Anda.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Banner Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
           <div className="absolute inset-0 bg-black/10"></div>
        </div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          {/* Avatar / Logo Container */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden flex-shrink-0 z-10">
              {storeStatus.logo_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={storeStatus.logo_url} alt={storeStatus.store_name} className="w-full h-full object-cover" />
              ) : (
                <Store className="w-12 h-12 text-slate-300" />
              )}
            </div>
            
            <button
              onClick={openEditModal}
              className="mb-2 flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 text-sm font-bold border border-slate-200 rounded-xl shadow-sm transition-all"
            >
              <Edit3 className="w-4 h-4 text-blue-600" />
              Edit Profil Toko
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{storeStatus.store_name}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  <CalendarDays className="w-4 h-4 text-blue-600" />
                  <span>Aktif Sejak {dayjs().format('MMMM YYYY')}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider flex items-center gap-2">
                <Settings className="w-4 h-4 text-slate-400" />
                Informasi Sistem
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Nama Toko Publik</p>
                  <p className="text-slate-900 font-semibold text-lg">{storeStatus.store_name}</p>
                </div>
                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-emerald-100 hover:shadow-sm transition-all">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-2 tracking-wider">Status Operasional</p>
                  <p className="text-emerald-700 font-bold flex items-center gap-2 text-lg">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)] animate-pulse"></span> Buka & Aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Profil Toko"
        footer={
          <div className="flex gap-3">
            <button
              onClick={() => setIsEditModalOpen(false)}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Perubahan
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Logo Toko</label>
            <ImageUpload
              uploadType="store"
              defaultImage={editForm.logo_url}
              onImageUploaded={(url) => setEditForm(prev => ({ ...prev, logo_url: url }))}
              onImageRemoved={() => setEditForm(prev => ({ ...prev, logo_url: '' }))}
            />
            <p className="text-xs text-slate-500">Gunakan logo persegi dengan resolusi tinggi agar terlihat menarik.</p>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-slate-700">Nama Toko</label>
            <input
              type="text"
              value={editForm.store_name}
              onChange={(e) => setEditForm(prev => ({ ...prev, store_name: e.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              placeholder="Contoh: Seapedia Official Store"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
