"use client";

import { Product } from "@/services/productService";
import { useAuthStore } from "@/hooks/useAuthStore";
import { checkoutService } from "@/services/checkoutService";
import { cartService } from "@/services/cartService";
import { useCartStore } from "@/hooks/useCartStore";
import Button from "@/components/ui/Button";
import { Lock, LogIn, ShoppingCart, Truck, Loader2 } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/utils/toast";
import { useState } from "react";

import { ConfirmModal } from "@/components/ui/ConfirmModal";

export default function ProductPurchasePanel({ product }: { product: Product }) {
  const { user } = useAuthStore();
  const { fetchCartCount } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmActionType, setConfirmActionType] = useState<'add_to_cart' | 'buy_now' | null>(null);

  const handleAddToCart = async (replaceCart = false) => {
    if (!user) {
      showToast.error("Gagal", 'Silakan login terlebih dahulu.');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      await cartService.addToCart({
        product_id: product.id,
        quantity: 1,
        replace_cart: replaceCart
      });
      showToast.success("Berhasil", 'Barang ditambahkan ke keranjang!');
      fetchCartCount();
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (error.response?.status === 409 && detail === "CONFLICT_DIFFERENT_STORE") {
        setConfirmActionType('add_to_cart');
        setShowConfirm(true);
      } else {
        const msg = detail || 'Gagal menambahkan ke keranjang. Coba lagi.';
        showToast.error("Gagal", msg);
      }
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleBuyNow = async (replaceCart = false) => {
    if (!user) {
      showToast.error("Gagal", 'Sesi telah berakhir. Silakan login kembali.');
      return;
    }
    
    setIsCheckingOut(true);
    try {
      // 1. Add to cart first to get the cart_item_id
      const cartResp = await cartService.addToCart({
        product_id: product.id,
        quantity: 1,
        replace_cart: replaceCart
      });
      fetchCartCount();
      
      // Find the newly added item
      const addedItem = cartResp.items.find(i => i.product_id === product.id);
      if (!addedItem) {
        throw new Error("Gagal mendapatkan ID item dari keranjang.");
      }

      // 2. Checkout specifically this item
      const response = await checkoutService.checkout({
        cart_item_ids: [addedItem.id],
        address_id: 1,
        delivery_method: 'REGULAR'
      });
      
      showToast.success("Berhasil", `Checkout berhasil! ID Pesanan: ${response.order_id}`);
      fetchCartCount(); // refresh count as item is removed
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      if (error.response?.status === 409 && detail === "CONFLICT_DIFFERENT_STORE") {
        setConfirmActionType('buy_now');
        setShowConfirm(true);
      } else {
        const msg = detail || error.message || 'Terjadi kesalahan saat memproses checkout.';
        showToast.error("Gagal", msg);
      }
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          if (confirmActionType === 'add_to_cart') {
            setIsAddingToCart(false);
            handleAddToCart(true);
          } else if (confirmActionType === 'buy_now') {
            setIsCheckingOut(false);
            handleBuyNow(true);
          }
        }}
        title="Ganti Toko?"
        message="Keranjang Anda berisi produk dari toko lain. Anda hanya dapat membeli dari satu toko pada satu waktu. Ingin mengosongkan keranjang dan melanjutkan?"
      />
      <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <span className="bg-orange-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wide">
            Premium
          </span>
          <span className="text-sm font-medium text-slate-500">
            ★ 4.9 (128 reviews)
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight mb-4">
          {product.name}
        </h1>
        {product.promo_price ? (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-slate-400 line-through mb-1">
              {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.price))}
            </span>
            <div className="flex items-center gap-3">
              <div className="text-3xl font-extrabold text-red-600">
                {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.promo_price))}
              </div>
              <span className="text-sm font-bold text-red-600 bg-red-100 px-2 py-1 rounded-md">
                {Math.round(((product.price - product.promo_price) / product.price) * 100)}% OFF
              </span>
            </div>
          </div>
        ) : (
          <div className="text-3xl font-extrabold text-blue-950">
            {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(product.price))}
          </div>
        )}
      </div>

      <hr className="border-slate-100" />

      {/* Shipping Info */}
      <div className="bg-slate-50 rounded-xl p-4 flex gap-4 border border-slate-100">
        <Truck className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-slate-900">Shipping from Global Hub</h4>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Estimated delivery: 3-5 business days. International shipping available.
          </p>
        </div>
      </div>

      {/* Action Area */}
      {!user ? (
        // Locked State for Guests
        <div className="space-y-4">
          <div className="bg-slate-100 rounded-xl p-6 flex flex-col items-center justify-center text-center border border-slate-200">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center mb-3">
              <Lock className="w-5 h-5 text-slate-500" />
            </div>
            <p className="text-sm text-slate-600 mb-2 max-w-xs">
              Please sign in to view availability, select options, and purchase this item.
            </p>
          </div>
          <Link href="/login" className="block">
            <Button variant="primary" className="w-full py-3.5 text-base" icon={<LogIn className="w-5 h-5" />}>
              Login to Purchase
            </Button>
          </Link>
        </div>
      ) : (
        // Authenticated State
        <div className="space-y-3">
          <div className="text-sm text-slate-600 mb-2">
            Stock available: <span className="font-semibold text-slate-900">{product.stock}</span>
          </div>
          <Button 
            variant="primary" 
            className="w-full py-3.5 text-base" 
            onClick={() => handleAddToCart(false)}
            disabled={isAddingToCart}
            icon={isAddingToCart ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShoppingCart className="w-5 h-5" />}
          >
            {isAddingToCart ? 'Menambahkan...' : 'Add to Cart'}
          </Button>
          <Button 
            variant="secondary" 
            className="w-full py-3.5 text-base border-blue-600 text-blue-700 hover:bg-blue-50"
            onClick={() => handleBuyNow(false)}
            disabled={isCheckingOut}
            icon={isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
          >
            {isCheckingOut ? 'Memproses...' : 'Buy Now (Checkout Cart)'}
          </Button>
        </div>
      )}

    </div>
    </>
  );
}
