"use client";

import { useEffect, useState, useMemo } from "react";
import { cartService, CartResponse, CartItemResponse } from "@/services/cartService";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ShoppingBag, Loader2 } from "lucide-react";
import Button from "@/components/ui/Button";
import { showToast } from "@/utils/toast";

import { EmptyState } from "@/components/ui/EmptyState";
import { OrderSummaryCard } from "@/components/order/OrderSummaryCard";
import { CartStoreGroup } from "@/components/cart/CartStoreGroup";
import { CartItemRow } from "@/components/cart/CartItemRow";

interface StoreGroup {
  store_id: number;
  store_name: string;
  items: CartItemResponse[];
}

export default function CartPage() {
  const { user } = useAuthStore();
  const { fetchCartCount } = useCartStore();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const router = useRouter();
  const [isUpdatingId, setIsUpdatingId] = useState<number | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const loadCart = async () => {
    if (!user) return;
    try {
      const data = await cartService.getCart();
      setCart(data);
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
  }, [user]);

  const handleUpdateQuantity = async (productId: number, delta: number, currentQty: number) => {
    if (!user) return;
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

  const handleToggleItem = (itemId: number) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId) 
        : [...prev, itemId]
    );
  };

  const handleToggleStore = (storeId: number) => {
    const storeItems = cart?.items.filter(i => i.store_id === storeId).map(i => i.id) || [];
    const allSelected = storeItems.every(id => selectedItems.includes(id));

    if (allSelected) {
      setSelectedItems(prev => prev.filter(id => !storeItems.includes(id)));
    } else {
      setSelectedItems(prev => {
        const newSelection = [...prev];
        storeItems.forEach(id => {
          if (!newSelection.includes(id)) newSelection.push(id);
        });
        return newSelection;
      });
    }
  };

  const handleCheckout = () => {
    if (!user || !cart || selectedItems.length === 0) return;
    setIsCheckingOut(true);
    router.push(`/buyer/checkout?items=${selectedItems.join(",")}`);
  };

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col justify-center bg-slate-50 p-6">
        <EmptyState 
          icon={ShoppingBag}
          title="Keranjang Belanja"
          description="Silakan login untuk melihat keranjang Anda."
          iconTextColor="text-slate-300"
          iconBgColor="bg-slate-100"
          action={
            <Link href="/login">
              <Button variant="primary" className="px-8">Login Sekarang</Button>
            </Link>
          }
        />
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

  const selectedCartItems = cart?.items.filter(item => selectedItems.includes(item.id)) || [];
  const selectedCount = selectedCartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedSubtotal = selectedCartItems.reduce((sum, item) => sum + item.total_price, 0);
  const hasSelected = selectedItems.length > 0;
  const deliveryFee = hasSelected ? 10000 : 0;
  const ppn = Math.round(selectedSubtotal * 0.12);
  const grandTotal = selectedSubtotal + deliveryFee + ppn;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
          <EmptyState 
            icon={ShoppingBag}
            title="Keranjang Anda Kosong"
            description="Temukan berbagai produk kelautan terbaik di katalog kami dan mulai berbelanja."
            action={
              <Link href="/products">
                <Button variant="primary" className="px-8">Mulai Belanja</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-6">
              {storeGroups.map((group) => {
                const storeItemIds = group.items.map(i => i.id);
                const isStoreAllSelected = storeItemIds.length > 0 && storeItemIds.every(id => selectedItems.includes(id));
                const isStoreIndeterminate = !isStoreAllSelected && storeItemIds.some(id => selectedItems.includes(id));

                return (
                  <CartStoreGroup 
                    key={group.store_id}
                    storeId={group.store_id}
                    storeName={group.store_name}
                    isAllSelected={isStoreAllSelected}
                    isIndeterminate={isStoreIndeterminate}
                    onToggleStore={handleToggleStore}
                  >
                    {group.items.map((item) => (
                      <CartItemRow 
                        key={item.id}
                        item={item as any}
                        storeId={group.store_id}
                        isSelected={selectedItems.includes(item.id)}
                        isUpdating={isUpdatingId === item.product_id}
                        onToggleItem={handleToggleItem}
                        onUpdateQuantity={handleUpdateQuantity}
                      />
                    ))}
                  </CartStoreGroup>
                );
              })}
            </div>

            <OrderSummaryCard 
              totalItems={selectedCount}
              subtotal={selectedSubtotal}
              deliveryFee={deliveryFee}
              ppn={ppn}
              grandTotal={grandTotal}
              buttonText={`Beli (${selectedCount})`}
              onButtonClick={handleCheckout}
              isLoading={isCheckingOut}
              isDisabled={!hasSelected}
              infoMessage={!hasSelected ? "Pilih barang yang ingin Anda beli terlebih dahulu." : undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}
