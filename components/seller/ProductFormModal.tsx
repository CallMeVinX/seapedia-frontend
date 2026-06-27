import React, { useState } from 'react';
import { X, Loader2, Package } from 'lucide-react';
import { CategoryResponse, ProductCreateRequest, SellerProductResponse } from '@/services/sellerProductService';
import { useEffect } from 'react';
import { ImageUpload } from '@/components/ui/ImageUpload';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductCreateRequest, productId?: number) => Promise<boolean>;
  categories: CategoryResponse[];
  isSubmitting: boolean;
  initialData?: SellerProductResponse | null;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  isSubmitting,
  initialData
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [promoPrice, setPromoPrice] = useState('');

  useEffect(() => {
    if (initialData && isOpen) {
      setName(initialData.name);
      setDescription(initialData.description || '');
      setPrice(initialData.price.toLocaleString('id-ID'));
      setPromoPrice(initialData.promo_price ? initialData.promo_price.toLocaleString('id-ID') : '');
      setStock(initialData.stock.toString());
      const cat = categories.find(c => c.name === initialData.category_name);
      setCategoryId(cat ? cat.id.toString() : '');
      setImageUrl(initialData.image_url || '');
    } else if (isOpen) {
      resetForm();
    }
  }, [initialData, isOpen, categories]);

  const resetForm = () => {
    setName('');
    setDescription('');
    setPrice('');
    setPromoPrice('');
    setStock('');
    setCategoryId('');
    setImageUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSubmit({
      name: name.trim(),
      description: description.trim() || undefined,
      price: parseFloat(price.replace(/\./g, '')) || 0,
      promo_price: promoPrice ? parseFloat(promoPrice.replace(/\./g, '')) : undefined,
      stock: parseInt(stock) || 0,
      category_id: parseInt(categoryId) || 0,
      image_url: imageUrl
    }, initialData?.id);
    if (success) resetForm();
  };

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-xl">
              <Package className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-lg font-black text-slate-900">{initialData ? 'Edit Produk' : 'Tambah Produk Baru'}</h2>
          </div>
          <button onClick={handleClose} disabled={isSubmitting} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label htmlFor="productName" className="block text-sm font-bold text-slate-700 mb-1.5">
              Nama Produk <span className="text-red-500">*</span>
            </label>
            <input
              id="productName"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
              placeholder="Contoh: Udang Vaname Segar"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1.5">
              Foto Produk
            </label>
            <ImageUpload 
              onImageUploaded={setImageUrl}
              onImageRemoved={() => setImageUrl('')}
              defaultImage={imageUrl}
            />
          </div>

          <div>
            <label htmlFor="productDesc" className="block text-sm font-bold text-slate-700 mb-1.5">
              Deskripsi
            </label>
            <textarea
              id="productDesc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 resize-none"
              placeholder="Jelaskan kualitas dan keunggulan produk..."
              disabled={isSubmitting}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="productPrice" className="block text-sm font-bold text-slate-700 mb-1.5">
                Harga (Rp) <span className="text-red-500">*</span>
              </label>
              <input
                id="productPrice"
                type="text"
                required
                value={price}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  if (!rawValue) {
                    setPrice('');
                    return;
                  }
                  setPrice(parseInt(rawValue, 10).toLocaleString('id-ID'));
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="50.000"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="productPromoPrice" className="block text-sm font-bold text-slate-700 mb-1.5">
                Harga Promo (Rp) <span className="text-slate-400 font-normal">(Opsional)</span>
              </label>
              <input
                id="productPromoPrice"
                type="text"
                value={promoPrice}
                onChange={(e) => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  if (!rawValue) {
                    setPromoPrice('');
                    return;
                  }
                  setPromoPrice(parseInt(rawValue, 10).toLocaleString('id-ID'));
                }}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="45.000"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="productStock" className="block text-sm font-bold text-slate-700 mb-1.5">
                Stok <span className="text-red-500">*</span>
              </label>
              <input
                id="productStock"
                type="number"
                required
                min="0"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400"
                placeholder="100"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <label htmlFor="productCategory" className="block text-sm font-bold text-slate-700 mb-1.5">
              Kategori <span className="text-red-500">*</span>
            </label>
            <select
              id="productCategory"
              required
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700 bg-white"
              disabled={isSubmitting}
            >
              <option value="">— Pilih Kategori —</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex-1 py-3 px-4 rounded-xl border border-slate-300 text-slate-700 font-bold hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !price || !stock || !categoryId}
              className="flex-1 py-3 px-4 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Menyimpan...</>
              ) : (
                'Simpan Produk'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
