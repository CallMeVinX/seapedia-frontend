import React from 'react';
import { Wallet, X, Loader2, ShieldCheck } from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  orderTotal: number;
  isLoading?: boolean;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  orderTotal,
  isLoading = false
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={isLoading ? undefined : onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm mx-4 p-6 animate-in fade-in zoom-in-95 duration-200">
        <button 
          onClick={onClose} 
          disabled={isLoading}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 relative">
            <Wallet className="w-8 h-8" />
            <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
          </div>
          <h2 className="text-xl font-black text-slate-900 mb-2">Konfirmasi Pembayaran</h2>
          <p className="text-slate-500 text-sm mb-4 leading-relaxed">
            Anda akan melakukan pembayaran untuk pesanan ini menggunakan E-Wallet SEAPEDIA Anda.
          </p>

          <div className="w-full bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total Pembayaran</p>
            <p className="text-2xl font-black text-blue-950">{formatCurrency(orderTotal)}</p>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              Bayar Sekarang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
