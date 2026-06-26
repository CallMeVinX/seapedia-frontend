"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { cartService } from "@/services/cartService";
import { showToast } from "@/utils/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function HomeProductCard({ product }: { product: any }) {
  const { user, activeRole } = useAuthStore();
  const { fetchCartCount } = useCartStore();
  const router = useRouter();
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleAddToCart = async (e?: React.MouseEvent, replaceCart = false) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    if (!user) {
      showToast.error("Gagal", "Silakan login terlebih dahulu untuk menambah ke keranjang.");
      router.push("/login");
      return;
    }

    if (activeRole?.toUpperCase() === "SELLER" || activeRole?.toUpperCase() === "DRIVER") {
      showToast.error("Gagal", "Hanya pembeli yang dapat menambahkan barang ke keranjang.");
      return;
    }

    setIsAdding(true);
    try {
      await cartService.addToCart({ product_id: product.id, quantity: 1, replace_cart: replaceCart });
      await fetchCartCount();
      showToast.success("Berhasil", "Barang ditambahkan ke keranjang!");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (error.response?.status === 409 && detail === "CONFLICT_DIFFERENT_STORE") {
        setShowConfirm(true);
      } else {
        const msg = detail || "Gagal menambahkan barang ke keranjang.";
        showToast.error("Gagal", msg);
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          handleAddToCart(undefined, true);
        }}
        title="Ganti Toko?"
        message="Keranjang Anda berisi produk dari toko lain. Anda hanya dapat membeli dari satu toko pada satu waktu. Ingin mengosongkan keranjang dan menambahkan produk ini?"
      />
      <Card hoverable className="group border-0 shadow-sm hover:shadow-xl transition-all rounded-2xl overflow-hidden flex flex-col bg-white">
        <Link href={`/products/${product.id}`} className="relative w-full aspect-square bg-slate-100 overflow-hidden block">
          <Image 
            src={product.image_url || "/tech_store.png"} 
            alt={product.name} 
            fill 
            unoptimized 
            className="object-cover group-hover:scale-105 transition-transform duration-500" 
          />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-slate-400 mb-1 truncate max-w-full" title={product.store_name}>
          {product.store_name}
        </span>
        <Link href={`/products/${product.id}`} className="text-sm font-bold text-slate-900 hover:text-blue-700 line-clamp-2 mb-2">
          {product.name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex flex-col">
            {product.promo_price ? (
              <>
                <span className="text-xs font-semibold text-slate-400 line-through mb-0.5">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.price))}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg font-extrabold text-red-600">
                    {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.promo_price))}
                  </span>
                  <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1 py-0.5 rounded-sm whitespace-nowrap">
                    {Math.round(((product.price - product.promo_price) / product.price) * 100)}% OFF
                  </span>
                </div>
              </>
            ) : (
              <span className="text-lg font-extrabold text-slate-900">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.price))}
              </span>
            )}
          </div>
          <button 
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center text-slate-600 hover:text-blue-700 transition-colors disabled:opacity-50"
          >
            {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </Card>
    </>
  );
}
