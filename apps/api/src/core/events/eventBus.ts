import { EventEmitter } from 'events';
import { EventType, DomainEvent } from './eventTypes';
import { logger } from '../../config';

class EventBus extends EventEmitter {
  private static instance: EventBus;

  private constructor() {
    super();
    this.setMaxListeners(50);
  }

  static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  /**
   * Emit a domain event with structured payload.
   */
  emitEvent(type: EventType, payload: Record<string, unknown>, userId?: string, organizationId?: string): void {
    const event: DomainEvent = {
      type,
      payload,
      timestamp: new Date(),
      userId,
      organizationId,
    };

    logger.debug(`Event emitted: ${type}`, { payload: JSON.stringify(payload).slice(0, 200) });
    this.emit(type, event);
  }

  /**
   * Subscribe to a domain event.
   */
  onEvent(type: EventType, handler: (event: DomainEvent) => void | Promise<void>): void {
    this.on(type, async (event: DomainEvent) => {
      try {
        await handler(event);
      } catch (error) {
        logger.error(`Error handling event ${type}:`, error);
      }
    });
    logger.debug(`Event handler registered for: ${type}`);
  }
}

export const eventBus = EventBus.getInstance();
