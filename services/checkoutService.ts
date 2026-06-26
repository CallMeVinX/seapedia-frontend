import api from './api';

export interface CheckoutRequest {
  cart_item_ids: number[];
  address_id: number;
  delivery_method: string;
  voucher_code?: string;
}

export interface CheckoutResponse {
  order_id: number;
  subtotal: number;
  promo_discount_amount: number;
  voucher_discount_amount: number;
  delivery_fee: number;
  ppn_amount: number;
  final_total: number;
  message: string;
}

export interface ValidateVoucherRequest {
  voucher_code: string;
  subtotal: number;
}

export interface ValidateVoucherResponse {
  is_valid: boolean;
  code: string;
  amount: number;
  message: string;
}

export const checkoutService = {
  checkout: async (request: CheckoutRequest): Promise<CheckoutResponse> => {
    const response = await api.post<CheckoutResponse>('/buyer/checkout', request);
    return response.data;
  },
  validateVoucher: async (request: ValidateVoucherRequest): Promise<ValidateVoucherResponse> => {
    const response = await api.post<ValidateVoucherResponse>('/buyer/checkout/validate-voucher', request);
    return response.data;
  }
};
