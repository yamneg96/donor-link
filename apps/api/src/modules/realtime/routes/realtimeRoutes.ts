import { Router } from 'express';
import { authenticate } from '../../../core/middleware';
import { sendSuccess } from '../../../core/utils';

/**
 * Realtime Module
 *
 * This module provides the HTTP companion routes for the Socket.IO realtime layer.
 * The actual WebSocket setup is done via socketManager.ts which is initialized
 * in server.ts alongside the HTTP server.
 *
 * Socket.IO rooms:
 * - `org:{orgId}` — organization-scoped events
 * - `hospital:{hospitalId}` — hospital-scoped events
 * - `donor:{donorId}` — donor-specific notifications
 * - `emergency` — global emergency broadcasts
 * - `national` — national command center events
 * - `transfers` — active transfer tracking
 */

const router = Router();
router.use(authenticate);

// Connection metadata
router.get('/status', (_req, res) => {
  sendSuccess(res, {
    service: 'DonorLink Realtime',
    protocol: 'socket.io',
    version: '1.0.0',
    rooms: [
      'org:{orgId}',
      'hospital:{hospitalId}',
      'donor:{donorId}',
      'emergency',
      'national',
      'transfers',
    ],
    events: {
      inventory: ['inventory:updated', 'inventory:critical', 'inventory:expiring'],
      emergency: ['emergency:declared', 'emergency:resolved', 'emergency:escalated'],
      transfers: ['transfer:status', 'transfer:dispatched', 'transfer:completed'],
      shipments: ['shipment:status', 'shipment:cold_chain_breach', 'shipment:delivered'],
      notifications: ['notification:new', 'notification:urgent'],
      appointments: ['appointment:confirmed', 'appointment:reminder'],
      engagement: ['engagement:badge_earned', 'engagement:milestone_reached'],
    },
  }, 'Realtime service info');
});

export { router as realtimeRoutes };
