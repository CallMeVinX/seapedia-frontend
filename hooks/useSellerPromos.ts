import { useState, useEffect, useCallback } from 'react';
import {
  sellerService,
  PromoResponse,
  PromoCreateRequest,
  SellerProductResponse,
} from '@/services/sellerService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

// ─────────────────────────────────────────────
// Form State & Validation Types
// ─────────────────────────────────────────────

export interface PromoFormState {
  name: string;
  discount_percentage: string;
  valid_from: string;
  valid_until: string;
  product_ids: number[];
}

export interface PromoFormErrors {
  name?: string;
  discount_percentage?: string;
  valid_from?: string;
  valid_until?: string;
  product_ids?: string;
}

const EMPTY_FORM: PromoFormState = {
  name: '',
  discount_percentage: '',
  valid_from: '',
  valid_until: '',
  product_ids: [],
};

/**
 * 🧠 Logical Agent: useSellerPromos
 * 
 * Controller hook untuk halaman Promo di Seller Dashboard.
 */
export const useSellerPromos = () => {
  const { activeRole } = useAuthStore();

  // ── List State ──
  const [promos, setPromos] = useState<PromoResponse[]>([]);
  const [products, setProducts] = useState<SellerProductResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ── Form State ──
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PromoFormState>(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState<PromoFormErrors>({});

  // ── Delete State ──
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // ─────────────────────────────────────────
  // Fetch Data
  // ─────────────────────────────────────────

  const fetchData = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'SELLER') {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const [promosData, productsData] = await Promise.all([
        sellerService.getPromos(),
        sellerService.getSellerProducts(),
      ]);
      setPromos(promosData);
      setProducts(productsData.filter(p => !p.is_deleted));
    } catch (error) {
      console.error('Failed to fetch promos data', error);
      showToast.error('Gagal Memuat', 'Tidak dapat mengambil data promo.');
    } finally {
      setIsLoading(false);
    }
  }, [activeRole]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // ─────────────────────────────────────────
  // Form Helpers
  // ─────────────────────────────────────────

  const updateField = <K extends keyof PromoFormState>(
    field: K,
    value: PromoFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field as keyof PromoFormErrors]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const openEditModal = (promo: PromoResponse) => {
    setEditingId(promo.id);
    setForm({
      name: promo.name,
      discount_percentage: promo.discount_percentage.toString(),
      valid_from: new Date(promo.valid_from).toISOString().slice(0, 16),
      valid_until: new Date(promo.valid_until).toISOString().slice(0, 16),
      product_ids: promo.product_ids || [],
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
  // Validation
  // ─────────────────────────────────────────

  const validateForm = (): boolean => {
    const errors: PromoFormErrors = {};

    if (!form.name.trim()) {
      errors.name = 'Nama promo wajib diisi.';
    } else if (form.name.trim().length < 3) {
      errors.name = 'Nama promo minimal 3 karakter.';
    }

    const discountVal = parseFloat(form.discount_percentage);
    if (!form.discount_percentage || isNaN(discountVal) || discountVal <= 0 || discountVal > 100) {
      errors.discount_percentage = 'Diskon harus antara 1% - 100%.';
    }

    if (!form.valid_from) {
      errors.valid_from = 'Tanggal mulai wajib diisi.';
    }

    if (!form.valid_until) {
      errors.valid_until = 'Tanggal kedaluwarsa wajib diisi.';
    } else if (form.valid_from && new Date(form.valid_until) <= new Date(form.valid_from)) {
      errors.valid_until = 'Tanggal kedaluwarsa harus setelah tanggal mulai.';
    }

    if (form.product_ids.length === 0) {
      errors.product_ids = 'Pilih minimal satu produk.';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ─────────────────────────────────────────
  // Actions
  // ─────────────────────────────────────────

  const handleSave = async () => {
    if (!validateForm()) return;
    if (isSaving) return;

    setIsSaving(true);
    try {
      const payload: PromoCreateRequest = {
        name: form.name.trim(),
        discount_percentage: parseFloat(form.discount_percentage),
        valid_from: new Date(form.valid_from).toISOString(),
        valid_until: new Date(form.valid_until).toISOString(),
        product_ids: form.product_ids,
      };
      
      if (editingId) {
        await sellerService.updatePromo(editingId, payload);
        showToast.success('Berhasil', 'Promo berhasil diubah.');
      } else {
        await sellerService.createPromo(payload);
        showToast.success('Berhasil', 'Promo berhasil dibuat.');
      }
      closeModal();
      await fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal menyimpan promo.';
      showToast.error('Gagal', msg);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingId || isDeleting) return;

    setIsDeleting(true);
    try {
      await sellerService.deletePromo(deletingId);
      showToast.success('Berhasil', 'Promo berhasil dihapus.');
      setDeletingId(null);
      await fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.detail || 'Gagal menghapus promo.';
      showToast.error('Gagal', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
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
    refreshPromos: fetchData,
  };
};
