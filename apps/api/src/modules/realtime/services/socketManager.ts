import { eventBus } from '../../../core/events';
import { resolveSocketEvent, SOCKET_EVENT_MAP } from '../events/eventHandlers';

/**
 * Socket Manager
 *
 * Manages Socket.IO server initialization, authentication, room management,
 * and domain event → WebSocket broadcasting.
 *
 * Usage in server.ts:
 *   import { initializeSocketManager } from './modules/realtime';
 *   const io = new Server(httpServer, { cors: { ... } });
 *   initializeSocketManager(io);
 */

// We use a loose type here to avoid requiring socket.io as a hard dependency
// at module load time. The actual Server type is injected at runtime.
let ioInstance: any = null;

export function initializeSocketManager(io: any) {
  ioInstance = io;

  // Authentication middleware
  io.use((socket: any, next: any) => {
    const token = socket.handshake.auth?.token;
    if (!token) {
      return next(new Error('Authentication required'));
    }
    // Token verification would go here — for now we pass through
    // In production, verify JWT and attach user data to socket
    next();
  });

  // Connection handling
  io.on('connection', (socket: any) => {
    const userId = socket.handshake.auth?.userId;
    const organizationId = socket.handshake.auth?.organizationId;
    const role = socket.handshake.auth?.role;

    // Auto-join relevant rooms
    if (organizationId) {
      socket.join(`org:${organizationId}`);
      socket.join(`hospital:${organizationId}`);
    }
    if (userId) {
      socket.join(`donor:${userId}`);
    }
    if (['SUPER_ADMIN', 'NATIONAL_ADMIN', 'NATIONAL_ANALYST'].includes(role)) {
      socket.join('national');
    }

    // Manual room join/leave
    socket.on('join:room', (room: string) => {
      socket.join(room);
    });

    socket.on('leave:room', (room: string) => {
      socket.leave(room);
    });

    // Transfer tracking subscription
    socket.on('track:shipment', (shipmentId: string) => {
      socket.join(`shipment:${shipmentId}`);
    });

    socket.on('untrack:shipment', (shipmentId: string) => {
      socket.leave(`shipment:${shipmentId}`);
    });

    socket.on('disconnect', () => {
      // Cleanup handled automatically by Socket.IO
    });
  });

  // Subscribe to domain events and broadcast to sockets
  for (const config of SOCKET_EVENT_MAP) {
    eventBus.onEvent(config.eventType, (event) => {
      const resolved = resolveSocketEvent(event);
      if (resolved && ioInstance) {
        ioInstance.to(resolved.room).emit(resolved.socketEvent, {
          ...event.payload,
          timestamp: event.timestamp,
        });
      }
    });
  }

  console.log('[Realtime] Socket.IO manager initialized');
}

export function getIO() {
  return ioInstance;
}

export function broadcastToRoom(room: string, event: string, data: Record<string, any>) {
  if (ioInstance) {
    ioInstance.to(room).emit(event, { ...data, timestamp: new Date() });
  }
}

export function broadcastToAll(event: string, data: Record<string, any>) {
  if (ioInstance) {
    ioInstance.emit(event, { ...data, timestamp: new Date() });
  }
}
