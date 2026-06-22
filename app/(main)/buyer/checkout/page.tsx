"use client";

import { useEffect, useState, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/hooks/useAuthStore";
import { useCartStore } from "@/hooks/useCartStore";
import { cartService, CartResponse, CartItemResponse } from "@/services/cartService";
import { addressService, AddressResponse } from "@/services/addressService";
import { checkoutService } from "@/services/checkoutService";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Truck, Store, Loader2, CheckCircle2, Plus, Info } from "lucide-react";
import Button from "@/components/ui/Button";
import { showToast } from "@/utils/toast";

const DELIVERY_METHODS = [
  { id: "REGULAR", name: "Reguler", price: 10000, desc: "2-4 Hari Kerja" },
  { id: "NEXT_DAY", name: "Next Day", price: 15000, desc: "1 Hari Kerja" },
  { id: "INSTANT", name: "Instan", price: 20000, desc: "2-4 Jam" },
];

function CheckoutContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { token, user } = useAuthStore();
  const { fetchCartCount } = useCartStore();

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [storeName, setStoreName] = useState<string>("");
  const [addresses, setAddresses] = useState<AddressResponse[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<string>("REGULAR");
  
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newAddressText, setNewAddressText] = useState("");
  const [isAddingAddress, setIsAddingAddress] = useState(false);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      // 1. Parse items from URL
      const itemIdsParam = searchParams.get("items");
      if (!itemIdsParam) {
        showToast.error("Gagal", "Tidak ada barang yang dipilih.");
        router.push("/buyer/cart");
        return;
      }
      const itemIds = itemIdsParam.split(",").map(Number);

      // 2. Fetch cart and filter selected items
      const cartData = await cartService.getCart();
      const selected = cartData.items.filter(item => itemIds.includes(item.id));
      if (selected.length === 0) {
        showToast.error("Gagal", "Barang tidak ditemukan di keranjang.");
        router.push("/buyer/cart");
        return;
      }
      setCartItems(selected);
      setStoreName(selected[0].store_name);

      // 3. Fetch addresses
      const addrData = await addressService.getAddresses(token!);
      setAddresses(addrData);
      if (addrData.length > 0) {
        setSelectedAddressId(addrData[0].id);
      }
    } catch (error: any) {
      showToast.error("Gagal", error.response?.data?.detail || "Gagal memuat data checkout.");
      router.push("/buyer/cart");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAddress = async () => {
    if (!newAddressText.trim()) return;
    try {
      const added = await addressService.addAddress({ full_address: newAddressText }, token!);
      setAddresses([...addresses, added]);
      setSelectedAddressId(added.id);
      setNewAddressText("");
      setIsAddingAddress(false);
      showToast.success("Berhasil", "Alamat berhasil ditambahkan.");
    } catch (error) {
      showToast.error("Gagal", "Gagal menambahkan alamat.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      showToast.error("Gagal", "Silakan pilih alamat pengiriman.");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await checkoutService.checkout(
        {
          cart_item_ids: cartItems.map(i => i.id),
          address_id: selectedAddressId,
          delivery_method: deliveryMethod,
        },
        token!
      );

      showToast.success("Berhasil", `Pesanan berhasil dibuat! Total: ${formatCurrency(response.final_total)}`);
      fetchCartCount();
      // Normally redirect to an order success page or order history
      router.push("/buyer/dashboard");
    } catch (error: any) {
      showToast.error("Gagal", error.response?.data?.detail || "Gagal membuat pesanan.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-10 w-10 text-blue-900 animate-spin" />
      </div>
    );
  }

  const selectedCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const selectedSubtotal = cartItems.reduce((sum, item) => sum + item.total_price, 0);
  const deliveryFee = DELIVERY_METHODS.find(d => d.id === deliveryMethod)?.price || 0;
  const ppn = Math.round(selectedSubtotal * 0.12);
  const grandTotal = selectedSubtotal + deliveryFee + ppn;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <h1 className="text-2xl font-bold text-slate-900">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Address Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-bold text-slate-900">Alamat Pengiriman</h2>
              </div>
              
              {addresses.length === 0 && !isAddingAddress ? (
                <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl mb-4">
                  <p className="text-sm text-orange-800 mb-3">Anda belum memiliki alamat tersimpan.</p>
                  <Button variant="primary" onClick={() => setIsAddingAddress(true)} className="py-2 text-sm">
                    Tambah Alamat Baru
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id} 
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        selectedAddressId === addr.id ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`mt-1 w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                          selectedAddressId === addr.id ? 'border-blue-600' : 'border-slate-300'
                        }`}>
                          {selectedAddressId === addr.id && <div className="w-2 h-2 rounded-full bg-blue-600" />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{user?.full_name}</p>
                          <p className="text-sm text-slate-600 mt-1">{addr.full_address}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {!isAddingAddress && addresses.length > 0 && (
                    <button 
                      onClick={() => setIsAddingAddress(true)}
                      className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                      <Plus className="w-4 h-4" /> Tambah Alamat Lain
                    </button>
                  )}
                </div>
              )}

              {isAddingAddress && (
                <div className="mt-4 p-4 border border-slate-200 rounded-xl bg-slate-50">
                  <h3 className="text-sm font-bold text-slate-800 mb-2">Alamat Baru</h3>
                  <textarea
                    className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
                    rows={3}
                    placeholder="Masukkan alamat lengkap..."
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-3">
                    <Button variant="primary" className="py-2 px-4 text-sm" onClick={handleAddAddress}>Simpan</Button>
                    <Button variant="outline" className="py-2 px-4 text-sm" onClick={() => {
                      setIsAddingAddress(false);
                      setNewAddressText("");
                    }}>Batal</Button>
                  </div>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
                <Store className="w-5 h-5 text-slate-700" />
                <span className="font-bold text-slate-900">{storeName}</span>
              </div>
              <div className="divide-y divide-slate-100">
                {cartItems.map((item) => (
                  <div key={item.id} className="p-6 flex gap-5">
                    <div className="relative w-20 h-20 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200/60">
                      <Image
                        src={item.product_image || "/tech_store.png"}
                        alt={item.product_name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-between flex-grow py-0.5">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-2">{item.product_name}</h3>
                      <div className="flex items-end justify-between mt-2">
                        <div className="text-sm font-medium text-slate-500">
                          {item.quantity} x {formatCurrency(item.unit_price)}
                        </div>
                        <div className="text-lg font-black text-blue-950">
                          {formatCurrency(item.total_price)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Section */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <Truck className="w-5 h-5 text-green-600" />
                <h2 className="text-lg font-bold text-slate-900">Metode Pengiriman</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {DELIVERY_METHODS.map((method) => (
                  <div
                    key={method.id}
                    onClick={() => setDeliveryMethod(method.id)}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      deliveryMethod === method.id ? 'border-green-500 bg-green-50/30' : 'border-slate-100 hover:border-green-200'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">{method.name}</span>
                      {deliveryMethod === method.id && <CheckCircle2 className="w-5 h-5 text-green-500" />}
                    </div>
                    <p className="text-xs text-slate-500 mb-2">{method.desc}</p>
                    <p className="text-sm font-bold text-green-700">{formatCurrency(method.price)}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-lg shadow-slate-200/40 sticky top-24">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Ringkasan Pesanan</h3>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Total Harga ({selectedCount} barang)</span>
                <span className="font-bold text-slate-900">{formatCurrency(selectedSubtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Ongkos Kirim</span>
                <span className="font-bold text-slate-900">{formatCurrency(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">PPN 12%</span>
                <span className="font-bold text-slate-900">{formatCurrency(ppn)}</span>
              </div>
            </div>

            <hr className="border-slate-100 mb-6" />

            <div className="flex justify-between items-center mb-8">
              <span className="text-base font-bold text-slate-900">Total Tagihan</span>
              <span className="text-2xl font-black text-blue-900 tracking-tight">
                {formatCurrency(grandTotal)}
              </span>
            </div>

            <Button
              variant="primary"
              className="w-full py-4 text-base font-bold shadow-xl shadow-blue-900/20 disabled:opacity-50 disabled:shadow-none transition-all"
              onClick={handlePlaceOrder}
              disabled={isSubmitting || !selectedAddressId}
              icon={isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : undefined}
            >
              {isSubmitting ? "Memproses..." : "Buat Pesanan"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-blue-600" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
