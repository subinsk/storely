import { api, endpoints } from "@storely/shared/lib/axios"
import { useMemo } from "react";
import useSWR from "swr";

// Enhanced types for products
export interface ProductVariant {
  id?: string;
  name: string;
  value: string;
  sku?: string;
  price?: number;
  comparePrice?: number;
  weight?: number;
  image?: string;
  position: number;
}

export interface ProductFormData {
  id?: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  comparePrice?: number;
  cost?: number;
  categoryId: string;
  status: 'draft' | 'active' | 'inactive' | 'archived';
  featured: boolean;
  trackQuantity: boolean;
  weight?: number;
  dimensions?: string;
  metaTitle?: string;
  metaDescription?: string;
  tags: string[];
  content?: string;
  images: string[];
  mrp: number;
  quantity: number;
  lowStockAlert?: number;
  variants: ProductVariant[];
  publishedAt?: Date;
}

export interface ProductFilters {
  search?: string;
  category?: string;
  status?: string;
  featured?: boolean;
  lowStock?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export function useGetProducts(params?: { id?: string; slug?: string; filters?: ProductFilters }) {
    const { id, slug, filters } = params || {};
    const productEndpoint = endpoints.product;

    // Build URL with filters
    let URL = productEndpoint;
    if (id) {
        URL = `${productEndpoint}?id=${id}`;
    } else if (slug) {
        URL = `${productEndpoint}?slug=${slug}`;
    } else if (filters) {
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        URL = `${productEndpoint}?${searchParams.toString()}`;
    }

    const { data, isLoading, error, isValidating, mutate } = useSWR(URL, async (url) => {
        const res = await api.get(url);
        return res.data;
    });

    const products = useMemo(() => {
        if (slug || id) {
            // Single product or product by slug returns the product directly
            return data?.data || null;
        } else {
            // List of products returns { products: [...], pagination: {...} }
            return Array.isArray(data?.data?.products) ? data.data.products : [];
        }
    }, [data, slug, id]);

    const memoizedValue = useMemo(
        () => ({
            productDetails: data?.data,
            products: Array.isArray(products) ? products : (products ? [products] : []),
            productsLoading: isLoading,
            productsError: error,
            productsValidating: isValidating,
            productsEmpty: !isLoading && (!products || (Array.isArray(products) ? products.length === 0 : !products)),
            refresh: mutate,
        }),
        [products, data?.data, error, isLoading, isValidating, mutate]
    );

    return memoizedValue;
}

// Enhanced product management functions
class ProductService {
  private baseURL = '/api/product';

  async createProduct(data: ProductFormData) {
    const response = await api.post(this.baseURL, data);
    return response.data?.data;
  }

  async getProducts(filters?: ProductFilters) {
    let url = this.baseURL;
    if (filters) {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, String(value));
        }
      });
      url = `${this.baseURL}?${searchParams.toString()}`;
    }
    const response = await api.get(url);
    return response.data?.data;
  }

  async getProduct(id: string) {
    const response = await api.get(`${this.baseURL}?id=${id}`);
    return response.data?.data;
  }

  async getProductBySlug(slug: string) {
    const response = await api.get(`${this.baseURL}?slug=${slug}`);
    return response.data?.data;
  }

  async updateProduct(id: string, data: Partial<ProductFormData>) {
    const response = await api.put(this.baseURL, { id, ...data });
    return response.data?.data;
  }

  async deleteProduct(id: string) {
    const response = await api.delete(this.baseURL, { data: { id } });
    return response.data?.data;
  }

  async bulkOperation(action: string, productIds: string[], data?: any) {
    const response = await api.post(`${this.baseURL}/bulk`, {
      action,
      productIds,
      data
    });
    return response.data?.data;
  }

  async getAnalytics(startDate?: string, endDate?: string) {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await api.get(`${this.baseURL}/bulk?${params.toString()}`);
    return response.data?.data;
  }
}

export const productService = new ProductService();

// Legacy functions for backward compatibility
export const createProduct = async (data: ProductFormData) => {
    const response = await api.post(endpoints.product, data)
    return response.data
}

export const getProducts = async (filters?: ProductFilters) => {
    let url = endpoints.product;
    if (filters) {
        const searchParams = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                searchParams.append(key, String(value));
            }
        });
        url = `${endpoints.product}?${searchParams.toString()}`;
    }
    const response = await api.get(url)
    return response.data
}

export const getProductById = async (id: string) => {
    const response = await api.get(`${endpoints.product}?id=${id}`)
    return response.data
}

export const updateProduct = async (data: any) => {
    const response = await api.put(endpoints.product, data)
    return response.data
}

export const deleteProduct = async (id: string) => {
    const response = await api.delete(endpoints.product, { data: { id } })
    return response.data
}

export const getProductBySlug = async (slug: string) => {
    const response = await api.get(`${endpoints.product}?slug=${slug}`)
    return response.data
}

// New enhanced functions
export const bulkUpdateProducts = async (products: Array<{ id: string; data: Partial<ProductFormData> }>) => {
    const response = await api.patch(`${endpoints.product}/bulk`, { products });
    return response.data;
}

export const bulkDeleteProducts = async (ids: string[]) => {
    const response = await api.delete(`${endpoints.product}/bulk`, { data: { ids } });
    return response.data;
}

export const importProducts = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await api.post(`${endpoints.product}/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
}

export const exportProducts = async (filters: ProductFilters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const response = await api.get(`${endpoints.product}/export?${params.toString()}`, {
        responseType: 'blob',
    });
    return response.data;
}

export const getLowStockProducts = async (threshold?: number) => {
    const params = threshold ? `?threshold=${threshold}` : '';
    const response = await api.get(`${endpoints.product}/low-stock${params}`);
    return response.data;
}

export const publishProduct = async (id: string) => {
    const response = await api.patch(`${endpoints.product}/${id}/publish`);
    return response.data;
}

export const unpublishProduct = async (id: string) => {
    const response = await api.patch(`${endpoints.product}/${id}/unpublish`);
    return response.data;
}

export const archiveProduct = async (id: string) => {
    const response = await api.patch(`${endpoints.product}/${id}/archive`);
    return response.data;
}

export const searchProducts = async (query: string, filters: ProductFilters = {}) => {
    const params = new URLSearchParams({ search: query });
    
    Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
        }
    });

    const response = await api.get(`${endpoints.product}/search?${params.toString()}`);
    return response.data;
}

export const getProductAnalytics = async (productId: string, dateRange?: { start: Date; end: Date }) => {
    const params = dateRange 
        ? `?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`
        : '';
    const response = await api.get(`${endpoints.product}/${productId}/analytics${params}`);
    return response.data;
}
