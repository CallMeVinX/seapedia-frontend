import api from './api';
import { OrderResponse } from './orderService';

export interface EarningsHistory {
  job_id: number;
  order_id: number;
  earning: number;
  completed_at: string;
}

export interface DriverEarningsResponse {
  total_earnings: number;
  history: EarningsHistory[];
}

export const driverService = {
  getAvailableJobs: async (): Promise<OrderResponse[]> => {
    const response = await api.get('/driver/jobs/available');
    return response.data;
  },

  getActiveJobs: async (): Promise<OrderResponse[]> => {
    const response = await api.get('/driver/jobs/active');
    return response.data;
  },

  takeJob: async (orderId: number) => {
    const response = await api.post(`/driver/deliveries/${orderId}/take`);
    return response.data;
  },

  completeJob: async (orderId: number) => {
    const response = await api.post(`/driver/deliveries/${orderId}/complete`);
    return response.data;
  },

  getEarnings: async (): Promise<DriverEarningsResponse> => {
    const response = await api.get('/driver/earnings');
    return response.data;
  }
};
