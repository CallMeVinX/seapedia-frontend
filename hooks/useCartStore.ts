import { create } from 'zustand';
import { cartService } from '@/services/cartService';

interface CartState {
  totalItems: number;
  fetchCartCount: () => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 0,
  fetchCartCount: async () => {
    try {
      const cart = await cartService.getCart();
      set({ totalItems: cart.total_items });
    } catch (error) {
      console.error("Failed to fetch cart count", error);
      set({ totalItems: 0 });
    }
  }
}));
