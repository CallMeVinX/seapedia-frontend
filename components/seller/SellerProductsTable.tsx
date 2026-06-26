import React from 'react';
import { SellerProductResponse } from '@/services/sellerProductService';
import { Loader2 } from 'lucide-react';

interface SellerProductsTableProps {
  products: SellerProductResponse[];
  isLoading: boolean;
  onEdit: (product: SellerProductResponse) => void;
  onDelete: (productId: number) => void;
}

export const SellerProductsTable: React.FC<SellerProductsTableProps> = ({ products, isLoading, onEdit, onDelete }) => {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      {/* Mobile Card Layout */}
      <div className="lg:hidden divide-y divide-slate-100">
        {products.map((product) => (
          <div key={product.id} className="p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-bold text-slate-900">{product.name}</div>
                {product.description && (
                  <div className="text-xs text-slate-500 mt-0.5 line-clamp-1">{product.description}</div>
                )}
              </div>
              {product.is_deleted ? (
                <span className="inline-block px-2.5 py-1 bg-red-50 text-red-700 border border-red-200 text-[10px] font-bold rounded-full">
                  Nonaktif
                </span>
              ) : (
                <span className="inline-block px-2.5 py-1 bg-green-50 text-green-700 border border-green-200 text-[10px] font-bold rounded-full">
                  Aktif
                </span>
              )}
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="inline-block px-2 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                {product.category_name}
              </span>
              <div className="text-right">
                <span className="text-xs text-slate-500 mr-2 block mb-1">Stok: <span className={`font-bold ${product.stock > 0 ? 'text-slate-900' : 'text-red-600'}`}>{product.stock}</span></span>
                {product.promo_price ? (
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] text-slate-400 line-through">{formatCurrency(product.price)}</span>
                    <span className="font-bold text-red-600">{formatCurrency(product.promo_price)}</span>
                  </div>
                ) : (
                  <span className="font-bold text-blue-950">{formatCurrency(product.price)}</span>
                )}
              </div>
            </div>

            {!product.is_deleted && (
              <div className="flex gap-2 pt-2 border-t border-slate-50">
                <button
                  onClick={() => onEdit(product)}
                  className="flex-1 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(product.id)}
                  className="flex-1 py-2 bg-red-50 text-red-600 hover:bg-red-100 font-bold text-xs rounded-lg transition-colors"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase tracking-wider text-slate-500 font-bold">
              <th className="px-6 py-4">Produk</th>
              <th className="px-6 py-4">Kategori</th>
              <th className="px-6 py-4 text-right">Harga</th>
              <th className="px-6 py-4 text-center">Stok</th>
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-bold text-slate-900">{product.name}</div>
                  {product.description && (
                    <div className="text-xs text-slate-500 mt-0.5 line-clamp-1 max-w-[250px]">{product.description}</div>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block px-2.5 py-1 bg-slate-100 text-slate-700 text-xs font-semibold rounded-lg">
                    {product.category_name}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  {product.promo_price ? (
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] text-slate-400 line-through">{formatCurrency(product.price)}</span>
                      <span className="font-bold text-red-600">{formatCurrency(product.promo_price)}</span>
                    </div>
                  ) : (
                    <span className="font-bold text-blue-950">{formatCurrency(product.price)}</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className={`font-bold ${product.stock > 0 ? 'text-slate-900' : 'text-red-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  {product.is_deleted ? (
                    <span className="inline-block px-3 py-1 bg-red-50 text-red-700 border border-red-200 text-xs font-bold rounded-full">
                      Nonaktif
                    </span>
                  ) : (
                    <span className="inline-block px-3 py-1 bg-green-50 text-green-700 border border-green-200 text-xs font-bold rounded-full">
                      Aktif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  {!product.is_deleted && (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Produk"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Produk"
                      >
                        Hapus
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
