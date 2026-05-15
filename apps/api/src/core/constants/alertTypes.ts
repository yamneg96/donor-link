export enum AlertType {
  SHORTAGE = 'shortage',
  EXPIRY = 'expiry',
  EMERGENCY = 'emergency',
  TRANSFER_DELAY = 'transfer_delay',
  INVENTORY_RISK = 'inventory_risk',
  CAMPAIGN_REQUIRED = 'campaign_required',
}

export enum AlertSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}
