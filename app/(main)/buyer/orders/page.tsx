"use client";

import { useEffect, useState, useMemo } from "react";
import { trackingService, OrderResponse } from "@/services/orderService";
import { useAuthStore } from "@/hooks/useAuthStore";
import Link from "next/link";
import { Package, ChevronRight, Loader2, Search } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "@/components/ui/EmptyState";
import { PaymentModal } from "@/components/order/PaymentModal";
import { showToast } from "@/utils/toast";

const TABS = ["Semua", "Menunggu Pembayaran", "Sedang Dikemas", "Sedang Dikirim", "Pesanan Selesai", "Dibatalkan/Retur"];

export default function BuyerOrdersPage() {
  const { activeRole } = useAuthStore();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Payment Modal State
  const [paymentOrder, setPaymentOrder] = useState<OrderResponse | null>(null);
  const [isPaying, setIsPaying] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeRole?.toUpperCase() !== 'BUYER') return;
      try {
        const data = await trackingService.getBuyerOrders();
        setOrders(data);
      } catch (error) {
        console.error("Failed to load orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [activeRole]);

  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesTab = activeTab === "Semua" || 
                         (activeTab === "Dibatalkan/Retur" ? (order.current_status === "Dibatalkan" || order.current_status === "Dikembalikan") : order.current_status === activeTab);
      const matchesSearch = order.store_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            order.items.some(item => item.product_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesTab && matchesSearch;
    });
  }, [orders, activeTab, searchQuery]);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric"
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Sedang Dikemas': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Menunggu Pengirim': return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'Sedang Dikirim': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Pesanan Selesai': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Dibatalkan': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Pesanan Saya</h1>

        {/* Filters and Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 mb-6 overflow-hidden">
          {/* Search Bar */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Cari pesanan atau nama toko..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors"
              />
            </div>
          </div>
          
          {/* Scrollable Tabs */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex px-2 py-2 min-w-max">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 mx-1 text-sm font-medium rounded-full whitespace-nowrap transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white shadow-sm' 
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <EmptyState 
            icon={Package}
            title={orders.length === 0 ? "Belum ada pesanan" : "Pesanan tidak ditemukan"}
            description={orders.length === 0 ? "Anda belum pernah melakukan pemesanan apapun." : "Coba ubah filter atau kata kunci pencarian."}
          />
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-blue-300 transition-colors">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <div className="flex items-center gap-3">
                    <Package className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-slate-800">Toko: {order.store_name}</span>
                    <span className="text-sm text-slate-500 hidden sm:inline">• {formatDate(order.created_at)}</span>
                  </div>
                  <div className={`px-3 py-1 text-xs font-bold rounded-full border ${getStatusColor(order.current_status)}`}>
                    {order.current_status}
                  </div>
                </div>
                
                <div className="p-6">
                  {order.items.slice(0, 2).map((item, idx) => (
                    <div key={item.id} className={`flex gap-4 ${idx > 0 ? 'mt-4' : ''}`}>
                      <div className="relative w-16 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                        <Image src={item.product_image || "/tech_store.png"} alt={item.product_name} fill sizes="64px" className="object-cover" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{item.product_name}</h4>
                        <p className="text-sm text-slate-500">{item.quantity} barang x {formatCurrency(item.unit_price)}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-slate-500 mt-2 italic">+ {order.items.length - 2} produk lainnya</p>
                  )}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">Total Belanja</p>
                    <p className="font-bold text-blue-950">{formatCurrency(order.final_total)}</p>
                  </div>
                  <div className="flex gap-2">
                    {order.current_status === 'Menunggu Pembayaran' && (
                      <button 
                        onClick={() => setPaymentOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 text-white font-medium rounded-lg hover:bg-amber-600 transition-colors shadow-sm"
                      >
                        Bayar Sekarang
                      </button>
                    )}
                    <Link href={`/buyer/orders/${order.id}`}>
                      <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm">
                        Lihat Detail <ChevronRight className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <PaymentModal 
        isOpen={paymentOrder !== null}
        onClose={() => setPaymentOrder(null)}
        orderTotal={paymentOrder ? Number(paymentOrder.final_total) : 0}
        isLoading={isPaying}
        onConfirm={async () => {
          if (!paymentOrder) return;
          setIsPaying(true);
          try {
            await trackingService.payOrder(paymentOrder.id);
            const data = await trackingService.getBuyerOrders();
            setOrders(data);
            showToast.success("Pembayaran Berhasil", "Pesanan Anda akan segera diproses oleh penjual.");
            setPaymentOrder(null);
          } catch (err: any) {
            const msg = err.response?.data?.detail || "Terjadi kesalahan saat membayar.";
            showToast.error("Pembayaran Gagal", msg);
          } finally {
            setIsPaying(false);
          }
        }}
      />
    </div>
  );
}
