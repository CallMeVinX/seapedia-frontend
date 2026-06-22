import { useState, useEffect } from 'react';
import { Product, productService } from '@/services/productService';

export function useProductDetail(productId: string) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        setLoading(true);
        const data = await productService.getProductById(Number(productId));
        setProduct(data);
      } catch (err: any) {
        setError(err.response?.data?.detail || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  return { product, loading, error };
}
