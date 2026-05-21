export enum EventType {
  // Blood Unit Events
  BLOOD_UNIT_CREATED = 'blood_unit_created',
  BLOOD_UNIT_TESTED = 'blood_unit_tested',
  BLOOD_UNIT_AVAILABLE = 'blood_unit_available',
  BLOOD_UNIT_RESERVED = 'blood_unit_reserved',
  BLOOD_UNIT_USED = 'blood_unit_used',
  BLOOD_UNIT_EXPIRED = 'blood_unit_expired',
  BLOOD_UNIT_DISCARDED = 'blood_unit_discarded',

  // Expiry Events
  BLOOD_EXPIRING = 'blood_expiring',

  // Inventory Events
  SHORTAGE_DETECTED = 'shortage_detected',
  INVENTORY_UPDATED = 'inventory_updated',
  INVENTORY_CRITICAL = 'inventory_critical',

  // Transfer Events
  TRANSFER_REQUESTED = 'transfer_requested',
  TRANSFER_APPROVED = 'transfer_approved',
  TRANSFER_DISPATCHED = 'transfer_dispatched',
  TRANSFER_COMPLETED = 'transfer_completed',
  TRANSFER_REJECTED = 'transfer_rejected',

  // Emergency Events
  EMERGENCY_DECLARED = 'emergency_declared',
  EMERGENCY_RESOLVED = 'emergency_resolved',

  // Campaign Events
  CAMPAIGN_TRIGGERED = 'campaign_triggered',
  CAMPAIGN_COMPLETED = 'campaign_completed',

  // Donation Events
  DONATION_COMPLETED = 'donation_completed',

  // User Events
  USER_CREATED = 'user_created',
  USER_LOGIN = 'user_login',

  // Intelligence Events (ML)
  SHORTAGE_PREDICTED = 'shortage_predicted',
  EMERGENCY_ESCALATED = 'emergency_escalated',
  DONOR_MATCH_FOUND = 'donor_match_found',
  EXPIRY_RISK_HIGH = 'expiry_risk_high',
  REDISTRIBUTION_RECOMMENDED = 'redistribution_recommended',
  INVENTORY_COLLAPSE_RISK = 'inventory_collapse_risk',
  FORECAST_GENERATED = 'forecast_generated',
  ANOMALY_DETECTED = 'anomaly_detected',
}

export interface DomainEvent {
  type: EventType;
  payload: Record<string, unknown>;
  timestamp: Date;
  userId?: string;
  organizationId?: string;
}
