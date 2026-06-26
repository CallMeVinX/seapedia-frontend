import React, { ReactNode } from 'react';
import { Store } from 'lucide-react';

interface CartStoreGroupProps {
  storeId: number;
  storeName: string;
  isAllSelected: boolean;
  isIndeterminate: boolean;
  onToggleStore: (storeId: number) => void;
  isDisabled?: boolean;
  children: ReactNode;
}

export const CartStoreGroup: React.FC<CartStoreGroupProps> = ({
  storeId,
  storeName,
  isAllSelected,
  isIndeterminate,
  onToggleStore,
  isDisabled = false,
  children
}) => {
  return (
    <div className={`bg-white rounded-2xl border ${isAllSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'} shadow-sm overflow-hidden transition-all duration-300 ${isDisabled ? 'opacity-50 grayscale-[50%]' : ''}`}>
      <div className={`px-5 py-3.5 flex items-center gap-3 border-b border-slate-100 ${isAllSelected ? 'bg-blue-50/50' : 'bg-slate-50/50'}`}>
        <button 
          onClick={() => !isDisabled && onToggleStore(storeId)}
          disabled={isDisabled}
          className={`relative w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none ${
            isAllSelected 
              ? 'bg-blue-600 border-blue-600' 
              : isIndeterminate
                ? 'bg-blue-600 border-blue-600'
                : isDisabled
                  ? 'bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'bg-white border-slate-300 hover:border-blue-400 cursor-pointer'
          }`}
        >
          {isAllSelected && (
            <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
          {isIndeterminate && (
            <div className="w-3 h-0.5 bg-white rounded-full"></div>
          )}
        </button>
        
        <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center ml-2 shadow-sm">
          <Store className="w-4 h-4 text-white" />
        </div>
        <span className="text-sm font-bold text-slate-800 tracking-tight">{storeName}</span>
      </div>

      <div className="divide-y divide-slate-100">
        {children}
      </div>
    </div>
  );
};
