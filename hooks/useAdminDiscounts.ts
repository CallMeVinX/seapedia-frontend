import { useState, useEffect, useCallback } from 'react';
import {
  adminService,
  DiscountItem,
  DiscountCreateRequest,
  DiscountCreateRequest,
  DiscountUpdateRequest,
} from '@/services/adminService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

// ─────────────────────────────────────────────
// Form State & Validation Types
// ─────────────────────────────────────────────

export interface DiscountFormState {
  code: string;
  discount_value: string; // String untuk input kontrol, konversi saat submit
  discount_type: 'fixed' | 'percentage';
  min_order_value: string;
  max_usage: string;
  expiry_date: string;
}

export interface DiscountFormErrors {
  code?: string;
  discount_value?: string;
  min_order_value?: string;
  max_usage?: string;
  expiry_date?: string;
}

const EMPTY_FORM: DiscountFormState = {
  code: '',
  discount_value: '',
  discount_type: 'fixed',
  min_order_value: '0',
  max_usage: '',
  expiry_date: '',
};

/**
 * 🧠 Logical Agent: useAdminDiscounts
 * 
 * Controller hook untuk halaman Voucher & Promo CRUD.
 * Mengelola state list, form, validasi, dan semua CRUD operations.
 * 
 * RULE: Validasi ganda — level Hook (sebelum Service) dan level UI (atribut HTML).
 *       Sesuai Frontend Security Protocol §3 dari AGENTS.md.
 */
export const useAdminDiscounts = () => {
  const { activeRole } = useAuthStore();

  // ── List State ──
  const [discounts, setDiscounts] = useState<DiscountItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Form State ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<DiscountFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<DiscountFormErrors>({});

  // ── Delete State ──
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ─────────────────────────────────────────
  // Fetch
  // ─────────────────────────────────────────

  const fetchDiscounts = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'ADMIN') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const data = await adminService.getDiscounts();
      setDiscounts(data);
    } catch (error) {
      console.error('Failed to fetch discounts', error);
      showToast.error('Gagal Memuat', 'Tidak dapat mengambil data voucher.');
    } finally {
      setIsLoading(false);
    }
  }, [activeRole]);

  useEffect(() => {
    fetchDiscounts();
  }, [fetchDiscounts]);

  // ─────────────────────────────────────────
  // Form Helpers
  // ─────────────────────────────────────────

  const updateField = <K extends keyof DiscountFormState>(
    field: K,
    value: DiscountFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Clear error saat user mengetik
    if (formErrors[field as keyof DiscountFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (item: DiscountItem) => {
    setEditingId(item.id);
    setForm({
      code: item.code,
      discount_value: String(item.discount_value),
      discount_type: item.discount_type,
      min_order_value: String(item.min_order_value),
      max_usage: item.max_usage !== null ? String(item.max_usage) : '',
      expiry_date: item.expiry_date ? item.expiry_date.slice(0, 16) : '', // datetime-local format
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
  }, []);

  // ─────────────────────────────────────────
  // Validation (Hook-Level — Security Protocol §3)
  // ─────────────────────────────────────────

  const validateForm = (): boolean => {
    const errors: DiscountFormErrors = {};

    // Code: wajib, minimal 3 karakter
    if (!form.code.trim()) {
      errors.code = 'Kode diskon wajib diisi.';
    } else if (form.code.trim().length < 3) {
      errors.code = 'Kode diskon minimal 3 karakter.';
    }

    // Discount value: wajib, harus positif
    const discountVal = parseFloat(form.discount_value);
    if (!form.discount_value || isNaN(discountVal) || discountVal <= 0) {
      errors.discount_value = 'Nilai diskon harus lebih dari 0.';
    } else if (form.discount_type === 'percentage' && discountVal > 100) {
      errors.discount_value = 'Persentase tidak boleh lebih dari 100%.';
    }

    // Min order value: opsional, tapi jika diisi harus non-negatif
    const minOrder = parseFloat(form.min_order_value);
    if (form.min_order_value && (isNaN(minOrder) || minOrder < 0)) {
      errors.min_order_value = 'Minimal order tidak boleh negatif.';
    }

    // Max usage: opsional, tapi jika diisi harus positif integer
    if (form.max_usage) {
      const maxUsage = parseInt(form.max_usage, 10);
      if (isNaN(maxUsage) || maxUsage <= 0) {
        errors.max_usage = 'Kuota harus bilangan bulat positif.';
      }
    }

    // Expiry date: wajib, harus di masa depan
    if (!form.expiry_date) {
      errors.expiry_date = 'Tanggal kedaluwarsa wajib diisi.';
    } else {
      const expiry = new Date(form.expiry_date);
      if (isNaN(expiry.getTime())) {
        errors.expiry_date = 'Format tanggal tidak valid.';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─────────────────────────────────────────
  // CRUD Actions
  // ─────────────────────────────────────────

  const handleSave = async () => {
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);

    try {
      if (editingId) {
        // Update existing
        const payload: DiscountUpdateRequest = {
          code: form.code.trim().toUpperCase(),
          discount_value: parseFloat(form.discount_value),
          discount_type: form.discount_type,
          min_order_value: parseFloat(form.min_order_value) || 0,
          max_usage: form.max_usage ? parseInt(form.max_usage, 10) : null,
          expiry_date: new Date(form.expiry_date).toISOString(),
        };
        await adminService.updateDiscount(editingId, payload);
        showToast.success('Berhasil', 'Diskon berhasil diperbarui.');
      } else {
        // Create new
        const payload: DiscountCreateRequest = {
          code: form.code.trim().toUpperCase(),
          discount_value: parseFloat(form.discount_value),
          discount_type: form.discount_type,
          min_order_value: parseFloat(form.min_order_value) || 0,
          max_usage: form.max_usage ? parseInt(form.max_usage, 10) : null,
          expiry_date: new Date(form.expiry_date).toISOString(),
        };
        await adminService.createDiscount(payload);
        showToast.success('Berhasil', `Voucher berhasil dibuat.`);
      }

      closeModal();
      await fetchDiscounts();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal menyimpan diskon.';
      showToast.error('Gagal', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId || isDeleting) return;

    setIsDeleting(true);
    try {
      await adminService.deleteDiscount(deletingId);
      showToast.success('Berhasil', 'Diskon berhasil dihapus.');
      setDeletingId(null);
      await fetchDiscounts();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal menghapus diskon.';
      showToast.error('Gagal', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleActive = async (item: DiscountItem) => {
    try {
      await adminService.updateDiscount(item.id, { is_active: !item.is_active });
      showToast.success('Berhasil', `Diskon ${!item.is_active ? 'diaktifkan' : 'dinonaktifkan'}.`);
      await fetchDiscounts();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal mengubah status diskon.';
      showToast.error('Gagal', msg);
    }
  };

  return {
    // List state
    discounts,
    isLoading,

    // Form state
    isModalOpen,
    isSaving,
    editingId,
    form,
    formErrors,
    updateField,
    openCreateModal,
    openEditModal,
    closeModal,

    // Delete state
    isDeleting,
    deletingId,
    setDeletingId,

    // Actions
    handleSave,
    handleDelete,
    handleToggleActive,
    refreshDiscounts: fetchDiscounts,
  };
};
