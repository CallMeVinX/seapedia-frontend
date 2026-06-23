import { useState, useCallback, useEffect } from 'react';
import { driverService, DriverEarningsResponse } from '@/services/driverService';
import { OrderResponse } from '@/services/orderService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

export const useDriver = () => {
  const { activeRole } = useAuthStore();
  const [availableJobs, setAvailableJobs] = useState<OrderResponse[]>([]);
  const [activeJobs, setActiveJobs] = useState<OrderResponse[]>([]);
  const [earnings, setEarnings] = useState<DriverEarningsResponse | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isTakingJob, setIsTakingJob] = useState<number | null>(null);
  const [isCompletingJob, setIsCompletingJob] = useState<number | null>(null);

  const isDriver = activeRole?.toUpperCase() === 'DRIVER';

  const loadDashboardData = useCallback(async () => {
    if (!isDriver) return;
    setIsLoading(true);
    try {
      const [available, active, earningsData] = await Promise.all([
        driverService.getAvailableJobs(),
        driverService.getActiveJobs(),
        driverService.getEarnings()
      ]);
      setAvailableJobs(available);
      setActiveJobs(active);
      setEarnings(earningsData);
    } catch (error) {
      console.error("Failed to load driver dashboard data", error);
    } finally {
      setIsLoading(false);
    }
  }, [isDriver]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const takeJob = async (orderId: number) => {
    setIsTakingJob(orderId);
    try {
      await driverService.takeJob(orderId);
      showToast.success("Berhasil", "Pekerjaan berhasil diambil!");
      await loadDashboardData();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal mengambil pekerjaan. Mungkin sudah diambil pengemudi lain.";
      showToast.error("Gagal", msg);
      // reload in case job was taken by someone else
      await loadDashboardData();
      return false;
    } finally {
      setIsTakingJob(null);
    }
  };

  const completeJob = async (orderId: number) => {
    setIsCompletingJob(orderId);
    try {
      await driverService.completeJob(orderId);
      showToast.success("Selesai", "Pekerjaan diselesaikan. Pendapatan telah ditambahkan!");
      await loadDashboardData();
      return true;
    } catch (error: any) {
      const msg = error.response?.data?.detail || "Gagal menyelesaikan pekerjaan.";
      showToast.error("Gagal", msg);
      return false;
    } finally {
      setIsCompletingJob(null);
    }
  };

  return {
    availableJobs,
    activeJobs,
    earnings,
    isLoading,
    isTakingJob,
    isCompletingJob,
    takeJob,
    completeJob,
    refreshData: loadDashboardData
  };
};
