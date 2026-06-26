import api from './api';

export interface CartItemRequest {
  product_id: number;
  quantity: number;
  replace_cart?: boolean;
}

export interface CartItemResponse {
  id: number;
  product_id: number;
  product_name: string;
  product_image?: string;
  store_id: number;
  store_name: string;
  quantity: number;
  unit_price: number;
  promo_price?: number;
  total_price: number;
}

export interface CartResponse {
  id: number;
  buyer_id: string;
  items: CartItemResponse[];
  total_items: number;
  total_price: number;
}

export const cartService = {
  getCart: async (): Promise<CartResponse> => {
    const response = await api.get('/buyer/cart');
    return response.data;
  },

  addToCart: async (data: CartItemRequest): Promise<CartResponse> => {
    const response = await api.post('/buyer/cart', data);
    return response.data;
  },

  clearCart: async (): Promise<{message: string}> => {
    const response = await api.delete('/buyer/cart');
    return response.data;
  },

  removeFromCart: async (productId: number): Promise<{message: string}> => {
    const response = await api.delete(`/buyer/cart/items/${productId}`);
    return response.data;
  }
};
