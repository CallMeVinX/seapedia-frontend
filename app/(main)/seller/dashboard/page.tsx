"use client";

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { Loader2, Package, Truck, AlertTriangle, AlertCircle, ShoppingBag } from 'lucide-react';
import api from '@/services/api';
import { formatCurrency } from '@/utils/formatCurrency';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

interface DashboardStats {
  total_sales: number;
  action_center: {
    perlu_diproses: number;
    siap_dikirim: number;
    stok_kritis: number;
  };
  chart_data: {
    date: string;
    revenue: number;
  }[];
  low_stock_products: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }[];
  orders_queue: {
    id: string;
    status: string;
    total: number;
  }[];
}

export default function SellerDashboardPage() {
  const { activeRole } = useAuthStore();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      if (activeRole?.toUpperCase() !== 'SELLER') return;
      try {
        const response = await api.get('/seller/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Failed to load seller dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [activeRole]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg shadow-xl border border-slate-800 text-sm">
          <p className="font-bold mb-1">{label}</p>
          <p className="text-blue-400">
            {formatCurrency(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Seller Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">Ringkasan performa dan operasional toko Anda.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-slate-500 mb-1">Total Pendapatan</p>
          <h2 className="text-3xl font-black text-emerald-600">
            {formatCurrency(stats?.total_sales || 0)}
          </h2>
        </div>
      </div>

      {/* Zona 1: Action Center */}
      <div>
        <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-amber-500" />
          Penting Hari Ini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/seller/orders?tab=Sedang Dikemas" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">Perlu Diproses</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.action_center.perlu_diproses || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
              <Package className="w-6 h-6" />
            </div>
          </Link>
          
          <Link href="/seller/orders?tab=Menunggu Pengirim" className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-indigo-600 transition-colors">Siap Dikirim</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.action_center.siap_dikirim || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
              <Truck className="w-6 h-6" />
            </div>
          </Link>

          <Link href="/seller/products" className="bg-white p-5 rounded-2xl border border-rose-100 shadow-sm hover:border-rose-300 hover:shadow-md transition-all group cursor-pointer flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 group-hover:text-rose-600 transition-colors">Stok Menipis ({"<="}5)</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{stats?.action_center.stok_kritis || 0}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-6 h-6" />
            </div>
          </Link>
        </div>
      </div>

      {/* Zona 2: Grafik & Stok Kritis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Penjualan */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-500" />
            Tren Pendapatan (7 Hari Terakhir)
          </h3>
          <div className="h-[300px] w-full">
            {stats?.chart_data && stats.chart_data.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.chart_data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    dy={10}
                    tickFormatter={(val) => {
                      const d = new Date(val);
                      return `${d.getDate()}/${d.getMonth()+1}`;
                    }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#64748b', fontSize: 12 }}
                    tickFormatter={(val) => `Rp${(val/1000)}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, fill: '#2563eb', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                Belum ada data pendapatan 7 hari terakhir
              </div>
            )}
          </div>
        </div>

        {/* Produk Perlu Perhatian */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="text-base font-bold text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-rose-500" />
            Produk Perlu Perhatian
          </h3>
          <div className="flex-1">
            {!stats?.low_stock_products || stats.low_stock_products.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-slate-500 space-y-3 py-10">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm">Semua stok produk aman.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.low_stock_products.map((p) => (
                  <div key={p.id} className="flex items-center justify-between p-3 rounded-xl border border-rose-100 bg-rose-50/30">
                    <div className="flex-1 min-w-0 pr-3">
                      <p className="text-sm font-bold text-slate-900 truncate">{p.name}</p>
                      <p className="text-xs font-medium text-rose-600 mt-0.5">Sisa stok: {p.stock}</p>
                    </div>
                    <Link href="/seller/products" className="px-3 py-1.5 bg-white text-rose-600 text-xs font-bold border border-rose-200 rounded-lg shadow-sm hover:bg-rose-50 transition-colors shrink-0">
                      Restock
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Zona 3: Riwayat Transaksi */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-base font-bold text-slate-900">Riwayat Pesanan Terakhir</h3>
          <Link href="/seller/orders?tab=all" className="text-sm font-bold text-blue-600 hover:text-blue-700">Lihat Semua</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Nilai Transaksi</th>
                <th className="px-6 py-4">Potongan PPN (12%)</th>
                <th className="px-6 py-4 text-right">Pendapatan Bersih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {!stats?.orders_queue || stats.orders_queue.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center">
                        <ShoppingBag className="w-6 h-6 text-slate-300" />
                      </div>
                      <p>Belum ada riwayat transaksi.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                stats.orders_queue.map((order) => {
                  const gross = order.total;
                  const ppn = gross * 0.12;
                  const netRevenue = gross - ppn;
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">#{order.id}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          order.status === 'Pesanan Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                          order.status === 'Dikembalikan' ? 'bg-slate-100 text-slate-700 border-slate-300' :
                          order.status === 'Dibatalkan' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-blue-50 text-blue-700 border-blue-200'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-medium">{formatCurrency(gross)}</td>
                      <td className="px-6 py-4 text-rose-600 font-medium">-{formatCurrency(ppn)}</td>
                      <td className="px-6 py-4 text-right font-black text-emerald-600">{formatCurrency(netRevenue)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
