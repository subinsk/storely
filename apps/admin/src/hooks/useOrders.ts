import { useMemo } from 'react';
import useSWR from 'swr';

export interface OrderFilters {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string | null;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    sku?: string | null;
    images?: any;
  };
  variant?: {
    id: string;
    name: string;
    value: string;
  } | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customer: {
    id: string;
    name: string;
    email: string;
    avatar?: string | null;
    phone?: string | null;
  };
  status: string;
  paymentStatus: string;
  shippingStatus: string;
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  totalQuantity: number;
  items: OrderItem[];
  shippingAddress?: any;
  billingAddress?: any;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
  processedAt?: string | null;
  shippedAt?: string | null;
  deliveredAt?: string | null;
}

const fetcher = async (url: string) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch');
  }
  return response.json();
};

export function useOrders(filters?: OrderFilters) {
  // Build URL with filters
  const searchParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        searchParams.append(key, String(value));
      }
    });
  }
  
  const url = `/api/orders${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      orders: data?.orders || [],
      pagination: data?.pagination,
      ordersLoading: isLoading,
      ordersError: error,
      ordersEmpty: !isLoading && !data?.orders?.length,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

export function useOrder(id: string) {
  const url = id ? `/api/orders/${id}` : null;

  const { data, error, isLoading, mutate } = useSWR(url, fetcher);

  const memoizedValue = useMemo(
    () => ({
      order: data || null,
      orderLoading: isLoading,
      orderError: error,
      refresh: mutate,
    }),
    [data, error, isLoading, mutate]
  );

  return memoizedValue;
}

// Order management functions
export const createOrder = async (data: any) => {
  const response = await fetch('/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
};

export const updateOrder = async (id: string, data: any) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update order');
  }

  return response.json();
};

export const deleteOrder = async (id: string) => {
  const response = await fetch(`/api/orders/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete order');
  }

  return response.json();
};

export const bulkDeleteOrders = async (ids: string[]) => {
  // Note: You might want to implement a bulk delete endpoint
  // For now, we'll delete them one by one
  const promises = ids.map(id => deleteOrder(id));
  return Promise.all(promises);
};
