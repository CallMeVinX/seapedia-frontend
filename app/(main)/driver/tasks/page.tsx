"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useDriver } from '@/hooks/useDriver';
import { Loader2, Truck, CheckCircle, MapPin, Package } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

export default function DriverTasksPage() {
  const { } = useAuthStore();
  const {
    activeJobs,
    isLoading,
    isCompletingJob,
    completeJob,
    refreshData
  } = useDriver();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading && activeJobs.length === 0) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div>
        <h1 className="text-2xl font-black text-slate-900">Tugas Aktif</h1>
        <p className="text-slate-500 text-sm mt-1">Pekerjaan yang sedang Anda kirimkan saat ini.</p>
      </div>

      <div className="max-w-2xl">
        {activeJobs.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Truck className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Tidak ada tugas aktif</h3>
            <p className="text-slate-500 mb-6">Silakan ambil pekerjaan baru dari halaman Dashboard.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {activeJobs.map(job => (
              <div key={job.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-amber-700 px-2.5 py-1 bg-amber-50 border border-amber-100 rounded-md">Order #{job.id}</span>
                      <p className="text-sm font-medium text-slate-500 mt-1">Status: Sedang Dikirim</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-slate-500 font-medium mb-1">Potensi Pendapatan</p>
                    <span className="text-xl font-black text-emerald-600">{formatCurrency(Number(job.delivery_fee || 0))}</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-5 rounded-xl border border-slate-100 mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package className="w-4 h-4 text-indigo-500" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Lokasi Penjemputan</p>
                    </div>
                    <p className="text-base font-bold text-slate-800">{job.store_name}</p>
                    <p className="text-sm text-slate-500 mt-1">Toko Penjual</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin className="w-4 h-4 text-rose-500" />
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tujuan Pengiriman</p>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {job.shipping_address || 'Alamat tidak tersedia'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => completeJob(job.id)}
                  disabled={isCompletingJob === job.id}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-70 text-base"
                >
                  {isCompletingJob === job.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                  Konfirmasi Pesanan Telah Sampai
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
