'use client';

import { useState, useEffect, useCallback } from 'react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  comparePrice: number | null;
  sku: string | null;
  isActive: boolean;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
  category: {
    id: string;
    name: string;
  } | null;
  images: Array<{
    id: string;
    url: string;
    alt: string | null;
    isPrimary: boolean;
  }>;
  _count: {
    orderItems: number;
  };
}

interface ProductsResponse {
  products: Product[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

interface UseProductsProps {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  status?: string;
}

export function useProducts({ 
  page = 1, 
  limit = 10, 
  search = '', 
  category = '', 
  status = '' 
}: UseProductsProps = {}) {
  const [data, setData] = useState<ProductsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(category && { category }),
        ...(status && { status })
      });

      const response = await fetch(`/api/products?${params}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      const productsData = await response.json();
      setData(productsData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Products fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const refetch = useCallback(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { data, loading, error, refetch };
}

export function useProduct(id: string) {
  const [data, setData] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        
        const product = await response.json();
        setData(product);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Product fetch error:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { data, loading, error };
}
