import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from '../contexts/AuthContext';
import {
  CartUpdateData,
  OrderStatusUpdateData,
  InventoryUpdateData,
  AnalyticsUpdateData,
  SupportChatData,
  UserActivityData,
} from '../types/socket';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
  emitCartUpdate: (data: CartUpdateData) => void;
  emitOrderStatusChange: (data: OrderStatusUpdateData) => void;
  emitInventoryUpdate: (data: InventoryUpdateData) => void;
  emitAnalyticsUpdate: (data: AnalyticsUpdateData) => void;
  emitSupportMessage: (data: SupportChatData) => void;
  emitUserActivity: (data: UserActivityData) => void;
  joinSupportChat: (userId: string) => void;
  watchProduct: (productId: string) => void;
}

export function useSocket(): UseSocketReturn {
  const { user } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!user?.organizationId) return;

    const initializeSocket = async () => {
      try {
        // Initialize socket connection
        const newSocket = io(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000', {
          path: '/api/socketio',
          addTrailingSlash: false,
        });

        newSocket.on('connect', () => {
          console.log('Connected to Socket.IO server');
          setIsConnected(true);
          setError(null);
          
          // Join organization room for tenant isolation
          newSocket.emit('join-organization', user.organizationId);
        });

        newSocket.on('disconnect', () => {
          console.log('Disconnected from Socket.IO server');
          setIsConnected(false);
        });

        newSocket.on('connect_error', (err) => {
          console.error('Socket.IO connection error:', err);
          setError('Failed to connect to real-time server');
          setIsConnected(false);
        });

        socketRef.current = newSocket;
        setSocket(newSocket);
      } catch (err) {
        console.error('Socket initialization error:', err);
        setError('Failed to initialize real-time connection');
      }
    };

    initializeSocket();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        setIsConnected(false);
      }
    };
  }, [user?.organizationId]);

  const emitCartUpdate = (data: CartUpdateData) => {
    if (socket && isConnected) {
      socket.emit('cart-updated', data);
    }
  };

  const emitOrderStatusChange = (data: OrderStatusUpdateData) => {
    if (socket && isConnected) {
      socket.emit('order-status-changed', data);
    }
  };

  const emitInventoryUpdate = (data: InventoryUpdateData) => {
    if (socket && isConnected) {
      socket.emit('inventory-updated', data);
    }
  };

  const emitAnalyticsUpdate = (data: AnalyticsUpdateData) => {
    if (socket && isConnected) {
      socket.emit('analytics-update', data);
    }
  };

  const emitSupportMessage = (data: SupportChatData) => {
    if (socket && isConnected) {
      socket.emit('support-message', data);
    }
  };

  const emitUserActivity = (data: UserActivityData) => {
    if (socket && isConnected) {
      socket.emit('user-activity', data);
    }
  };

  const joinSupportChat = (userId: string) => {
    if (socket && isConnected && user?.organizationId) {
      socket.emit('join-support-chat', { 
        organizationId: user.organizationId, 
        userId 
      });
    }
  };

  const watchProduct = (productId: string) => {
    if (socket && isConnected && user?.id) {
      socket.emit('watch-product', { 
        productId, 
        userId: user.id 
      });
    }
  };

  return {
    socket,
    isConnected,
    error,
    emitCartUpdate,
    emitOrderStatusChange,
    emitInventoryUpdate,
    emitAnalyticsUpdate,
    emitSupportMessage,
    emitUserActivity,
    joinSupportChat,
    watchProduct,
  };
}

// Hook for listening to specific real-time events
export function useSocketListener<T = any>(
  eventName: string,
  callback: (data: T) => void,
  deps: any[] = []
) {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected) return;

    socket.on(eventName, callback);

    return () => {
      socket.off(eventName, callback);
    };
  }, [socket, isConnected, eventName, ...deps]);
}

// Specific hooks for common events
export function useCartUpdates(callback: (data: CartUpdateData) => void) {
  useSocketListener('cart-update', callback);
}

export function useOrderStatusUpdates(callback: (data: OrderStatusUpdateData) => void) {
  useSocketListener('order-status-update', callback);
}

export function useInventoryUpdates(callback: (data: InventoryUpdateData) => void) {
  useSocketListener('inventory-update', callback);
}

export function useAnalyticsUpdates(callback: (data: AnalyticsUpdateData) => void) {
  useSocketListener('analytics-updated', callback);
}

export function useSupportChatMessages(callback: (data: SupportChatData) => void) {
  useSocketListener('support-message-received', callback);
}

export function useProductAvailability(callback: (data: any) => void) {
  useSocketListener('product-available', callback);
}

export function useLiveActivity(callback: (data: any) => void) {
  useSocketListener('live-activity', callback);
}
