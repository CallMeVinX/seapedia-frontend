"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { trackingService, OrderResponse } from "@/services/orderService";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useOrderTracking } from "@/hooks/useOrderTracking";
import { TrackingTimeline } from "@/components/order/TrackingTimeline";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { PaymentModal } from "@/components/order/PaymentModal";
import { showToast } from "@/utils/toast";
import { ArrowLeft, Store, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const { id } = useParams();
  const { user } = useAuthStore();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(true);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  
  const { trackingSteps, isLoading: loadingTracking, refreshTracking } = useOrderTracking(id as string);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const data = await trackingService.getBuyerOrder(id as string);
      setOrder(data);
    } catch (error) {
      console.error("Failed to load order details", error);
    } finally {
      setLoadingOrder(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const handleCancelOrder = async () => {
    if (!order) return;
    setCanceling(true);
    try {
      await trackingService.cancelBuyerOrder(order.id);
      setShowCancelConfirm(false);
      // reload order to get the new Dibatalkan status
      await fetchOrder();
      await refreshTracking();
    } catch (error) {
      console.error("Failed to cancel order", error);
    } finally {
      setCanceling(false);
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  if (loadingOrder) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen p-8 text-center">
        <p className="text-slate-500">Pesanan tidak ditemukan.</p>
        <Link href="/buyer/orders" className="text-blue-600 font-medium hover:underline mt-4 inline-block">
          Kembali ke Daftar Pesanan
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/buyer/orders" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Detail Pesanan</h1>
          <div className="ml-auto px-4 py-1.5 bg-blue-100 text-blue-800 text-sm font-bold rounded-full">
            {order.current_status}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <TrackingTimeline trackingSteps={trackingSteps} isLoading={loadingTracking} />
            
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50">
                <Store className="w-5 h-5 text-slate-500" />
                <span className="font-bold text-slate-800">{order.store_name}</span>
              </div>
              <div className="p-6 space-y-6">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-lg overflow-hidden border border-slate-200">
                      <Image src={item.product_image || "/tech_store.png"} alt={item.product_name} fill sizes="64px" className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 mb-1">{item.product_name}</h4>
                      <p className="text-sm text-slate-500 mb-2">{item.quantity} barang</p>
                      <p className="font-bold text-blue-950">{formatCurrency(item.unit_price)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <OrderSummaryCard
              title="Rincian Pembayaran"
              totalItems={order.items.length}
              subtotal={order.subtotal}
              deliveryFee={order.delivery_fee}
              ppn={order.ppn_amount}
              promoDiscount={order.promo_discount_amount}
              voucherDiscount={order.voucher_discount_amount}
              grandTotal={order.final_total}
              isSticky={false}
            />

            {order.current_status === 'Menunggu Pembayaran' && (
              <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-6 text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Pesanan ini belum dibayar. Silakan lakukan pembayaran menggunakan saldo dompet Anda.
                </p>
                <button 
                  onClick={() => setShowPaymentModal(true)}
                  className="w-full px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white text-sm font-bold rounded-xl transition-colors shadow-sm"
                >
                  Bayar Sekarang
                </button>
              </div>
            )}

            {(order.current_status === 'Sedang Dikemas' || order.current_status === 'Menunggu Pembayaran') && (
              <div className="bg-white rounded-2xl border border-rose-200 shadow-sm p-6 text-center space-y-4">
                <p className="text-sm text-slate-600">
                  Pesanan ini belum diproses oleh penjual. Anda masih dapat membatalkan pesanan ini.
                </p>
                {showCancelConfirm ? (
                  <div className="space-y-3">
                    <p className="text-sm font-bold text-rose-600">Yakin ingin membatalkan?</p>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => setShowCancelConfirm(false)}
                        disabled={canceling}
                        className="flex-1 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold rounded-lg transition-colors"
                      >
                        Tidak
                      </button>
                      <button 
                        onClick={handleCancelOrder}
                        disabled={canceling}
                        className="flex-1 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {canceling && <Loader2 className="w-4 h-4 animate-spin" />}
                        Ya, Batalkan
                      </button>
                    </div>
                  </div>
                ) : (
                  <button 
                    onClick={() => setShowCancelConfirm(true)}
                    className="w-full px-4 py-3 border-2 border-rose-600 text-rose-600 hover:bg-rose-50 text-sm font-bold rounded-xl transition-colors"
                  >
                    Batalkan Pesanan
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        <PaymentModal 
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          orderTotal={order ? Number(order.final_total) : 0}
          isLoading={isPaying}
          onConfirm={async () => {
            if (!order) return;
            setIsPaying(true);
            try {
              await trackingService.payOrder(order.id);
              await fetchOrder();
              await refreshTracking();
              showToast.success("Pembayaran Berhasil", "Pesanan Anda akan segera diproses oleh penjual.");
              setShowPaymentModal(false);
            } catch (err: any) {
              const msg = err.response?.data?.detail || "Terjadi kesalahan saat membayar.";
              showToast.error("Pembayaran Gagal", msg);
            } finally {
              setIsPaying(false);
            }
          }}
        />
      </div>
    </div>
  );
}
