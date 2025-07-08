import { useMemo } from 'react';
import useSWR from 'swr';
import { useOrganization } from '../contexts/OrganizationContext';
import type { ProductFilters, ProductSearchResponse } from '../types';

// React hooks for client-side usage - API calls only
export function useGetProducts(filters?: ProductFilters) {
  const { organization } = useOrganization();
  
  const queryParams = new URLSearchParams();
  if (filters?.categoryId) queryParams.set('categoryId', filters.categoryId);
  if (filters?.categorySlug) queryParams.set('categorySlug', filters.categorySlug);
  if (filters?.search) queryParams.set('search', filters.search);
  if (filters?.minPrice !== undefined) queryParams.set('minPrice', filters.minPrice.toString());
  if (filters?.maxPrice !== undefined) queryParams.set('maxPrice', filters.maxPrice.toString());
  if (filters?.featured !== undefined) queryParams.set('featured', filters.featured.toString());
  if (filters?.sortBy) queryParams.set('sortBy', filters.sortBy);
  if (filters?.sortOrder) queryParams.set('sortOrder', filters.sortOrder);
  if (filters?.page) queryParams.set('page', filters.page.toString());
  if (filters?.limit) queryParams.set('limit', filters.limit.toString());
  
  const URL = organization?.id ? `/api/products?${queryParams.toString()}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      products: data?.products || [],
      total: data?.total || 0,
      page: data?.page || 1,
      limit: data?.limit || 12,
      totalPages: data?.totalPages || 0,
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetProduct(params?: { id?: string; slug?: string }) {
  const { organization } = useOrganization();
  const { id, slug } = params || {};
  
  const URL = organization?.id && (slug || id) ? `/api/products/${slug || id}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch product');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      product: data?.data || null,
      productLoading: isLoading,
      productError: error,
      productValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetFeaturedProducts(limit?: number) {
  const { organization } = useOrganization();
  
  const URL = organization?.id ? `/api/products/featured?limit=${limit || 8}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch featured products');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useSearchProducts(query: string) {
  const { organization } = useOrganization();
  
  const URL = organization?.id && query ? `/api/products/search?q=${encodeURIComponent(query)}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to search products');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}

export function useGetRelatedProducts(productId: string, limit?: number) {
  const { organization } = useOrganization();
  
  const URL = organization?.id && productId ? `/api/products/related/${productId}?limit=${limit || 4}` : null;

  const { data, isLoading, error, isValidating } = useSWR(URL, async (url) => {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch related products');
    return response.json();
  });

  const memoizedValue = useMemo(
    () => ({
      products: data?.data || [],
      productsLoading: isLoading,
      productsError: error,
      productsValidating: isValidating,
    }),
    [data?.data, error, isLoading, isValidating]
  );

  return memoizedValue;
}
