import React from 'react';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

interface CartItemData {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  quantity: number;
  unit_price: number;
}

interface CartItemRowProps {
  item: CartItemData;
  storeId: number;
  isSelected: boolean;
  isUpdating: boolean;
  onToggleItem: (itemId: number, storeId: number) => void;
  onUpdateQuantity: (productId: number, delta: number, currentQty: number) => void;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  storeId,
  isSelected,
  isUpdating,
  onToggleItem,
  onUpdateQuantity
}) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  return (
    <div className={`p-4 sm:p-5 flex gap-4 sm:gap-5 transition-colors ${isSelected ? 'bg-blue-50/10' : 'hover:bg-slate-50/50'}`}>
      {/* Item Checkbox */}
      <button 
        onClick={() => onToggleItem(item.id, storeId)}
        className={`relative w-5 h-5 sm:w-6 sm:h-6 mt-8 sm:mt-10 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none shrink-0 ${
          isSelected 
            ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/20' 
            : 'bg-white border-slate-300 hover:border-blue-400'
        } cursor-pointer`}
      >
        {isSelected && (
          <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 shadow-sm">
        <Image
          src={item.product_image || "/tech_store.png"}
          alt={item.product_name}
          fill
          unoptimized
          className="object-cover"
        />
      </div>

      {/* Product Info */}
      <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
        <div>
          <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mb-1.5 line-clamp-2">
            {item.product_name}
          </h3>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-2 mt-2">
          <div>
            <div className="text-lg sm:text-xl font-black text-blue-950 tracking-tight">
              {formatCurrency(item.unit_price)}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
              <button 
                onClick={() => onUpdateQuantity(item.product_id, -1, item.quantity)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                -
              </button>
              <div className="px-3 py-1.5 text-xs font-bold text-slate-700 min-w-[2.5rem] text-center bg-slate-50 border-x border-slate-200">
                {isUpdating ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
              </div>
              <button 
                onClick={() => onUpdateQuantity(item.product_id, 1, item.quantity)}
                disabled={isUpdating}
                className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
