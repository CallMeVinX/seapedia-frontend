import React, { useState } from 'react';
import { Wallet, Loader2, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import { WalletResponse } from '@/services/walletService';

interface WalletCardProps {
  wallet: WalletResponse | null;
  isLoading: boolean;
  isTopingUp: boolean;
  onTopUp: (amount: number) => void;
}

const QUICK_AMOUNTS = [50000, 100000, 200000, 500000];

export const WalletCard: React.FC<WalletCardProps> = ({
  wallet,
  isLoading,
  isTopingUp,
  onTopUp
}) => {
  const [customAmount, setCustomAmount] = useState('');

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(customAmount);
    if (amount > 0) {
      onTopUp(amount);
      setCustomAmount('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-white to-blue-50 rounded-3xl p-8 border border-blue-100 shadow-[0_4px_20px_-4px_rgba(59,130,246,0.1)] relative overflow-hidden flex flex-col justify-center min-h-[160px]">
        {/* Subtle decorative icon */}
        <div className="absolute -right-6 -bottom-6 opacity-[0.03]">
          <Wallet className="w-40 h-40 text-blue-900" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-white shadow-sm rounded-xl text-blue-600 border border-slate-100">
                <Wallet className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Saldo Dompet</h3>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur text-xs font-bold text-green-600 border border-green-100 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)] animate-pulse"></span>
              Siap Digunakan
            </div>
          </div>
          
          <div className="mt-6">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              {formatCurrency(wallet?.balance || 0)}
            </h2>
          </div>
        </div>
      </div>

      {/* Top-up Section */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-bold text-slate-900 mb-4">Top-up Saldo</h3>

        {/* Quick Amount Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {QUICK_AMOUNTS.map((amount) => (
            <button
              key={amount}
              onClick={() => onTopUp(amount)}
              disabled={isTopingUp}
              className="py-3 px-4 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {formatCurrency(amount)}
            </button>
          ))}
        </div>

        {/* Custom Amount */}
        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            type="number"
            min="1000"
            max="10000000"
            value={customAmount}
            onChange={(e) => setCustomAmount(e.target.value)}
            placeholder="Jumlah lainnya..."
            disabled={isTopingUp}
            className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={isTopingUp || !customAmount || parseFloat(customAmount) <= 0}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isTopingUp ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Top-up'}
          </button>
        </form>
      </div>

      {/* Transaction History */}
      {wallet && wallet.transactions.length > 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Riwayat Transaksi</h3>
          </div>
          <div className="divide-y divide-slate-100">
            {wallet.transactions.map((txn) => {
              const isIncome = txn.transaction_type === 'TopUp' || txn.transaction_type === 'Refund';
              const absoluteAmount = Math.abs(txn.amount);
              
              return (
                <div key={txn.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${isIncome ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                      {isIncome ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-800">{txn.description || txn.transaction_type}</div>
                      <div className="text-xs text-slate-500">{formatDate(txn.created_at)}</div>
                    </div>
                  </div>
                  <div className={`font-bold ${isIncome ? 'text-green-700' : 'text-red-700'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(absoluteAmount)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
