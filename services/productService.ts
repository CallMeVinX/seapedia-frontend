import api from './api';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  promo_price: number | null;
  stock: number;
  image_url: string | null;
  images: string[];
  store_name: string;
  store_avatar: string | null;
  category_name: string;
}

export const productService = {
  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<Product[]>('/products');
    return response.data;
  },

  getProductById: async (id: number): Promise<Product> => {
    const response = await api.get<Product>(`/products/${id}`);
    return response.data;
  }
};
