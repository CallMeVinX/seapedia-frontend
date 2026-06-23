import React from 'react';
import { Package, MapPin, Loader2 } from 'lucide-react';
import { OrderResponse } from '@/services/orderService';
import Image from 'next/image';

interface IncomingOrdersTableProps {
  orders: OrderResponse[];
  isLoading: boolean;
}

export const IncomingOrdersTable: React.FC<IncomingOrdersTableProps> = ({ orders, isLoading }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center flex flex-col items-center">
        <div className="w-16 h-16 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mb-4">
          <Package className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 mb-1">Belum Ada Pesanan Masuk</h3>
        <p className="text-sm text-slate-500">Pesanan baru dengan status "Sedang Dikemas" akan muncul di sini.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <h3 className="font-bold text-slate-900 flex items-center gap-2">
          <Package className="w-5 h-5 text-blue-600" />
          Daftar Pesanan (Sedang Dikemas)
        </h3>
        <span className="bg-blue-100 text-blue-700 py-1 px-3 rounded-full text-xs font-bold">
          {orders.length} Pesanan
        </span>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="px-6 py-4">ID Pesanan & Waktu</th>
              <th className="px-6 py-4">Barang</th>
              <th className="px-6 py-4 text-right">Total Tagihan</th>
              <th className="px-6 py-4 text-center">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900 mb-1">#{order.id}</div>
                  <div className="text-xs text-slate-500">{formatDate(order.created_at)}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 bg-slate-100 rounded overflow-hidden shadow-sm">
                      {order.items[0]?.product_image && (
                        <Image src={order.items[0].product_image} alt="Product" fill sizes="40px" className="object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800 line-clamp-1 max-w-[200px]">
                        {order.items[0]?.product_name}
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {order.items.length > 1 
                          ? `${order.items[0].quantity}x, +${order.items.length - 1} lainnya` 
                          : `${order.items[0].quantity}x`}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-right font-bold text-blue-950">
                  {formatCurrency(order.final_total)}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold rounded-full">
                    {order.current_status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
