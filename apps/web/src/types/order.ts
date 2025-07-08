export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  organizationId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded' | 'partially_refunded';
  shippingStatus: 'pending' | 'preparing' | 'shipped' | 'in_transit' | 'delivered' | 'returned';
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  notes?: string;
  paymentMethod?: string;
  shippingAddress?: ShippingAddress;
  billingAddress?: BillingAddress;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
  processedAt?: Date;
  shippedAt?: Date;
  deliveredAt?: Date;
}

export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  total: number;
  product: {
    id: string;
    name: string;
    slug: string;
    images: string[];
    sku: string;
  };
  variant?: {
    id: string;
    name: string;
    value: string;
    sku?: string;
  };
}

export interface ShippingAddress {
  name: string;
  phone: string;
  street: string;
  house?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  pincode?: string;
  additionalInfo?: string;
}

export interface BillingAddress {
  name: string;
  phone: string;
  street: string;
  house?: string;
  landmark?: string;
  city: string;
  state: string;
  country: string;
  zip: string;
  pincode?: string;
  additionalInfo?: string;
}

export interface CreateOrderRequest {
  shippingAddressId: string;
  billingAddressId?: string;
  paymentMethod: string;
  notes?: string;
  couponCode?: string;
}

export interface OrderSummary {
  subtotal: number;
  taxAmount: number;
  shippingAmount: number;
  discountAmount: number;
  totalAmount: number;
  currency: string;
  estimatedDelivery?: Date;
}

export interface OrderTracking {
  orderId: string;
  status: string;
  timeline: OrderTrackingEvent[];
}

export interface OrderTrackingEvent {
  id: string;
  status: string;
  description: string;
  timestamp: Date;
  location?: string;
}
