"use client";

import React, { useState } from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatCurrency } from '@/utils/formatCurrency';
import {
  Users,
  Store,
  Package,
  ShoppingCart,
  Truck,
  AlertTriangle,
  CalendarClock,
  Loader2,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Clock,
} from 'lucide-react';

/**
 * 💎 Presentational Agent: Admin Dashboard Page
 * 
 * Halaman utama dashboard Admin yang menampilkan:
 * 1. Metric Cards — aggregated counts dari backend (Users, Stores, Products, dll)
 * 2. Tombol Simulasi Hari Esok — trigger overdue refund
 * 3. Simulation Result Panel — hasil refund orders
 * 4. Recent Orders Table — pesanan terbaru dengan status badge
 * 
 * RULE: Tidak boleh import Service Agent langsung.
 *       Semua data dan action dari useAdminDashboard hook.
 */

// ── Status Badge Color Map ──
const STATUS_STYLES: Record<string, string> = {
  'Menunggu Pembayaran': 'bg-amber-50 text-amber-700 border-amber-200',
  'Sedang Dikemas': 'bg-blue-50 text-blue-700 border-blue-200',
  'Menunggu Pengirim': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Sedang Dikirim': 'bg-cyan-50 text-cyan-700 border-cyan-200',
  'Pesanan Selesai': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Dikembalikan': 'bg-rose-50 text-rose-700 border-rose-200',
  'Dibatalkan': 'bg-slate-100 text-slate-600 border-slate-200',
};

const getStatusStyle = (status: string) =>
  STATUS_STYLES[status] || 'bg-slate-50 text-slate-600 border-slate-200';

// ── Metric Card Data Generator ──
const buildMetricCards = (stats: {
  users_count: number;
  stores_count: number;
  products_count: number;
  orders_count: number;
  delivery_jobs_count: number;
  overdue_orders_count: number;
}) => [
  {
    label: 'Total Users',
    value: stats.users_count,
    icon: Users,
    color: 'bg-blue-50 text-blue-600',
    borderColor: 'hover:border-blue-300',
  },
  {
    label: 'Total Toko',
    value: stats.stores_count,
    icon: Store,
    color: 'bg-emerald-50 text-emerald-600',
    borderColor: 'hover:border-emerald-300',
  },
  {
    label: 'Total Produk',
    value: stats.products_count,
    icon: Package,
    color: 'bg-violet-50 text-violet-600',
    borderColor: 'hover:border-violet-300',
  },
  {
    label: 'Total Pesanan',
    value: stats.orders_count,
    icon: ShoppingCart,
    color: 'bg-amber-50 text-amber-600',
    borderColor: 'hover:border-amber-300',
  },
  {
    label: 'Delivery Jobs',
    value: stats.delivery_jobs_count,
    icon: Truck,
    color: 'bg-indigo-50 text-indigo-600',
    borderColor: 'hover:border-indigo-300',
  },
  {
    label: 'Overdue Orders',
    value: stats.overdue_orders_count,
    icon: AlertTriangle,
    color: 'bg-rose-50 text-rose-600',
    borderColor: 'hover:border-rose-300',
    isAlert: stats.overdue_orders_count > 0,
  },
];

export default function AdminDashboardPage() {
  const {
    stats,
    isLoading,
    isSimulating,
    simulationResult,
    daysForward,
    setDaysForward,
    hoursForward,
    setHoursForward,
    handleSimulate,
  } = useAdminDashboard();

  const [showConfirm, setShowConfirm] = useState(false);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      </div>
    );
  }

  const metricCards = stats ? buildMetricCards(stats) : [];
  const simulatedDateStr = stats?.simulated_date
    ? new Date(stats.simulated_date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-';

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Admin Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">
            Monitoring platform dan manajemen operasional SEAPEDIA.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-500 bg-white border border-slate-200 rounded-xl px-4 py-2.5 shadow-sm">
          <Clock className="w-4 h-4 text-rose-500" />
          <span className="font-medium">Tanggal Simulasi:</span>
          <span className="font-bold text-slate-900">{simulatedDateStr}</span>
        </div>
      </div>

      {/* ── Metric Cards Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {metricCards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className={`
                bg-white p-5 rounded-2xl border border-slate-200 shadow-sm
                ${card.borderColor} hover:shadow-md transition-all group
                ${card.isAlert ? 'ring-2 ring-rose-200 border-rose-200' : ''}
              `}
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                {card.isAlert && (
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500" />
                  </span>
                )}
              </div>
              <h3 className="text-2xl font-black text-slate-900">
                {card.value.toLocaleString('id-ID')}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      {/* ── Simulasi Hari Esok Section ── */}
      <div className="bg-white rounded-2xl p-6 md:p-8 border border-rose-200 shadow-sm relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-50 rounded-full blur-3xl -ml-20 -mb-20 opacity-60"></div>
        
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 bg-rose-100 rounded-xl flex items-center justify-center border border-rose-200">
                <CalendarClock className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Simulasi Waktu / Overdue</h3>
                <p className="text-slate-500 text-sm">Time Simulation Engine</p>
              </div>
            </div>
            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Majukan waktu simulasi beberapa hari ke depan. Sistem akan otomatis memproses 
              pesanan overdue (melewati SLA pengiriman) dan mengeksekusi <strong className="text-rose-600">auto-refund</strong> / <strong className="text-rose-600">auto-return</strong> ke 
              dompet Buyer secara transaksional, serta membatalkan pesanan yang belum dibayar.
            </p>
          </div>

          {!showConfirm ? (
            <div className="shrink-0 flex items-center gap-3">
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-medium mb-1">Hari</label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={daysForward}
                  onChange={(e) => setDaysForward(Number(e.target.value) || 0)}
                  className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label className="text-xs text-slate-500 font-medium mb-1">Jam</label>
                <input
                  type="number"
                  min="0"
                  max="23"
                  value={hoursForward}
                  onChange={(e) => setHoursForward(Number(e.target.value) || 0)}
                  className="w-16 px-2 py-2 border border-slate-200 rounded-lg text-sm text-center focus:ring-2 focus:ring-rose-500 outline-none"
                />
              </div>
              <button
                onClick={() => setShowConfirm(true)}
                disabled={isSimulating}
                className="flex items-center gap-2 px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:scale-[1.02] active:scale-[0.98] mt-5"
              >
                <CalendarClock className="w-5 h-5" />
                Jalankan Simulasi
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="shrink-0 flex flex-col gap-2 items-center bg-rose-50 rounded-xl p-4 border border-rose-200">
              <p className="text-sm font-bold text-rose-700 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Yakin ingin melanjutkan?
              </p>
              <p className="text-xs text-rose-600/70">Pesanan overdue akan di-refund otomatis.</p>
              <div className="flex gap-2 mt-1">
                <button
                  onClick={() => setShowConfirm(false)}
                  disabled={isSimulating}
                  className="px-4 py-2 text-sm font-medium border border-rose-300 text-rose-700 bg-white rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Batal
                </button>
                <button
                  onClick={async () => {
                    await handleSimulate();
                    setShowConfirm(false);
                  }}
                  disabled={isSimulating}
                  className="px-4 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white rounded-lg shadow-sm transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSimulating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Memproses...
                    </>
                  ) : (
                    <>
                      <RotateCcw className="w-4 h-4" />
                      Konfirmasi
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Simulation Result Panel ── */}
        {simulationResult && (
          <div className="relative mt-6 pt-6 border-t border-slate-100">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              <h4 className="font-bold text-slate-900">Hasil Simulasi</h4>
              <span className="text-xs text-slate-500 ml-2">
                Tanggal baru: {new Date(simulationResult.simulated_date).toLocaleDateString('id-ID', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </span>
            </div>
            <p className="text-sm text-slate-600 mb-4">{simulationResult.message}</p>

            {simulationResult.refunded_orders.length > 0 ? (
              <div className="grid gap-3">
                {simulationResult.refunded_orders.map((order) => (
                  <div
                    key={order.order_id}
                    className="flex items-center justify-between bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-rose-50 rounded-lg flex items-center justify-center border border-rose-100">
                        <RotateCcw className="w-4 h-4 text-rose-500" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">Order #{order.order_id}</p>
                        <p className="text-xs text-slate-500">Status: {order.status}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-emerald-600">
                        +{formatCurrency(order.refund_amount)}
                      </p>
                      <p className="text-xs text-slate-500">Refund ke Buyer</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 text-sm bg-slate-50 rounded-xl border border-slate-100">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-emerald-400" />
                Tidak ada pesanan overdue. Semua berjalan lancar! 🎉
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Pesanan Terbaru</h3>
          <p className="text-xs text-slate-500 mt-1">Monitoring status pesanan di seluruh platform.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Toko</th>
                <th className="px-6 py-4">Pembeli</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Total</th>
                <th className="px-6 py-4 text-right">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!stats?.recent_orders || stats.recent_orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-slate-300" />
                      </div>
                      <p>Belum ada data pesanan.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.recent_orders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                    <td className="px-6 py-4 font-medium">{order.store_name}</td>
                    <td className="px-6 py-4">{order.buyer_name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusStyle(order.current_status)}`}>
                        {order.current_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">
                      {formatCurrency(order.final_total)}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-500 text-xs">
                      {new Date(order.created_at).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
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
