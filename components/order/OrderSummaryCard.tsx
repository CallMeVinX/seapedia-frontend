import React, { ReactNode } from 'react';
import { Info } from 'lucide-react';

interface OrderSummaryCardProps {
  title?: string;
  totalItems: number;
  subtotal: number;
  deliveryFee?: number;
  ppn: number;
  promoDiscount?: number;
  voucherDiscount?: number;
  grandTotal: number;
  buttonText?: string;
  onButtonClick?: () => void;
  isLoading?: boolean;
  isDisabled?: boolean;
  buttonIcon?: ReactNode;
  infoMessage?: string;
  isSticky?: boolean;
}

export const OrderSummaryCard: React.FC<OrderSummaryCardProps> = ({
  title = "Ringkasan Belanja",
  totalItems,
  subtotal,
  deliveryFee = 0,
  ppn,
  promoDiscount = 0,
  voucherDiscount = 0,
  grandTotal,
  buttonText,
  onButtonClick,
  isLoading = false,
  isDisabled = false,
  buttonIcon,
  infoMessage,
  isSticky = true
}) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  return (
    <div className={`bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg shadow-slate-200/40 ${isSticky ? 'sticky top-24' : ''}`}>
      <h3 className="text-lg font-bold text-slate-900 mb-6">{title}</h3>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">
            Total Harga ({totalItems} barang)
          </span>
          <span className="font-bold text-slate-900">
            {formatCurrency(subtotal)}
          </span>
        </div>
        
        {promoDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Diskon Promo</span>
            <span className="font-bold text-green-600">
              -{formatCurrency(promoDiscount)}
            </span>
          </div>
        )}

        {voucherDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600 font-medium">Diskon Voucher</span>
            <span className="font-bold text-green-600">
              -{formatCurrency(voucherDiscount)}
            </span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">Ongkos Kirim</span>
          <span className="font-bold text-slate-900">
            {deliveryFee === -1 ? 'Menyesuaikan' : formatCurrency(deliveryFee)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-slate-500 font-medium">PPN 12%</span>
          <span className="font-bold text-slate-900">
            {formatCurrency(ppn)}
          </span>
        </div>
      </div>

      <hr className="border-slate-100 mb-6" />

      <div className="flex justify-between items-center mb-8">
        <span className="text-base font-bold text-slate-900">Total Tagihan</span>
        <span className="text-2xl font-black text-blue-900 tracking-tight">
          {formatCurrency(grandTotal)}
        </span>
      </div>

      {infoMessage && (
        <div className="bg-slate-50 rounded-xl p-4 flex gap-3 mb-6 border border-slate-100">
          <Info className="w-5 h-5 text-slate-400 shrink-0" />
          <p className="text-xs font-medium text-slate-500 leading-relaxed">
            {infoMessage}
          </p>
        </div>
      )}

      {buttonText && onButtonClick && (
        <button
          onClick={onButtonClick}
          disabled={isDisabled || isLoading}
          className="w-full py-4 text-base font-bold shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              {buttonText}
              {buttonIcon}
            </>
          )}
        </button>
      )}
    </div>
  );
};
