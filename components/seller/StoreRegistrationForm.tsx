import React, { useState } from 'react';
import { Store, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

interface StoreRegistrationFormProps {
  onSubmit: (storeName: string) => void;
  isLoading: boolean;
}

export const StoreRegistrationForm: React.FC<StoreRegistrationFormProps> = ({
  onSubmit,
  isLoading
}) => {
  const [storeName, setStoreName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(storeName);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200 shadow-xl shadow-slate-200/50">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
            <Store className="w-10 h-10 text-blue-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-2">Buka Toko Anda</h2>
          <p className="text-center text-slate-500 text-sm">
            Mulai berjualan produk kelautan terbaik ke seluruh Indonesia. Gratis dan mudah.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="storeName" className="block text-sm font-bold text-slate-700 mb-2">
              Nama Toko
            </label>
            <input
              id="storeName"
              type="text"
              required
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Contoh: Maju Jaya Seafood"
              disabled={isLoading}
            />
          </div>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-full py-3.5 rounded-xl text-base"
            disabled={isLoading || !storeName.trim()}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" /> Sedang Mendaftarkan...
              </span>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};
