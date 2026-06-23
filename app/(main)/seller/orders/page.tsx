"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useAuthStore } from '@/hooks/useAuthStore';
import { useSellerOrders } from '@/hooks/useSellerOrders';
import { Inbox, Loader2, Search } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';
import { formatCurrency } from '@/utils/formatCurrency';
import dayjs from 'dayjs';
import { useSearchParams, useRouter } from 'next/navigation';

const TABS = [
  { id: 'all', label: 'Semua Pesanan', statusFilter: undefined },
  { id: 'Sedang Dikemas', label: 'Perlu Diproses', statusFilter: 'Sedang Dikemas' },
  { id: 'Menunggu Pengirim', label: 'Siap Dikirim', statusFilter: 'Menunggu Pengirim' },
  { id: 'Sedang Dikirim', label: 'Sedang Dikirim', statusFilter: 'Sedang Dikirim' },
  { id: 'Pesanan Selesai', label: 'Selesai', statusFilter: 'Pesanan Selesai' },
  { id: 'Dikembalikan', label: 'Dibatalkan/Retur', statusFilter: 'Dikembalikan' },
];

function SellerOrdersContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultTab = searchParams?.get('tab') || 'all';
  
  const [activeTab, setActiveTab] = useState(defaultTab);
  const { } = useAuthStore();
  
  const currentTabConfig = TABS.find(t => t.id === activeTab) || TABS[0];
  
  const {
    orders,
    isLoading,
    processingId,
    processOrder,
    refreshOrders
  } = useSellerOrders(currentTabConfig.statusFilter);

  useEffect(() => {
    const tabFromUrl = searchParams?.get('tab');
    if (tabFromUrl && tabFromUrl !== activeTab) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    router.push(`/seller/orders?tab=${tabId}`);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Pesanan</h1>
          <p className="text-slate-500 text-sm mt-1">Pantau dan proses pesanan dari pelanggan Anda.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl border border-slate-200 p-1.5 flex overflow-x-auto custom-scrollbar shadow-sm">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabChange(tab.id)}
            className={`px-4 py-2 text-sm font-bold rounded-lg whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-blue-700 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center shadow-sm">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Tidak Ada Pesanan"
          description={`Belum ada pesanan untuk kategori "${currentTabConfig.label}".`}
        />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {/* Mobile Card Layout */}
          <div className="lg:hidden divide-y divide-slate-100">
            {orders.map((order) => {
              const isPackaged = order.current_status === 'Sedang Dikemas';
              const isThisRowProcessing = processingId === order.id;
              
              return (
                <div key={order.id} className="p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-bold text-slate-900">#{order.id}</div>
                      <div className="text-xs text-slate-500 mt-0.5">{dayjs(order.created_at).format('DD MMM YYYY HH:mm')}</div>
                    </div>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                          order.current_status === 'Sedang Dikemas' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          order.current_status === 'Menunggu Pengirim' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          order.current_status === 'Sedang Dikirim' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.current_status === 'Pesanan Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                          (order.current_status === 'Dikembalikan' || order.current_status === 'Dibatalkan') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                    }`}>
                      {order.current_status}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between pt-1 text-sm border-t border-slate-50">
                    <span className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total</span>
                    <span className="font-black text-blue-950 text-base">{formatCurrency(Number(order.final_total))}</span>
                  </div>

                  <div className="pt-2">
                    {isPackaged ? (
                      <button
                        onClick={() => processOrder(order.id)}
                        disabled={processingId !== null}
                        className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
                      >
                        {isThisRowProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        Proses Pesanan
                      </button>
                    ) : (
                       <div className="w-full py-2.5 bg-slate-50 text-slate-400 text-center text-xs font-bold rounded-xl italic">Tidak ada aksi</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table Layout */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
                  <th className="px-6 py-4">ID Pesanan</th>
                  <th className="px-6 py-4">Tanggal</th>
                  <th className="px-6 py-4">Total Belanja</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {orders.map((order) => {
                  const isPackaged = order.current_status === 'Sedang Dikemas';
                  const isThisRowProcessing = processingId === order.id;
                  
                  return (
                    <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">
                        #{order.id}
                      </td>
                      <td className="px-6 py-4 text-slate-500">
                        {dayjs(order.created_at).format('DD MMM YYYY HH:mm')}
                      </td>
                      <td className="px-6 py-4 font-bold text-blue-950">
                        {formatCurrency(Number(order.final_total))}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border ${
                          order.current_status === 'Sedang Dikemas' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          order.current_status === 'Menunggu Pengirim' ? 'bg-indigo-50 text-indigo-700 border-indigo-200' :
                          order.current_status === 'Sedang Dikirim' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          order.current_status === 'Pesanan Selesai' ? 'bg-green-50 text-green-700 border-green-200' :
                          (order.current_status === 'Dikembalikan' || order.current_status === 'Dibatalkan') ? 'bg-rose-50 text-rose-700 border-rose-200' :
                          'bg-slate-50 text-slate-700 border-slate-200'
                        }`}>
                          {order.current_status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {isPackaged && (
                          <button
                            onClick={() => processOrder(order.id)}
                            disabled={processingId !== null}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 ml-auto shadow-sm"
                          >
                            {isThisRowProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                            Proses Pesanan
                          </button>
                        )}
                        {!isPackaged && (
                           <span className="text-sm text-slate-400 italic">Tidak ada aksi</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SellerOrdersPage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center py-20">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    }>
      <SellerOrdersContent />
    </Suspense>
  );
}
