import api from './api';
import { Product } from './productService';

export interface AdminStatsResponse {
  users_count: number;
  stores_count: number;
  products_count: number;
  orders_count: number;
  delivery_jobs_count: number;
  overdue_orders_count: number;
  recent_orders: {
    id: number;
    store_name: string;
    buyer_name: string;
    current_status: string;
    final_total: number;
    created_at: string;
  }[];
  simulated_date: string;
}

export interface OrderQueueItem {
  id: string;
  status: string;
  total: number;
}

export interface SellerStatsResponse {
  total_sales: number;
  orders_queue: OrderQueueItem[];
  products: Product[];
}

export interface DriverJobItem {
  order_id: string;
  pickup: string;
  dropoff: string;
  fee: number;
}

export const dashboardService = {
  getAdminStats: async (): Promise<AdminStatsResponse> => {
    const response = await api.get<AdminStatsResponse>('/admin/dashboard/stats');
    return response.data;
  },

  getSellerDashboard: async (): Promise<SellerStatsResponse> => {
    const response = await api.get<SellerStatsResponse>('/seller/dashboard/stats');
    return response.data;
  },

  getDriverAvailableJobs: async (): Promise<DriverJobItem[]> => {
    const response = await api.get<DriverJobItem[]>('/driver/jobs/available');
    return response.data;
  },
};
