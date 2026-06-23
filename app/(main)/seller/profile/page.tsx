"use client";

import React from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSellerDashboard } from '@/hooks/useSellerDashboard';
import { Store, Loader2, MapPin, CalendarDays, ExternalLink } from 'lucide-react';
import dayjs from 'dayjs';
import 'dayjs/locale/id';

dayjs.locale('id');

export default function SellerProfilePage() {
  const { } = useAuthStore();
  const { storeStatus, isLoadingStatus } = useSellerDashboard();

  if (isLoadingStatus) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!storeStatus?.has_store) return null; // Ditangani oleh layout guard

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-slate-900">Profil Toko</h1>
        <p className="text-slate-500 text-sm mt-1">Informasi dasar tentang toko Anda.</p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden relative">
        {/* Banner Area */}
        <div className="h-32 bg-gradient-to-r from-blue-600 to-cyan-500"></div>

        {/* Profile Content */}
        <div className="px-8 pb-8">
          {/* Avatar / Logo Container */}
          <div className="relative -mt-16 mb-6 flex justify-between items-end">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-xl border-4 border-white flex items-center justify-center overflow-hidden flex-shrink-0">
              <Store className="w-12 h-12 text-slate-300" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-black text-slate-900">{storeStatus.store_name}</h2>
              <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-slate-600">
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>Indonesia</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full font-medium">
                  <CalendarDays className="w-4 h-4 text-slate-400" />
                  <span>Bergabung {dayjs().format('MMMM YYYY')}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">Informasi Publik</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Nama Toko</p>
                  <p className="text-slate-900 font-semibold">{storeStatus.store_name}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">Status Toko</p>
                  <p className="text-emerald-700 font-bold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Aktif
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50/50 rounded-2xl p-4 border border-blue-100 flex items-start gap-4">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-xl shrink-0">
                <ExternalLink className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Pengaturan Tambahan</h4>
                <p className="text-sm text-slate-600">Saat ini nama dan url toko tidak dapat diubah setelah dibuat untuk menjaga integritas transaksi dengan pelanggan. Hubungi layanan bantuan jika Anda menemukan masalah.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
