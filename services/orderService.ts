import api from './api';

export interface OrderStatusHistoryResponse {
  id: number;
  status_name: string;
  changed_by_user_id?: string;
  changed_by_role?: string;
  created_at: string;
}

export interface OrderItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  product_image?: string;
}

export interface OrderResponse {
  id: number;
  store_name: string;
  current_status: string;
  final_total: number;
  delivery_fee: number;
  shipping_address?: string;
  created_at: string;
  items: OrderItemResponse[];
}

export const trackingService = {
  getHistory: async (orderId: string | number): Promise<OrderStatusHistoryResponse[]> => {
    const response = await api.get(`/orders/${orderId}/tracking`);
    return response.data;
  },
  
  updateStatus: async (orderId: string | number, status: string) => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  takeDeliveryJob: async (orderId: string | number) => {
    const response = await api.post(`/driver/deliveries/${orderId}/take`);
    return response.data;
  },

  getBuyerOrders: async (): Promise<OrderResponse[]> => {
    const response = await api.get(`/buyer/orders`);
    return response.data;
  },

  getBuyerOrder: async (orderId: string | number): Promise<OrderResponse> => {
    const response = await api.get(`/buyer/orders/${orderId}`);
    return response.data;
  },

  cancelBuyerOrder: async (orderId: string | number) => {
    const response = await api.post(`/buyer/orders/${orderId}/cancel`);
    return response.data;
  },

  payOrder: async (orderId: string | number) => {
    const response = await api.post(`/buyer/orders/${orderId}/pay`);
    return response.data;
  }
};
