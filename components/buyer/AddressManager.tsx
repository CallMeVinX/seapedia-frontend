import React, { useState } from 'react';
import { MapPin, Plus, Trash2, Loader2 } from 'lucide-react';
import { AddressResponse } from '@/services/addressService';
import { EmptyState } from '@/components/ui/EmptyState';

interface AddressManagerProps {
  addresses: AddressResponse[];
  isLoading: boolean;
  isAdding: boolean;
  isDeletingId: number | null;
  onAddAddress: (fullAddress: string) => void;
  onDeleteAddress: (addressId: number) => void;
}

export const AddressManager: React.FC<AddressManagerProps> = ({
  addresses,
  isLoading,
  isAdding,
  isDeletingId,
  onAddAddress,
  onDeleteAddress
}) => {
  const [newAddress, setNewAddress] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.trim()) {
      onAddAddress(newAddress.trim());
      setNewAddress('');
      setIsFormOpen(false);
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
      {/* Add Address Button / Form */}
      {!isFormOpen ? (
        <button
          onClick={() => setIsFormOpen(true)}
          className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50/30 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Tambah Alamat Baru
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-blue-200 p-6">
          <label htmlFor="newAddress" className="block text-sm font-bold text-slate-700 mb-2">
            Alamat Lengkap
          </label>
          <textarea
            id="newAddress"
            value={newAddress}
            onChange={(e) => setNewAddress(e.target.value)}
            rows={3}
            required
            disabled={isAdding}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none mb-4"
            placeholder="Jl. Pelabuhan Ikan No. 12, Muara Baru, Jakarta Utara..."
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => { setIsFormOpen(false); setNewAddress(''); }}
              disabled={isAdding}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isAdding || !newAddress.trim()}
              className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isAdding ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : 'Simpan Alamat'}
            </button>
          </div>
        </form>
      )}

      {/* Address List */}
      {addresses.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Belum Ada Alamat"
          description="Tambahkan alamat pengiriman agar Anda dapat melakukan checkout dengan mudah."
        />
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div key={addr.id} className="bg-white rounded-2xl border border-slate-200 p-5 flex items-start justify-between gap-4 hover:border-blue-200 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">{addr.full_address}</p>
              </div>
              <button
                onClick={() => onDeleteAddress(addr.id)}
                disabled={isDeletingId === addr.id}
                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                title="Hapus alamat"
              >
                {isDeletingId === addr.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
