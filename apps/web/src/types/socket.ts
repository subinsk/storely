import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import { Server as ServerIO } from 'socket.io';

export type NextApiResponseServerIO = NextApiResponse & {
  socket: {
    server: NetServer & {
      io: ServerIO;
    };
  };
};

export interface CartUpdateData {
  organizationId: string;
  userId: string;
  cartId: string;
  items: any[];
  total: number;
}

export interface OrderStatusUpdateData {
  organizationId: string;
  orderId: string;
  status: string;
  userId: string;
}

export interface InventoryUpdateData {
  organizationId: string;
  productId: string;
  quantity: number;
  isAvailable: boolean;
}

export interface AnalyticsUpdateData {
  organizationId: string;
  type: 'revenue' | 'order' | 'customer' | 'product';
  data: any;
  timestamp: Date;
}

export interface SupportChatData {
  organizationId: string;
  userId: string;
  message: string;
  timestamp: Date;
  isFromSupport?: boolean;
}

export interface UserActivityData {
  organizationId: string;
  userId: string;
  action: string;
  data?: any;
  timestamp: Date;
}

export interface ProductWatchData {
  productId: string;
  userId: string;
}

export interface ProductAvailabilityData {
  productId: string;
  isAvailable: boolean;
  quantity: number;
  organizationId: string;
}
