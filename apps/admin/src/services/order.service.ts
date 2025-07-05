import { api, endpoints } from "@storely/shared/lib/axios";
import { useMemo } from "react";
import useSWR from "swr";

// Enhanced types for orders
export interface OrderItem {
  id?: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  subtotal: number;
  product?: {
    id: string;
    name: string;
    image?: string;
    sku?: string;
  };
  variant?: {
    id: string;
    name: string;
    value: string;
  };
}

export interface OrderFormData {
  id?: string;
  orderNumber?: string;
  customerId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partial';
  shippingStatus: 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
  items: OrderItem[];
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  shippingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  billingAddress?: {
    fullName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
  paymentMethod?: string;
  notes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  tags?: string[];
}

export interface OrderFilters {
  search?: string;
  status?: string;
  paymentStatus?: string;
  shippingStatus?: string;
  customerId?: string;
  startDate?: Date;
  endDate?: Date;
  minAmount?: number;
  maxAmount?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface OrderAnalytics {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  conversionRate: number;
  topProducts: Array<{
    productId: string;
    name: string;
    quantity: number;
    revenue: number;
  }>;
  statusDistribution: Record<string, number>;
  paymentStatusDistribution?: Record<string, number>;
  revenueByPeriod: Array<{
    period: string;
    revenue: number;
    orders: number;
  }>;
}

export function useGetOrders(params?: { id?: string; filters?: OrderFilters }) {
  const { id, filters } = params || {};
  const orderEndpoint = endpoints.order;

  // Build URL with filters
  let URL = orderEndpoint;
  if (id) {
    URL = `${orderEndpoint}/${id}`;
  } else if (filters) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    URL = `${orderEndpoint}?${searchParams.toString()}`;
  }

  const { data, isLoading, error, isValidating, mutate } = useSWR(URL, async (url: string) => {
    const res = await api.get(url);
    return res.data;
  });

  const orders = useMemo(() => {
    if (id) {
      return data?.data;
    } else {
      return data?.data || [];
    }
  }, [data, id]);

  const memoizedValue = useMemo(
    () => ({
      orderDetails: id ? data?.data : null,
      orders: id ? [] : orders,
      ordersLoading: isLoading,
      ordersError: error,
      ordersValidating: isValidating,
      ordersEmpty: !isLoading && !orders.length,
      refresh: mutate,
    }),
    [orders, data?.data, error, isLoading, isValidating, mutate, id]
  );

  return memoizedValue;
}

// Enhanced order management functions
export const createOrder = async (data: OrderFormData) => {
  const response = await api.post(endpoints.order, data);
  return response.data;
};

export const getOrders = async (filters?: OrderFilters) => {
  let url = endpoints.order;
  if (filters) {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (value instanceof Date) {
          searchParams.append(key, value.toISOString());
        } else {
          searchParams.append(key, String(value));
        }
      }
    });
    url = `${endpoints.order}?${searchParams.toString()}`;
  }
  const response = await api.get(url);
  return response.data;
};

export const getOrderById = async (id: string) => {
  const response = await api.get(`${endpoints.order}/${id}`);
  return response.data;
};

export const updateOrder = async (id: string, data: Partial<OrderFormData>) => {
  const response = await api.put(`${endpoints.order}/${id}`, data);
  return response.data;
};

export const deleteOrder = async (id: string) => {
  const response = await api.delete(`${endpoints.order}/${id}`);
  return response.data;
};

// Order status management
export const updateOrderStatus = async (id: string, status: OrderFormData['status']) => {
  const response = await api.patch(`${endpoints.order}/${id}/status`, { status });
  return response.data;
};

export const updatePaymentStatus = async (id: string, paymentStatus: OrderFormData['paymentStatus']) => {
  const response = await api.patch(`${endpoints.order}/${id}/payment-status`, { paymentStatus });
  return response.data;
};

export const updateShippingStatus = async (id: string, shippingStatus: OrderFormData['shippingStatus'], trackingNumber?: string) => {
  const response = await api.patch(`${endpoints.order}/${id}/shipping-status`, { 
    shippingStatus, 
    trackingNumber 
  });
  return response.data;
};

// Bulk operations
export const bulkUpdateOrders = async (orders: Array<{ id: string; data: Partial<OrderFormData> }>) => {
  const response = await api.patch(`${endpoints.order}/bulk`, { orders });
  return response.data;
};

export const bulkDeleteOrders = async (ids: string[]) => {
  const response = await api.delete(`${endpoints.order}/bulk`, { data: { ids } });
  return response.data;
};

// Order fulfillment
export const fulfillOrder = async (id: string, items: Array<{ orderItemId: string; quantity: number }>) => {
  const response = await api.post(`${endpoints.order}/${id}/fulfill`, { items });
  return response.data;
};

export const shipOrder = async (id: string, data: {
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: Date;
  notifyCustomer?: boolean;
}) => {
  const response = await api.post(`${endpoints.order}/${id}/ship`, data);
  return response.data;
};

export const cancelOrder = async (id: string, reason?: string) => {
  const response = await api.post(`${endpoints.order}/${id}/cancel`, { reason });
  return response.data;
};

export const refundOrder = async (id: string, data: {
  amount: number;
  reason: string;
  refundShipping?: boolean;
  notifyCustomer?: boolean;
}) => {
  const response = await api.post(`${endpoints.order}/${id}/refund`, data);
  return response.data;
};

// Order analytics and reports
export const getOrderAnalytics = async (dateRange?: { start: Date; end: Date }) => {
  const params = dateRange 
    ? `?start=${dateRange.start.toISOString()}&end=${dateRange.end.toISOString()}`
    : '';
  const response = await api.get(`${endpoints.order}/analytics${params}`);
  return response.data;
};

export const getOrderReports = async (type: 'sales' | 'products' | 'customers', filters?: OrderFilters) => {
  const params = filters 
    ? `?${new URLSearchParams(filters as any).toString()}`
    : '';
  const response = await api.get(`${endpoints.order}/reports/${type}${params}`);
  return response.data;
};

export const exportOrders = async (filters: OrderFilters = {}) => {
  const params = new URLSearchParams();
  
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (value instanceof Date) {
        params.append(key, value.toISOString());
      } else {
        params.append(key, String(value));
      }
    }
  });

  const response = await api.get(`${endpoints.order}/export?${params.toString()}`, {
    responseType: 'blob',
  });
  return response.data;
};

// Invoice management
export const generateInvoice = async (orderId: string) => {
  const response = await api.post(`${endpoints.order}/${orderId}/invoice`);
  return response.data;
};

export const sendInvoice = async (orderId: string, email?: string) => {
  const response = await api.post(`${endpoints.order}/${orderId}/invoice/send`, { email });
  return response.data;
};

// Customer communication
export const sendOrderNotification = async (orderId: string, type: 'confirmation' | 'shipped' | 'delivered' | 'cancelled') => {
  const response = await api.post(`${endpoints.order}/${orderId}/notify`, { type });
  return response.data;
};

export const addOrderNote = async (orderId: string, note: string, isInternal: boolean = true) => {
  const response = await api.post(`${endpoints.order}/${orderId}/notes`, { note, isInternal });
  return response.data;
};

export const getOrderNotes = async (orderId: string) => {
  const response = await api.get(`${endpoints.order}/${orderId}/notes`);
  return response.data;
};

// Return/Exchange management
export const createReturn = async (orderId: string, data: {
  items: Array<{ orderItemId: string; quantity: number; reason: string }>;
  type: 'return' | 'exchange';
  refundAmount?: number;
}) => {
  const response = await api.post(`${endpoints.order}/${orderId}/returns`, data);
  return response.data;
};

export const processReturn = async (returnId: string, status: 'approved' | 'rejected', notes?: string) => {
  const response = await api.patch(`${endpoints.order}/returns/${returnId}`, { status, notes });
  return response.data;
};
