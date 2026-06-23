import { useState, useEffect, useCallback } from 'react';
import { trackingService, OrderStatusHistoryResponse } from '@/services/orderService';

export interface FormattedTrackingStep extends OrderStatusHistoryResponse {
  timeFormatted: string;
  isCompleted: boolean;
}

export const useOrderTracking = (orderId: string | number | undefined) => {
  const [trackingSteps, setTrackingSteps] = useState<FormattedTrackingStep[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTracking = useCallback(async () => {
    if (!orderId) return;
    try {
      setIsLoading(true);
      setError(null);
      const data = await trackingService.getHistory(orderId);
      
      const formattedData = data.map(step => ({
        ...step,
        timeFormatted: new Date(step.created_at).toLocaleString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        isCompleted: true
      }));
      
      setTrackingSteps(formattedData);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Gagal mengambil data pelacakan");
    } finally {
      setIsLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchTracking();
  }, [fetchTracking]);

  return { trackingSteps, isLoading, error, refreshTracking: fetchTracking };
};
