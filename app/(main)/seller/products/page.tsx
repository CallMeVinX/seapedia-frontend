"use client";

import { useAuthStore } from '@/hooks/useAuthStore';
import { useSellerProducts } from '@/hooks/useSellerProducts';
import { ProductFormModal } from '@/components/seller/ProductFormModal';
import { SellerProductsTable } from '@/components/seller/SellerProductsTable';
import { EmptyState } from '@/components/ui/EmptyState';
import { ConfirmModal } from '@/components/ui/ConfirmModal';
import { Package, Plus } from 'lucide-react';

import { useState } from 'react';
import { SellerProductResponse } from '@/services/sellerProductService';

export default function SellerProductsPage() {
  const { } = useAuthStore();
  const {
    products,
    categories,
    isLoading,
    isSubmitting,
    isModalOpen,
    setIsModalOpen,
    createProduct,
    updateProduct,
    deleteProduct
  } = useSellerProducts();

  const [editingProduct, setEditingProduct] = useState<SellerProductResponse | null>(null);
  
  // Delete Confirmation State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleOpenModal = (product?: SellerProductResponse) => {
    setEditingProduct(product || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setEditingProduct(null), 300); // Wait for transition
  };

  const handleSubmit = async (data: any, productId?: number) => {
    if (productId) {
      return await updateProduct(productId, data);
    } else {
      return await createProduct(data);
    }
  };

  const handleDeleteClick = (productId: number) => {
    setDeleteConfirmId(productId);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await deleteProduct(deleteConfirmId);
    } finally {
      setIsDeleting(false);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Produk Saya</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola katalog produk toko Anda.</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
        >
          <Plus className="w-5 h-5" /> Tambah Produk
        </button>
      </div>

      {!isLoading && products.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Belum Ada Produk"
          description="Mulai tambahkan produk kelautan terbaik Anda untuk dijual kepada pembeli di seluruh Indonesia."
          action={
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Tambah Produk Pertama
            </button>
          }
        />
      ) : (
        <SellerProductsTable 
          products={products} 
          isLoading={isLoading} 
          onEdit={handleOpenModal}
          onDelete={handleDeleteClick}
        />
      )}

      <ProductFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        categories={categories}
        isSubmitting={isSubmitting}
        initialData={editingProduct}
      />

      <ConfirmModal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk"
        message="Yakin ingin menghapus produk ini? Produk yang sudah dihapus tidak dapat dibeli lagi, namun riwayat transaksi sebelumnya tetap akan tersimpan."
        isLoading={isDeleting}
      />
    </div>
  );
}
