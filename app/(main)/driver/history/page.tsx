"use client";

import React, { useEffect } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useDriver } from '@/hooks/useDriver';
import { Loader2, History } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';
import dayjs from 'dayjs';

export default function DriverHistoryPage() {
  const { } = useAuthStore();
  const {
    earnings,
    isLoading,
    refreshData
  } = useDriver();

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  if (isLoading && !earnings) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Riwayat Pengiriman</h1>
          <p className="text-slate-500 text-sm mt-1">Daftar semua tugas yang telah diselesaikan.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-900">Riwayat Terakhir</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Job ID</th>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Waktu Selesai</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!earnings?.history || earnings.history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <History className="w-6 h-6 text-slate-300" />
                      </div>
                      <p className="font-medium text-slate-600">Belum ada riwayat pengiriman.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                earnings.history.map((hist) => (
                  <tr key={hist.job_id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">JOB-{hist.job_id}</td>
                    <td className="px-6 py-4 font-medium text-slate-600">#{hist.order_id}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {hist.completed_at ? dayjs(hist.completed_at).format('DD MMM YYYY HH:mm') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border bg-emerald-50 text-emerald-700 border-emerald-200">
                        Selesai
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-emerald-600">
                      +{formatCurrency(hist.earning)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
