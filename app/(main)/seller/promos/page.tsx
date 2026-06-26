"use client";

import React from 'react';
import { useSellerPromos } from '@/hooks/useSellerPromos';
import Modal from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Loader2,
  Plus,
  Trash2,
  Tag,
  Calendar,
  AlertCircle,
  Pencil,
} from 'lucide-react';
import { formatCurrency } from '@/utils/formatCurrency';

/**
 * 💎 Presentational Agent: Seller Promos Page
 */
export default function SellerPromosPage() {
  const {
    promos,
    products,
    isLoading,
    isModalOpen,
    isSaving,
    form,
    formErrors,
    updateField,
    openCreateModal,
    openEditModal,
    closeModal,
    editingId,
    isDeleting,
    deletingId,
    setDeletingId,
    handleSave,
    handleDelete,
  } = useSellerPromos();

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  const handleProductToggle = (productId: number) => {
    const current = form.product_ids;
    if (current.includes(productId)) {
      updateField('product_ids', current.filter((id) => id !== productId));
    } else {
      updateField('product_ids', [...current, productId]);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Kelola Promo</h1>
          <p className="text-slate-500 text-sm mt-1">
            Berikan diskon khusus untuk produk-produk terbaik Anda.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Buat Promo Baru
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        ) : promos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Tag className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold mb-1">
              Belum ada Promo
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Tingkatkan penjualan dengan diskon coret.
            </p>
            <button
              onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Buat Sekarang
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <tr>
                  <th className="px-6 py-4">Nama Promo</th>
                  <th className="px-6 py-4">Diskon</th>
                  <th className="px-6 py-4">Produk</th>
                  <th className="px-6 py-4">Periode</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {promos.map((item) => {
                  const expired = isExpired(item.valid_until);
                  const active = item.is_active && !expired;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {item.name}
                      </td>
                      <td className="px-6 py-4 font-bold text-rose-600">
                        {item.discount_percentage}%
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold bg-blue-50 text-blue-700 rounded-md">
                          {item.product_ids.length} Produk
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1 text-xs">
                          <span className="flex items-center gap-1.5">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            {new Date(item.valid_from).toLocaleDateString('id-ID')}
                          </span>
                          <span className="flex items-center gap-1.5">
                            <span className="w-3.5 text-center text-slate-300">s/d</span>
                            {new Date(item.valid_until).toLocaleDateString('id-ID')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {active ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md uppercase">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md uppercase">
                            Nonaktif
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit Promo"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hentikan Promo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? "Edit Promo" : "Buat Promo Baru"}
        footer={
          <div className="flex gap-3">
            <button
              onClick={closeModal}
              disabled={isSaving}
              className="px-4 py-2 text-sm font-medium border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-6 py-2 text-sm font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              Simpan Promo
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Nama Promo</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Contoh: Flash Sale Akhir Bulan"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
            />
            {formErrors.name && (
              <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{formErrors.name}</span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-700">Diskon (%)</label>
            <input
              type="number"
              value={form.discount_percentage}
              onChange={(e) => updateField('discount_percentage', e.target.value)}
              placeholder="0 - 100"
              min="1"
              max="100"
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
            />
            {formErrors.discount_percentage && (
              <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{formErrors.discount_percentage}</span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Mulai Dari</label>
              <input
                type="datetime-local"
                value={form.valid_from}
                onChange={(e) => updateField('valid_from', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              />
              {formErrors.valid_from && (
                <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{formErrors.valid_from}</span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-gray-700">Berakhir Pada</label>
              <input
                type="datetime-local"
                value={form.valid_until}
                onChange={(e) => updateField('valid_until', e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-blue-500 focus:ring-blue-500"
              />
              {formErrors.valid_until && (
                <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{formErrors.valid_until}</span>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Pilih Produk</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100">
              {products.length === 0 ? (
                <div className="p-4 text-center text-sm text-gray-500">
                  Anda belum memiliki produk.
                </div>
              ) : (
                products.map((p) => (
                  <label key={p.id} className="flex items-center gap-3 p-3 hover:bg-slate-50 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={form.product_ids.includes(p.id)}
                      onChange={() => handleProductToggle(p.id)}
                      className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{formatCurrency(p.price)}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {formErrors.product_ids && (
              <span className="flex items-center gap-1 text-xs text-red-500"><AlertCircle className="w-3 h-3" />{formErrors.product_ids}</span>
            )}
          </div>
        </div>
      </Modal>

      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Hentikan Promo?"
        message="Promo akan dihentikan dan dihapus dari semua produk terkait. Lanjutkan?"
        isLoading={isDeleting}
      />
    </div>
  );
}
