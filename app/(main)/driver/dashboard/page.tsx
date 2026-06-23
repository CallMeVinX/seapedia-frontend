"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useDriver } from '@/hooks/useDriver';
import { Loader2, Package, Truck, History, MapPin } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import Link from 'next/link';

export default function DriverDashboardPage() {
  const { } = useAuthStore();
  const {
    availableJobs,
    activeJobs,
    earnings,
    isLoading,
    isTakingJob,
    takeJob,
    refreshData
  } = useDriver();

  useEffect(() => {
    // Refresh interval every 30s
    const interval = setInterval(() => {
      refreshData();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshData]);

  if (isLoading && !earnings) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  const hasActiveJob = activeJobs.length > 0;
  const totalSelesai = earnings?.history.length || 0;

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Driver Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola pengiriman dan pantau pendapatan Anda.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Saldo Pendapatan</p>
          <h2 className="text-3xl font-black text-emerald-600">
            {formatCurrency(earnings?.total_earnings || 0)}
          </h2>
        </div>
      </div>

      {/* Action Center */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Truck className="w-5 h-5 text-indigo-500" />
          Status Operasional
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">Tersedia untuk Diambil</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{availableJobs.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </div>
          
          <Link href="/driver/tasks" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-amber-300 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-amber-600 transition-colors">Tugas Aktif</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{activeJobs.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
          </Link>

          <Link href="/driver/history" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all group flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-emerald-600 transition-colors">Tugas Diselesaikan</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{totalSelesai}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
              <History className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>

      {/* Tersedia (Full width) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col min-h-[400px]">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-indigo-500" />
            Pesanan Tersedia
          </h3>
          <span className="bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-xs font-bold">
            {availableJobs.length} Order Baru
          </span>
        </div>
        
        <div className="flex-1 space-y-4">
          {availableJobs.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 py-16">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Package className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="font-bold text-slate-800 mb-1">Belum ada pekerjaan</h3>
              <p className="text-sm">Menunggu penjual memproses pesanan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableJobs.map(job => (
                <div key={job.id} className="border border-slate-200 rounded-xl p-5 hover:border-indigo-300 transition-all shadow-sm flex flex-col bg-slate-50/50">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 bg-white border border-slate-200 rounded-md text-slate-600">#{job.id}</span>
                    <span className="text-base font-black text-emerald-600">{formatCurrency(Number(job.delivery_fee || 0))}</span>
                  </div>
                  <div className="mb-4 space-y-3 flex-1">
                    <div>
                      <p className="text-xs text-slate-500 font-medium">Toko Pengirim</p>
                      <p className="text-sm font-bold text-slate-800 truncate">{job.store_name}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-slate-500 font-medium mb-0.5">Tujuan Pengiriman</p>
                        <p className="text-xs font-medium text-slate-700 line-clamp-2">{job.shipping_address || 'Alamat tidak tersedia'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-auto pt-4 border-t border-slate-200/60">
                    <button
                      onClick={() => takeJob(job.id)}
                      disabled={isTakingJob === job.id || hasActiveJob}
                      className="w-full py-2.5 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-lg transition-colors text-sm flex justify-center items-center gap-2 shadow-sm disabled:opacity-50"
                    >
                      {isTakingJob === job.id ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                      {hasActiveJob ? 'Tugas Aktif Berjalan' : 'Ambil Pekerjaan'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
