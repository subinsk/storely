import { Server } from 'socket.io';
import { NextApiRequest } from 'next';
import { 
  NextApiResponseServerIO,
  CartUpdateData,
  OrderStatusUpdateData,
  InventoryUpdateData,
  AnalyticsUpdateData,
  SupportChatData,
  UserActivityData,
  ProductWatchData,
  ProductAvailabilityData
} from '../../types/socket';

export default function handler(req: NextApiRequest, res: NextApiResponseServerIO) {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...');
    
    const io = new Server(res.socket.server, {
      path: '/api/socketio',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL,
        methods: ['GET', 'POST'],
      },
    });

    // Real-time features
    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Join organization room for tenant isolation
      socket.on('join-organization', (organizationId: string) => {
        socket.join(`org-${organizationId}`);
        console.log(`Client ${socket.id} joined organization ${organizationId}`);
      });

      // Live cart updates
      socket.on('cart-updated', (data: CartUpdateData) => {
        socket.to(`org-${data.organizationId}`).emit('cart-update', data);
      });

      // Order status updates
      socket.on('order-status-changed', (data: OrderStatusUpdateData) => {
        socket.to(`org-${data.organizationId}`).emit('order-status-update', data);
      });

      // Inventory updates
      socket.on('inventory-updated', (data: InventoryUpdateData) => {
        socket.to(`org-${data.organizationId}`).emit('inventory-update', data);
      });

      // Live analytics updates
      socket.on('analytics-update', (data: AnalyticsUpdateData) => {
        socket.to(`org-${data.organizationId}`).emit('analytics-updated', data);
      });

      // Customer support chat
      socket.on('join-support-chat', (data: { organizationId: string; userId: string }) => {
        const room = `support-${data.organizationId}-${data.userId}`;
        socket.join(room);
        console.log(`Client joined support chat: ${room}`);
      });

      socket.on('support-message', (data: SupportChatData) => {
        const room = `support-${data.organizationId}-${data.userId}`;
        io.to(room).emit('support-message-received', data);
      });

      // Product availability notifications
      socket.on('watch-product', (data: ProductWatchData) => {
        socket.join(`product-${data.productId}`);
      });

      socket.on('product-back-in-stock', (data: ProductAvailabilityData) => {
        socket.to(`product-${data.productId}`).emit('product-available', data);
      });

      // Live user activity (for admin dashboard)
      socket.on('user-activity', (data: UserActivityData) => {
        socket.to(`org-${data.organizationId}`).emit('live-activity', {
          type: 'user-activity',
          userId: data.userId,
          action: data.action,
          timestamp: new Date(),
        });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
}
