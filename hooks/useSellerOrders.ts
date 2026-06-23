import { useState, useEffect, useCallback } from 'react';
import { sellerService } from '@/services/sellerService';
import { OrderResponse } from '@/services/orderService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useSellerOrders = (statusFilter?: string) => {
  const { activeRole } = useAuthStore();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const loadOrders = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'SELLER') return;
    setIsLoading(true);
    try {
      const data = await sellerService.getIncomingOrders(statusFilter);
      setOrders(data);
    } catch (error) {
      console.error("Failed to load seller orders", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeRole, statusFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const processOrder = async (orderId: number) => {
    setProcessingId(orderId);
    try {
      await sellerService.updateOrderStatus(orderId, 'Menunggu Pengirim');
      showToast.success("Berhasil", "Pesanan berhasil diproses, menunggu kurir.");
      await loadOrders();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal memproses pesanan.";
      showToast.error("Gagal", msg);
      return false;
    } finally {
      setProcessingId(null);
    }
  };

  return {
    orders,
    isLoading,
    processingId,
    processOrder,
    refreshOrders: loadOrders
  };
};
