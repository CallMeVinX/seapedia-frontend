import api from './api';

export interface CategoryResponse {
  id: number;
  name: string;
  slug: string;
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

export interface ProductCreateRequest {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category_id: number;
  image_url?: string;
}

export const sellerProductService = {
  getProducts: async (): Promise<SellerProductResponse[]> => {
    const response = await api.get('/seller/products');
    return response.data;
  },

  createProduct: async (data: ProductCreateRequest): Promise<SellerProductResponse> => {
    const response = await api.post('/seller/products', data);
    return response.data;
  },

  getCategories: async (): Promise<CategoryResponse[]> => {
    const response = await api.get('/categories');
    return response.data;
  },

  updateProduct: async (productId: number, data: ProductCreateRequest): Promise<SellerProductResponse> => {
    const response = await api.put(`/seller/products/${productId}`, data);
    return response.data;
  },

  deleteProduct: async (productId: number): Promise<void> => {
    await api.delete(`/seller/products/${productId}`);
  },

  uploadProductImage: async (file: File): Promise<{url: string}> => {
    const formData = new FormData();
    formData.append('file', file);
    
    // api (axios instance) automatically sets correct Content-Type boundary when sending FormData
    const response = await api.post('/seller/products/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
    return response.data;
  }
};
