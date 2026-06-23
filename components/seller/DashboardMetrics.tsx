import React from 'react';
import { Store, TrendingUp, Package, Clock } from 'lucide-react';
import { StoreStatusResponse } from '@/services/sellerService';

interface DashboardMetricsProps {
  storeStatus: StoreStatusResponse | null;
  incomingOrdersCount: number;
}

export const DashboardMetrics: React.FC<DashboardMetricsProps> = ({ 
  storeStatus, 
  incomingOrdersCount 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      {/* Store Info Card */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Store className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Toko Anda</h3>
        </div>
        <div className="flex flex-col mt-3">
          <span className="text-2xl font-black text-slate-900 leading-tight">
            {storeStatus?.store_name || 'Memuat...'}
          </span>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
            <span className="text-xs font-bold text-green-600">Status Aktif</span>
          </div>
        </div>
      </div>

      {/* Incoming Orders Metric */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Clock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Perlu Dikemas</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900">{incomingOrdersCount}</span>
          <span className="text-sm font-medium text-slate-500">Pesanan</span>
        </div>
      </div>

      {/* Mock Sales Metric (Since we don't have this API yet, placeholder) */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <TrendingUp className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Performa</h3>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black text-slate-900">100%</span>
          <span className="text-sm font-medium text-slate-500">Pesanan Selesai</span>
        </div>
      </div>
    </div>
  );
};
