import { useState, useEffect, useCallback } from 'react';
import { sellerProductService, SellerProductResponse, CategoryResponse, ProductCreateRequest } from '@/services/sellerProductService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useSellerProducts = () => {
  const { activeRole } = useAuthStore();
  const [products, setProducts] = useState<SellerProductResponse[]>([]);
  const [categories, setCategories] = useState<CategoryResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const loadProducts = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'SELLER') return;
    setIsLoading(true);
    try {
      const data = await sellerProductService.getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Failed to load products", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRole]);

  const loadCategories = useCallback(async () => {
    try {
      const data = await sellerProductService.getCategories();
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories", error);
    }
  }, []);

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, [loadProducts, loadCategories]);

  const createProduct = async (data: ProductCreateRequest) => {
    // Client-side validation
    if (!data.name.trim()) {
      showToast.error("Validasi Gagal", "Nama produk wajib diisi.");
      return false;
    }
    if (data.price < 0) {
      showToast.error("Validasi Gagal", "Harga tidak boleh negatif.");
      return false;
    }
    if (data.stock < 0) {
      showToast.error("Validasi Gagal", "Stok tidak boleh negatif.");
      return false;
    }
    if (!data.category_id) {
      showToast.error("Validasi Gagal", "Kategori harus dipilih.");
      return false;
    }

    setIsSubmitting(true);
    try {
      await sellerProductService.createProduct(data);
      showToast.success("Berhasil", "Produk berhasil ditambahkan!");
      setIsModalOpen(false);
      await loadProducts();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal membuat produk.";
      showToast.error("Gagal", msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateProduct = async (productId: number, data: ProductCreateRequest) => {
    // Client-side validation
    if (!data.name.trim()) {
      showToast.error("Validasi Gagal", "Nama produk wajib diisi.");
      return false;
    }
    if (data.price < 0) {
      showToast.error("Validasi Gagal", "Harga tidak boleh negatif.");
      return false;
    }
    if (data.stock < 0) {
      showToast.error("Validasi Gagal", "Stok tidak boleh negatif.");
      return false;
    }
    if (!data.category_id) {
      showToast.error("Validasi Gagal", "Kategori harus dipilih.");
      return false;
    }

    setIsSubmitting(true);
    try {
      await sellerProductService.updateProduct(productId, data);
      showToast.success("Berhasil", "Produk berhasil diubah!");
      setIsModalOpen(false);
      await loadProducts();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal mengubah produk.";
      showToast.error("Gagal", msg);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteProduct = async (productId: number) => {
    try {
      await sellerProductService.deleteProduct(productId);
      showToast.success("Berhasil", "Produk berhasil dihapus!");
      await loadProducts();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal menghapus produk.";
      showToast.error("Gagal", msg);
      return false;
    }
  };

  return {
    products,
    categories,
    isLoading,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
    createProduct,
    updateProduct,
    deleteProduct,
    refreshProducts: loadProducts
  };
};
