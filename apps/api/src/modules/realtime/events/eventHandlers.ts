import { EventType, DomainEvent } from '../../../core/events';

/**
 * Socket.IO Event Handlers
 *
 * Maps domain events from the core EventBus to Socket.IO room broadcasts.
 * This module is initialized with the Socket.IO server instance from server.ts.
 */

export interface SocketEventConfig {
  eventType: EventType;
  socketEvent: string;
  targetRoom: (payload: Record<string, unknown>) => string;
}

export const SOCKET_EVENT_MAP: SocketEventConfig[] = [
  // Inventory events
  {
    eventType: EventType.INVENTORY_UPDATED,
    socketEvent: 'inventory:updated',
    targetRoom: (p) => `hospital:${p.organizationId}`,
  },
  {
    eventType: EventType.INVENTORY_CRITICAL,
    socketEvent: 'inventory:critical',
    targetRoom: (p) => `hospital:${p.organizationId}`,
  },
  {
    eventType: EventType.SHORTAGE_DETECTED,
    socketEvent: 'inventory:shortage',
    targetRoom: () => 'national',
  },
  {
    eventType: EventType.BLOOD_EXPIRING,
    socketEvent: 'inventory:expiring',
    targetRoom: (p) => `hospital:${p.organizationId}`,
  },

  // Emergency events
  {
    eventType: EventType.EMERGENCY_DECLARED,
    socketEvent: 'emergency:declared',
    targetRoom: () => 'emergency',
  },
  {
    eventType: EventType.EMERGENCY_RESOLVED,
    socketEvent: 'emergency:resolved',
    targetRoom: () => 'emergency',
  },
  {
    eventType: EventType.EMERGENCY_ESCALATED,
    socketEvent: 'emergency:escalated',
    targetRoom: () => 'national',
  },

  // Transfer events
  {
    eventType: EventType.TRANSFER_DISPATCHED,
    socketEvent: 'transfer:dispatched',
    targetRoom: () => 'transfers',
  },
  {
    eventType: EventType.TRANSFER_COMPLETED,
    socketEvent: 'transfer:completed',
    targetRoom: () => 'transfers',
  },

  // ML/Intelligence events
  {
    eventType: EventType.SHORTAGE_PREDICTED,
    socketEvent: 'intelligence:shortage_predicted',
    targetRoom: () => 'national',
  },
  {
    eventType: EventType.FORECAST_GENERATED,
    socketEvent: 'intelligence:forecast',
    targetRoom: () => 'national',
  },
  {
    eventType: EventType.REDISTRIBUTION_RECOMMENDED,
    socketEvent: 'intelligence:redistribution',
    targetRoom: () => 'national',
  },
  {
    eventType: EventType.ANOMALY_DETECTED,
    socketEvent: 'intelligence:anomaly',
    targetRoom: () => 'national',
  },

  // Donation events
  {
    eventType: EventType.DONATION_COMPLETED,
    socketEvent: 'donation:completed',
    targetRoom: (p) => p.donorId ? `donor:${p.donorId}` : 'national',
  },
];

/**
 * Resolves a domain event to its Socket.IO broadcast config.
 */
export function resolveSocketEvent(event: DomainEvent): { socketEvent: string; room: string } | null {
  const config = SOCKET_EVENT_MAP.find(c => c.eventType === event.type);
  if (!config) return null;
  return {
    socketEvent: config.socketEvent,
    room: config.targetRoom(event.payload),
  };
}
