"use client";

import React from 'react';
import { useAdminDiscounts } from '@/hooks/useAdminDiscounts';
import { formatCurrency } from '@/utils/formatCurrency';
import Modal from '@/components/ui/Modal';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  Ticket,
  ToggleLeft,
  ToggleRight,
  AlertCircle,
  Calendar,
  Tag,
} from 'lucide-react';

/**
 * 💎 Presentational Agent: Voucher Page
 * 
 * Halaman CRUD untuk mengelola Voucher.
 * Menampilkan:
 * 1. Data Table dengan status, usage, expiry
 * 2. Create/Edit Modal dengan form validation
 * 3. Delete Confirmation Modal
 * 
 * RULE: Tidak boleh import Service Agent langsung.
 *       Semua data dan action dari useAdminDiscounts hook.
 */

export default function AdminVouchersPage() {
  const {
    // List
    discounts,
    isLoading,
    // Form
    isModalOpen,
    isSaving,
    editingId,
    form,
    formErrors,
    updateField,
    openCreateModal,
    openEditModal,
    closeModal,
    // Delete
    isDeleting,
    deletingId,
    setDeletingId,
    // Actions
    handleSave,
    handleDelete,
    handleToggleActive,
  } = useAdminDiscounts();

  const isExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-8 pb-10">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Voucher</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola voucher diskon untuk pelanggan SEAPEDIA.
          </p>
        </div>
        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-sm transition-all hover:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Buat Voucher Baru
        </button>
      </div>

      {/* ── Data Table ── */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 text-rose-500 animate-spin" />
          </div>
        ) : discounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
              <Ticket className="w-8 h-8 text-slate-300" />
            </div>
            <p className="text-slate-900 font-bold mb-1">
              Belum ada Voucher
            </p>
            <p className="text-sm text-slate-500 mb-4">
              Buat voucher pertama untuk memulai.
            </p>
            <button
              onClick={() => openCreateModal()}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
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
                  <th className="px-6 py-4">Kode</th>
                  <th className="px-6 py-4">Nilai Diskon</th>
                  <th className="px-6 py-4">Min. Order</th>
                  <th className="px-6 py-4">Kuota</th>
                  <th className="px-6 py-4">Kedaluwarsa</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {discounts.map((item) => {
                  const expired = isExpired(item.expiry_date);
                  const usageText = item.max_usage !== null
                    ? `${item.current_usage} / ${item.max_usage}`
                    : `${item.current_usage} / ∞`;
                  const usagePercent = item.max_usage !== null
                    ? (item.current_usage / item.max_usage) * 100
                    : 0;

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                      {/* Kode */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-rose-50 text-rose-600 rounded-lg flex items-center justify-center">
                            <Tag className="w-4 h-4" />
                          </div>
                          <span className="font-mono font-black text-slate-900 text-sm tracking-wide">
                            {item.code}
                          </span>
                        </div>
                      </td>

                      {/* Nilai Diskon */}
                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-900">
                          {item.discount_type === 'percentage'
                            ? `${item.discount_value}%`
                            : formatCurrency(item.discount_value)
                          }
                        </span>
                        <span className="text-xs text-slate-400 ml-1">
                          {item.discount_type === 'percentage' ? 'persen' : 'potongan'}
                        </span>
                      </td>

                      {/* Min Order */}
                      <td className="px-6 py-4 text-slate-600">
                        {item.min_order_value > 0
                          ? formatCurrency(item.min_order_value)
                          : <span className="text-slate-400">-</span>
                        }
                      </td>

                      {/* Kuota */}
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <span className="text-sm font-medium">{usageText}</span>
                          {item.max_usage !== null && (
                            <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${
                                  usagePercent >= 80 ? 'bg-rose-500' :
                                  usagePercent >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                                }`}
                                style={{ width: `${Math.min(usagePercent, 100)}%` }}
                              />
                            </div>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className={`w-3.5 h-3.5 ${expired ? 'text-rose-400' : 'text-slate-400'}`} />
                          <span className={`text-sm ${expired ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                            {new Date(item.expiry_date).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })}
                          </span>
                          {expired && (
                            <span className="px-1.5 py-0.5 bg-rose-100 text-rose-600 text-[10px] font-bold rounded-md uppercase">
                              Expired
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 text-center">
                        {item.is_active ? (
                          <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold rounded-md uppercase">
                            Aktif
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-xs font-bold rounded-md uppercase">
                            Tidak Aktif
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openEditModal(item)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingId(item.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                            title="Hapus"
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

      {/* ── Create/Edit Modal ── */}
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={editingId ? 'Edit Voucher' : `Buat Voucher Baru`}
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
              className="px-6 py-2 text-sm font-bold bg-rose-600 text-white rounded-lg hover:bg-rose-500 transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {editingId ? 'Simpan Perubahan' : 'Buat Voucher'}
            </button>
          </div>
        }
      >
        <div className="space-y-5">
          {/* Kode Diskon */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="discount-code" className="text-sm font-medium text-gray-700">
              Kode Voucher
            </label>
            <input
              id="discount-code"
              type="text"
              value={form.code}
              onChange={(e) => updateField('code', e.target.value.toUpperCase())}
              placeholder="Contoh: HEMAT20"
              maxLength={20}
              required
              minLength={3}
              className={`w-full rounded-lg border px-4 py-2.5 text-sm font-mono uppercase tracking-wider transition-colors focus:outline-none focus:ring-1 ${
                formErrors.code
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
              }`}
            />
            {formErrors.code && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                {formErrors.code}
              </span>
            )}
          </div>

          {/* Tipe Diskon + Nilai */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="discount-type" className="text-sm font-medium text-gray-700">
                Tipe Diskon
              </label>
              <select
                id="discount-type"
                value={form.discount_type}
                onChange={(e) => updateField('discount_type', e.target.value as 'fixed' | 'percentage')}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:border-rose-500 focus:ring-rose-500 bg-white cursor-pointer"
              >
                <option value="fixed">Potongan (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="discount-value" className="text-sm font-medium text-gray-700">
                Nilai Diskon
              </label>
              <input
                id="discount-value"
                type="number"
                value={form.discount_value}
                onChange={(e) => updateField('discount_value', e.target.value)}
                placeholder={form.discount_type === 'percentage' ? '0 - 100' : '10000'}
                min={1}
                max={form.discount_type === 'percentage' ? 100 : undefined}
                required
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
                  formErrors.discount_value
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
                }`}
              />
              {formErrors.discount_value && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.discount_value}
                </span>
              )}
            </div>
          </div>

          {/* Min Order + Kuota */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="min-order" className="text-sm font-medium text-gray-700">
                Minimal Order (Rp)
              </label>
              <input
                id="min-order"
                type="number"
                value={form.min_order_value}
                onChange={(e) => updateField('min_order_value', e.target.value)}
                placeholder="0"
                min={0}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
                  formErrors.min_order_value
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
                }`}
              />
              {formErrors.min_order_value && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.min_order_value}
                </span>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="max-usage" className="text-sm font-medium text-gray-700">
                Kuota Penggunaan
              </label>
              <input
                id="max-usage"
                type="number"
                value={form.max_usage}
                onChange={(e) => updateField('max_usage', e.target.value)}
                placeholder="Kosong = unlimited"
                min={1}
                className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
                  formErrors.max_usage
                    ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
                }`}
              />
              {formErrors.max_usage && (
                <span className="flex items-center gap-1 text-xs text-red-500">
                  <AlertCircle className="w-3 h-3" />
                  {formErrors.max_usage}
                </span>
              )}
            </div>
          </div>

          {/* Tanggal Kedaluwarsa */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="expiry-date" className="text-sm font-medium text-gray-700">
              Tanggal Kedaluwarsa
            </label>
            <input
              id="expiry-date"
              type="datetime-local"
              value={form.expiry_date}
              onChange={(e) => updateField('expiry_date', e.target.value)}
              required
              className={`w-full rounded-lg border px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
                formErrors.expiry_date
                  ? 'border-red-500 focus:border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:border-rose-500 focus:ring-rose-500'
              }`}
            />
            {formErrors.expiry_date && (
              <span className="flex items-center gap-1 text-xs text-red-500">
                <AlertCircle className="w-3 h-3" />
                {formErrors.expiry_date}
              </span>
            )}
          </div>
        </div>
      </Modal>

      {/* ── Delete Confirmation ── */}
      <ConfirmModal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Hapus Voucher?"
        message="Voucher yang sudah dihapus tidak bisa dikembalikan. Pastikan voucher ini tidak sedang digunakan oleh pelanggan."
        isLoading={isDeleting}
      />
    </div>
  );
}
