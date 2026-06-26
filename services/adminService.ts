import api from './api';

// ─────────────────────────────────────────────
// Response Types — Admin Dashboard
// ─────────────────────────────────────────────

export interface RecentOrderItem {
  id: number;
  store_name: string;
  buyer_name: string;
  current_status: string;
  final_total: number;
  created_at: string;
}

export interface AdminDashboardStats {
  users_count: number;
  stores_count: number;
  products_count: number;
  orders_count: number;
  delivery_jobs_count: number;
  overdue_orders_count: number;
  recent_orders: RecentOrderItem[];
  simulated_date: string;
}

// ─────────────────────────────────────────────
// Response Types — Discounts (Voucher & Promo)
// ─────────────────────────────────────────────

export type DiscountValueType = 'fixed' | 'percentage';

export interface DiscountItem {
  id: number;
  code: string;
  discount_value: number;
  discount_type: DiscountValueType;
  min_order_value: number;
  max_usage: number | null;
  current_usage: number;
  expiry_date: string;
  is_active: boolean;
  created_at: string;
}

export interface DiscountCreateRequest {
  code: string;
  discount_value: number;
  discount_type: DiscountValueType;
  min_order_value: number;
  max_usage: number | null;
  expiry_date: string;
}

export interface DiscountUpdateRequest {
  code?: string;
  discount_value?: number;
  discount_type?: DiscountValueType;
  min_order_value?: number;
  max_usage?: number | null;
  expiry_date?: string;
  is_active?: boolean;
}

// ─────────────────────────────────────────────
// Response Types — Simulate Next Day
// ─────────────────────────────────────────────

export interface RefundedOrderInfo {
  order_id: number;
  buyer_id: string;
  refund_amount: number;
  status: string;
}

export interface SimulateResponse {
  message: string;
  simulated_date: string;
  refunded_orders: RefundedOrderInfo[];
}

// ─────────────────────────────────────────────
// Admin Service Agent
// Satu-satunya file yang berkomunikasi dengan
// endpoint /admin/*. Komponen UI/Hooks DILARANG
// mengakses URL endpoint secara langsung.
// ─────────────────────────────────────────────

export const adminService = {
  /**
   * Fetch aggregated dashboard statistics.
   * Backend menggunakan query COUNT() agar ringan.
   */
  getDashboardStats: async (): Promise<AdminDashboardStats> => {
    const response = await api.get<AdminDashboardStats>('/admin/dashboard/stats');
    return response.data;
  },

  /**
   * Fetch list of vouchers.
   */
  getDiscounts: async (): Promise<DiscountItem[]> => {
    const response = await api.get<DiscountItem[]>('/admin/discounts');
    return response.data;
  },

  /**
   * Create a new voucher.
   */
  createDiscount: async (data: DiscountCreateRequest): Promise<DiscountItem> => {
    const response = await api.post<DiscountItem>('/admin/discounts', data);
    return response.data;
  },

  /**
   * Update an existing discount.
   */
  updateDiscount: async (id: number, data: DiscountUpdateRequest): Promise<DiscountItem> => {
    const response = await api.put<DiscountItem>(`/admin/discounts/${id}`, data);
    return response.data;
  },

  /**
   * Delete a discount permanently.
   */
  deleteDiscount: async (id: number): Promise<void> => {
    await api.delete(`/admin/discounts/${id}`);
  },

  /**
   * Trigger overdue simulation.
   * Backend akan:
   * 1. Mencari pesanan overdue (status "Sedang Dikemas", "Menunggu Pengirim", "Sedang Dikirim")
   *    yang sudah melewati batas SLA.
   * 2. Mengeksekusi refund dalam database transaction (rollback jika gagal).
   * 3. Mengembalikan daftar pesanan yang di-refund.
   */
  simulateNextDay: async (daysForward: number = 1, hoursForward: number = 0): Promise<SimulateResponse> => {
    const { data } = await api.post<SimulateResponse>('/admin/simulate-next-day', {
      days_forward: daysForward,
      hours_forward: hoursForward
    });
    return data;
  },
};
