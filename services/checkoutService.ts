import api from './api';

export interface CheckoutRequest {
  cart_item_ids: number[];
  address_id: number;
  delivery_method: string;
  discount_code?: string;
}

export interface CheckoutResponse {
  order_id: number;
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  ppn_amount: number;
  final_total: number;
  message: string;
}

export const checkoutService = {
  checkout: async (request: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await api.post<CheckoutResponse>('/buyer/checkout', request);
    return response.data;
  },
};
