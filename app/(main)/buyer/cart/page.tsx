"use client";

import { useEffect, useState, useMemo } from "react";
import { cartService, CartResponse, CartItemResponse } from "@/services/cartService";
import { checkoutService } from "@/services/checkoutService";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ShoppingBag, Loader2, Store, CheckSquare, Square, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import { showToast } from "@/utils/toast";

interface StoreGroup {
  store_id: number;
  store_name: string;
  items: CartItemResponse[];
}

export default function CartPage() {
  const { token, user } = useAuthStore();
  const { fetchCartCount } = useCartStore();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const loadCart = async () => {
    if (!token) return;
    try {
      const data = await cartService.getCart();
      setCart(data);
      // Optional: don't clear selected items on reload to keep selection if they just changed quantity
      // But clearing is safer if cart content structure changes
      setSelectedItems(prev => prev.filter(id => data.items.some(i => i.id === id)));
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal memuat keranjang.";
      showToast.error("Gagal", msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCart();
  }, [token]);

  const handleUpdateQuantity = async (productId: number, delta: number, currentQty: number) => {
    if (!token) return;

    setIsUpdatingId(productId);
    try {
      await cartService.addToCart({ product_id: productId, quantity: delta });
      await loadCart();
      await fetchCartCount();
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal mengubah kuantitas.";
      showToast.error("Gagal", msg);
    } finally {
      setIsUpdatingId(null);
    }
  };

  // Group items by store (Shopee-style)
  const storeGroups: StoreGroup[] = useMemo(() => {
    if (!cart || !cart.items.length) return [];

    const groupMap = new Map<number, StoreGroup>();
    for (const item of cart.items) {
      if (!groupMap.has(item.store_id)) {
        groupMap.set(item.store_id, {
          store_id: item.store_id,
          store_name: item.store_name,
          items: [],
        });
      }
      groupMap.get(item.store_id)!.items.push(item);
    }
    return Array.from(groupMap.values());
  }, [cart]);

  const handleToggleItem = (itemId: number, storeId: number) => {
    // If selecting, check if there's a store conflict
    const isCurrentlySelected = selectedItems.includes(itemId);
    if (!isCurrentlySelected) {
      const activeStoreId = selectedItems.length > 0 
        ? cart?.items.find(i => i.id === selectedItems[0])?.store_id 
        : null;
        
      if (activeStoreId && activeStoreId !== storeId) {
        showToast.error("Gagal", 'Batalkan pilihan di toko lain terlebih dahulu.');
        return;
      }
    }

    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleToggleStore = (storeId: number) => {
    const activeStoreId = selectedItems.length > 0 
      ? cart?.items.find(i => i.id === selectedItems[0])?.store_id 
      : null;

    // Check if we are trying to select a DIFFERENT store
    const storeItems = cart?.items.filter(i => i.store_id === storeId).map(i => i.id) || [];
    const allSelected = storeItems.every(id => selectedItems.includes(id));
    
    if (!allSelected && activeStoreId && activeStoreId !== storeId) {
      showToast.error("Gagal", 'Batalkan pilihan di toko lain terlebih dahulu.');
      return;
    }

    if (allSelected) {
      // Deselect all from this store
      setSelectedItems(prev => prev.filter(id => !storeItems.includes(id)));
    } else {
      // Select all from this store
      setSelectedItems(prev => {
        const newSelection = [...prev];
        storeItems.forEach(id => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  const handleCheckout = () => {
    if (!token || !cart || selectedItems.length === 0) return;
    setIsCheckingOut(true);
    // Redirect to checkout page with selected items as query params
    router.push(`/buyer/checkout?items=${selectedItems.join(",")}`);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center bg-slate-50 p-6">
        <ShoppingBag className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Keranjang Belanja</h2>
        <p className="text-slate-500 mb-6 text-center">Silakan login untuk melihat keranjang Anda.</p>
        <Link href="/login">
          <Button variant="primary" className="px-8">Login Sekarang</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-slate-50">
        <Loader2 className="h-10 w-10 text-blue-900 animate-spin" />
      </div>
    );
  }

  const isEmpty = !cart || cart.items.length === 0;

  // Calculate dynamic summary based on selection
  const selectedCartItems = cart?.items.filter(item => selectedItems.includes(item.id)) || [];
  const selectedCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedSubtotal = selectedCartItems.reduce((sum, item) => sum + item.total_price, 0);
  const hasSelected = selectedItems.length > 0;
  const deliveryFee = hasSelected ? 10000 : 0;
  const ppn = Math.round(selectedSubtotal * 0.12);
  const grandTotal = selectedSubtotal + deliveryFee + ppn;

  // Find out the active store that is currently selected (if any)
  const activeStoreId = hasSelected ? selectedCartItems[0].store_id : null;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <Link href="/products" className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900">Keranjang Belanja</h1>
          {!isEmpty && (
            <span className="ml-auto text-sm font-medium text-slate-500 bg-slate-200/50 px-3 py-1 rounded-full">
              {cart!.total_items} barang
            </span>
          )}
        </div>

        {isEmpty ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 shadow-sm flex flex-col items-center">
            <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">Keranjang Anda Kosong</h2>
            <p className="text-slate-500 mb-8 max-w-sm">
              Temukan berbagai produk kelautan terbaik di katalog kami dan mulai berbelanja.
            </p>
            <Link href="/products">
              <Button variant="primary" className="px-8">Mulai Belanja</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items Grouped by Store */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* Global Warning Banner for Checkout Rule */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex gap-3 shadow-sm">
                <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-blue-900">Aturan Checkout</h4>
                  <p className="text-xs text-blue-700 mt-1 leading-relaxed">
                    Sistem kami mengharuskan Anda untuk melakukan checkout dari <strong>1 toko saja</strong> dalam satu waktu. Pilih barang dari toko yang sama untuk melanjutkan.
                  </p>
                </div>
              </div>

              {storeGroups.map((group) => {
                const storeItemIds = group.items.map(i => i.id);
                const isStoreAllSelected = storeItemIds.length > 0 && storeItemIds.every(id => selectedItems.includes(id));
                const isStoreIndeterminate = !isStoreAllSelected && storeItemIds.some(id => selectedItems.includes(id));
                
                // If another store is active, lock this store
                const isLocked = activeStoreId !== null && activeStoreId !== group.store_id;

                return (
                  <div 
                    key={group.store_id} 
                    className={`bg-white rounded-2xl border ${isStoreAllSelected ? 'border-blue-400 ring-1 ring-blue-400' : 'border-slate-200'} shadow-sm overflow-hidden transition-all duration-300 ${isLocked ? 'opacity-50 grayscale-[30%]' : ''}`}
                  >
                    {/* Store Header Checkbox */}
                    <div className={`px-5 py-3.5 flex items-center gap-3 border-b border-slate-100 ${isStoreAllSelected ? 'bg-blue-50/50' : 'bg-slate-50/50'}`}>
                      <button 
                        onClick={() => handleToggleStore(group.store_id)}
                        disabled={isLocked}
                        className={`relative w-6 h-6 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none ${
                          isStoreAllSelected 
                            ? 'bg-blue-600 border-blue-600' 
                            : isStoreIndeterminate
                              ? 'bg-blue-600 border-blue-600'
                              : 'bg-white border-slate-300 hover:border-blue-400'
                        } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {isStoreAllSelected && (
                          <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        )}
                        {isStoreIndeterminate && (
                          <div className="w-3 h-0.5 bg-white rounded-full"></div>
                        )}
                      </button>
                      
                      <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center ml-2 shadow-sm">
                        <Store className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-bold text-slate-800 tracking-tight">{group.store_name}</span>
                      
                      {isLocked && (
                        <span className="ml-auto text-[10px] uppercase font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                          Terkunci
                        </span>
                      )}
                    </div>

                    {/* Items in this store */}
                    <div className="divide-y divide-slate-100">
                      {group.items.map((item) => {
                        const isSelected = selectedItems.includes(item.id);
                        
                        return (
                          <div key={item.id} className={`p-4 sm:p-5 flex gap-4 sm:gap-5 transition-colors ${isSelected ? 'bg-blue-50/10' : 'hover:bg-slate-50/50'}`}>
                            {/* Item Checkbox */}
                            <button 
                              onClick={() => handleToggleItem(item.id, group.store_id)}
                              disabled={isLocked}
                              className={`relative w-5 h-5 sm:w-6 sm:h-6 mt-8 sm:mt-10 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none shrink-0 ${
                                isSelected 
                                  ? 'bg-blue-600 border-blue-600 shadow-md shadow-blue-600/20' 
                                  : 'bg-white border-slate-300 hover:border-blue-400'
                              } ${isLocked ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                            >
                              {isSelected && (
                                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              )}
                            </button>

                            {/* Product Image */}
                            <div className="relative w-20 h-20 sm:w-24 sm:h-24 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200/60 shadow-sm">
                              <Image
                                src={item.product_image || "/tech_store.png"}
                                alt={item.product_name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            </div>

                            {/* Product Info */}
                            <div className="flex flex-col justify-between flex-grow min-w-0 py-0.5">
                              <div>
                                <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-tight mb-1.5 line-clamp-2">
                                  {item.product_name}
                                </h3>
                              </div>
                              <div className="flex flex-wrap items-end justify-between gap-2 mt-2">
                                <div>
                                  <div className="text-lg sm:text-xl font-black text-blue-950 tracking-tight">
                                    {formatCurrency(item.unit_price)}
                                  </div>
                                </div>
                                <div className="flex items-center gap-3">
                                  <div className="flex items-center border border-slate-200 rounded-lg bg-white overflow-hidden">
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.product_id, -1, item.quantity)}
                                      disabled={isUpdatingId === item.product_id}
                                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                    >
                                      -
                                    </button>
                                    <div className="px-3 py-1.5 text-xs font-bold text-slate-700 min-w-[2.5rem] text-center bg-slate-50 border-x border-slate-200">
                                      {isUpdatingId === item.product_id ? <Loader2 className="w-3 h-3 animate-spin mx-auto" /> : item.quantity}
                                    </div>
                                    <button 
                                      onClick={() => handleUpdateQuantity(item.product_id, 1, item.quantity)}
                                      disabled={isUpdatingId === item.product_id}
                                      className="px-3 py-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-50 transition-colors"
                                    >
                                      +
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary Sidebar */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg shadow-slate-200/40 sticky top-24">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Belanja</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">
                    Total Harga ({selectedCount} barang)
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(selectedSubtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">
                    Ongkos Kirim
                  </span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 font-medium">PPN 12%</span>
                  <span className="font-bold text-slate-900">
                    {formatCurrency(ppn)}
                  </span>
                </div>
              </div>

              <hr className="border-slate-100 mb-6" />

              <div className="flex justify-between items-center mb-8">
                <span className="text-base font-bold text-slate-900">Total Tagihan</span>
                <span className="text-2xl font-black text-blue-900 tracking-tight">
                  {formatCurrency(grandTotal)}
                </span>
              </div>

              {!hasSelected && (
                <div className="bg-slate-50 rounded-xl p-4 flex gap-3 mb-6 border border-slate-100">
                  <Info className="w-5 h-5 text-slate-400 shrink-0" />
                  <p className="text-xs font-medium text-slate-500 leading-relaxed">
                    Pilih barang yang ingin Anda beli terlebih dahulu.
                  </p>
                </div>
              )}

              <Button
                variant="primary"
                className="w-full py-4 text-base font-bold shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none disabled:cursor-not-allowed transition-all"
                onClick={handleCheckout}
                disabled={isCheckingOut || !hasSelected}
                icon={isCheckingOut ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
              >
                {isCheckingOut
                  ? "Memproses Checkout..."
                  : `Beli (${selectedCount})`}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
