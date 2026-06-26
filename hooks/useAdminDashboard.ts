import { useState, useEffect, useCallback } from 'react';
import { adminService, AdminDashboardStats, SimulateResponse } from '@/services/adminService';
import { showToast } from '@/utils/toast';
import { useAuthStore } from '@/hooks/useAuthStore';

/**
 * 🧠 Logical Agent: useAdminDashboard
 * 
 * Controller hook untuk halaman Admin Dashboard.
 * Mengelola state metrik, loading, dan aksi simulasi hari esok.
 * 
 * RULE: Hook ini adalah SATU-SATUNYA yang memanggil adminService
 *       untuk dashboard. Komponen UI tidak boleh import Service langsung.
 */
export const useAdminDashboard = () => {
  const { activeRole } = useAuthStore();

  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<SimulateResponse | null>(null);
  const [daysForward, setDaysForward] = useState<number>(0);
  const [hoursForward, setHoursForward] = useState<number>(0);

  /**
   * Fetch dashboard statistics dari backend.
   * Guard: Hanya fetch jika activeRole === 'ADMIN'.
   */
  const fetchStats = useCallback(async () => {
    if (activeRole?.toUpperCase() !== 'ADMIN') {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const data = await adminService.getDashboardStats();
      setStats(data);
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Gagal memuat statistik admin');
    } finally {
      setIsLoading(false);
    }
  }, [activeRole]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  /**
   * Trigger simulasi.
   * Backend akan menjalankan logika overdue refund secara transaksional.
   * Setelah berhasil, refresh dashboard stats.
   */
  const handleSimulate = useCallback(async () => {
    if (isSimulating) return; // Cegah double-click

    if (daysForward === 0 && hoursForward === 0) {
      showToast.error('Gagal', 'Masukkan jumlah hari atau jam untuk simulasi.');
      return;
    }

    try {
      setIsSimulating(true);
      setSimulationResult(null);
      const result = await adminService.simulateNextDay(daysForward, hoursForward);
      
      setSimulationResult(result);
      if (result.refunded_orders.length > 0) {
        showToast.success(
          'Simulasi Berhasil',
          `${result.refunded_orders.length} pesanan berhasil di-refund karena Overdue.`
        );
      } else {
        showToast.success('Simulasi Berhasil', 'Tidak ada pesanan yang melewati batas waktu.');
      }
      
      await fetchStats();
      setDaysForward(0);
      setHoursForward(0);
    } catch (err: any) {
      showToast.error('Simulasi Gagal', err.response?.data?.detail || 'Terjadi kesalahan sistem.');
    } finally {
      setIsSimulating(false);
    }
  }, [isSimulating, fetchStats, daysForward, hoursForward]);

  return {
    stats,
    isLoading,
    error,
    isSimulating,
    simulationResult,
    daysForward,
    setDaysForward,
    hoursForward,
    setHoursForward,
    handleSimulate,
    refreshStats: fetchStats,
  };
};
