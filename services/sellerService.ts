import api from './api';
import { OrderResponse } from './orderService';

export interface StoreStatusResponse {
  has_store: boolean;
  store_name?: string;
  store_id?: number;
  logo_url?: string;
}

export interface StoreCreateRequest {
  store_name: string;
}

export interface StoreResponse {
  id: number;
  seller_id: string;
  store_name: string;
  logo_url?: string;
  created_at: string;
}

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
}

export interface SellerProductResponse {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_name: string;
  image_url?: string;
  is_deleted: boolean;
}
export interface PromoCreateRequest {
  name: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  product_ids: number[];
}

export interface PromoResponse {
  id: number;
  store_id: number;
  name: string;
  discount_percentage: number;
  valid_from: string;
  valid_until: string;
  is_active: boolean;
  product_ids: number[];
}

export const sellerService = {
  getStoreStatus: async (): Promise<StoreStatusResponse> => {
    const response = await api.get('/seller/store/status');
    return response.data;
  },

  createStore: async (data: StoreCreateRequest): Promise<StoreResponse> => {
    const response = await api.post('/seller/store', data);
    return response.data;
  },

  updateStore: async (data: { store_name?: string; logo_url?: string }): Promise<StoreResponse> => {
    const response = await api.put('/seller/store', data);
    return response.data;
  },

  getIncomingOrders: async (status?: string): Promise<OrderResponse[]> => {
    let url = '/seller/orders/incoming';
    if (status) {
      url += `?status=${encodeURIComponent(status)}`;
    }
    const response = await api.get(url);
    return response.data;
  },

  updateOrderStatus: async (orderId: number, status: string): Promise<{message: string, new_status: string}> => {
    const response = await api.patch(`/orders/${orderId}/status`, { status });
    return response.data;
  },

  getSellerProducts: async (): Promise<SellerProductResponse[]> => {
    const response = await api.get('/seller/products');
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<SellerProductResponse> => {
    const response = await api.post('/seller/products', data);
    return response.data;
  },

  updateProduct: async (productId: number, data: ProductCreateRequest): Promise<SellerProductResponse> => {
    const response = await api.put(`/seller/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/seller/products/${productId}`);
  },

  // Promos
  getPromos: async (): Promise<PromoResponse[]> => {
    const response = await api.get('/seller/promos');
    return response.data;
  },

  createPromo: async (data: PromoCreateRequest): Promise<PromoResponse> => {
    const response = await api.post('/seller/promos', data);
    return response.data;
  },

  updatePromo: async (promoId: number, data: Partial<PromoCreateRequest> & { is_active?: boolean }): Promise<PromoResponse> => {
    const response = await api.put(`/seller/promos/${promoId}`, data);
    return response.data;
  },

  deletePromo: async (promoId: number): Promise<void> => {
    await api.delete(`/seller/promos/${promoId}`);
  }
};
