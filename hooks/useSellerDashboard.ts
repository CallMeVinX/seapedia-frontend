import { useState, useEffect, useCallback } from 'react';
import { sellerService, StoreStatusResponse } from '@/services/sellerService';
import { OrderResponse } from '@/services/orderService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useSellerDashboard = () => {
  const { activeRole } = useAuthStore();
  const [storeStatus, setStoreStatus] = useState<StoreStatusResponse | null>(null);
  const [incomingOrders, setIncomingOrders] = useState<OrderResponse[]>([]);
  
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isCreatingStore, setIsCreatingStore] = useState(false);

  const checkStatus = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'SELLER') {
      setIsLoadingStatus(false);
      return;
    }
    try {
      const status = await sellerService.getStoreStatus();
      setStoreStatus(status);
    } catch (error) {
      console.error("Failed to check store status", error);
    } finally {
      setIsLoadingStatus(false);
    }
  }, [activeRole]);

  const loadIncomingOrders = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'SELLER') return;
    setIsLoadingOrders(true);
    try {
      const orders = await sellerService.getIncomingOrders();
      setIncomingOrders(orders);
    } catch (error) {
      console.error("Failed to load incoming orders", error);
    } finally {
      setIsLoadingOrders(false);
    }
  }, [activeRole]);

  useEffect(() => {
    checkStatus();
  }, [checkStatus]);

  useEffect(() => {
    if (storeStatus?.has_store) {
      loadIncomingOrders();
    }
  }, [storeStatus?.has_store, loadIncomingOrders]);

  const registerStore = async (storeName: string) => {
    if (!storeName.trim()) {
      showToast.error("Gagal", "Nama toko tidak boleh kosong.");
      return;
    }
    
    setIsCreatingStore(true);
    try {
      await sellerService.createStore({ store_name: storeName });
      showToast.success("Berhasil", "Toko Anda berhasil dibuat!");
      await checkStatus(); // Re-check status to flip the view
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal membuat toko.";
      showToast.error("Gagal", msg);
    } finally {
      setIsCreatingStore(false);
    }
  };

  return {
    storeStatus,
    incomingOrders,
    isLoadingStatus,
    isLoadingOrders,
    isCreatingStore,
    registerStore,
    refreshOrders: loadIncomingOrders,
    refreshStoreStatus: checkStatus
  };
};
