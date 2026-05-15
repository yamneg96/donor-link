import { eventBus, EventType, DomainEvent } from '../../core/events';
import { logger } from '../../config';
import { Alert } from '../alerts/models/Alert';
import { Notification } from '../notifications/models/Notification';
import { AuditLog } from '../audit/models/AuditLog';
import { AlertType, AlertSeverity, NotificationStatus, NotificationChannel } from '../../core/constants';

/**
 * Register all domain event handlers.
 * This wires up the event-driven side effects across modules.
 */
export function registerEventHandlers(): void {
  logger.info('📡 Registering domain event handlers...');

  // === Blood Unit Events ===
  eventBus.onEvent(EventType.BLOOD_UNIT_CREATED, async (event: DomainEvent) => {
    logger.info(`Blood unit created: ${event.payload.unitId}`);
    await AuditLog.create({
      action: 'blood_unit_created', entityType: 'BloodUnit', entityId: event.payload.unitId,
      performedBy: event.userId, organizationId: event.organizationId, timestamp: event.timestamp,
    });
  });

  eventBus.onEvent(EventType.BLOOD_UNIT_EXPIRED, async (event: DomainEvent) => {
    logger.warn(`Blood unit expired: ${event.payload.unitId}`);
    await Alert.create({
      type: AlertType.EXPIRY, severity: AlertSeverity.MEDIUM,
      title: 'Blood Unit Expired', message: `Blood unit ${event.payload.unitId} (${event.payload.bloodType}) has expired`,
      organizationId: event.payload.organizationId, bloodType: event.payload.bloodType as string,
    });
  });

  eventBus.onEvent(EventType.BLOOD_UNIT_USED, async (event: DomainEvent) => {
    await AuditLog.create({
      action: 'blood_unit_used', entityType: 'BloodUnit', entityId: event.payload.unitId,
      performedBy: event.userId || event.payload.unitId, organizationId: event.payload.organizationId, timestamp: event.timestamp,
    });
  });

  // === Emergency Events ===
  eventBus.onEvent(EventType.EMERGENCY_DECLARED, async (event: DomainEvent) => {
    logger.error(`🚨 EMERGENCY DECLARED: ${event.payload.emergencyId}`);
    await Alert.create({
      type: AlertType.EMERGENCY, severity: AlertSeverity.CRITICAL,
      title: 'Emergency Declared', message: `Emergency event ${event.payload.emergencyId} declared. Blood types needed: ${(event.payload.bloodTypes as string[])?.join(', ')}`,
      metadata: event.payload,
    });
  });

  // === Transfer Events ===
  eventBus.onEvent(EventType.TRANSFER_REQUESTED, async (event: DomainEvent) => {
    logger.info(`Transfer requested: ${event.payload.transferId}`);
  });

  eventBus.onEvent(EventType.TRANSFER_COMPLETED, async (event: DomainEvent) => {
    logger.info(`Transfer completed: ${event.payload.transferId}`);
    await AuditLog.create({
      action: 'transfer_completed', entityType: 'TransferRequest', entityId: event.payload.transferId,
      performedBy: event.userId || event.payload.transferId, organizationId: event.payload.toOrg, timestamp: event.timestamp,
    });
  });

  // === Shortage Events ===
  eventBus.onEvent(EventType.SHORTAGE_DETECTED, async (event: DomainEvent) => {
    logger.warn(`Shortage detected: ${event.payload.bloodType} at ${event.payload.organizationId}`);
    await Alert.create({
      type: AlertType.SHORTAGE, severity: AlertSeverity.HIGH,
      title: `${event.payload.bloodType} Blood Shortage`, message: `Low stock detected for ${event.payload.bloodType}`,
      organizationId: event.payload.organizationId as string, bloodType: event.payload.bloodType as string,
    });
  });

  // === User Events ===
  eventBus.onEvent(EventType.USER_CREATED, async (event: DomainEvent) => {
    await AuditLog.create({
      action: 'user_created', entityType: 'User', entityId: event.payload.userId,
      performedBy: event.userId || event.payload.userId, timestamp: event.timestamp,
    });
  });

  logger.info('✅ Domain event handlers registered');
}
