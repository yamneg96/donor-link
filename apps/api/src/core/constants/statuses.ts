export enum BloodUnitStatus {
  COLLECTED = 'collected',
  TESTED = 'tested',
  AVAILABLE = 'available',
  RESERVED = 'reserved',
  TRANSFERRED = 'transferred',
  RECEIVED = 'received',
  USED = 'used',
  EXPIRED = 'expired',
  DISCARDED = 'discarded',
}

export enum TransferStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  DISPATCHED = 'dispatched',
  IN_TRANSIT = 'in_transit',
  RECEIVED = 'received',
  COMPLETED = 'completed',
  REJECTED = 'rejected',
  CANCELLED = 'cancelled',
}

export enum RequestStatus {
  PENDING = 'pending',
  PARTIALLY_FULFILLED = 'partially_fulfilled',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
  EXPIRED = 'expired',
}

export enum RequestUrgency {
  ROUTINE = 'routine',
  URGENT = 'urgent',
  EMERGENCY = 'emergency',
}

export enum DonationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

export enum OrganizationType {
  NATIONAL_BLOOD_BANK = 'NATIONAL_BLOOD_BANK',
  REGIONAL_CENTER = 'REGIONAL_CENTER',
  HOSPITAL = 'HOSPITAL',
  DONATION_CENTER = 'DONATION_CENTER',
}

export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  ONBOARDING = 'onboarding',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending',
}

export enum CampaignStatus {
  DRAFT = 'draft',
  ACTIVE = 'active',
  PAUSED = 'paused',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum CampaignType {
  GENERAL = 'general',
  BLOOD_TYPE_SPECIFIC = 'blood_type_specific',
  REGIONAL = 'regional',
  EMERGENCY = 'emergency',
}

export enum EmergencyStatus {
  DECLARED = 'declared',
  ACTIVE = 'active',
  RESPONDING = 'responding',
  RESOLVED = 'resolved',
  CANCELLED = 'cancelled',
}

export enum EmergencySeverity {
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum NotificationChannel {
  EMAIL = 'email',
  SMS = 'sms',
  PUSH = 'push',
  IN_APP = 'in_app',
}

export enum NotificationStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  READ = 'read',
}

export enum InventoryAction {
  COLLECTED = 'collected',
  TESTED = 'tested',
  AVAILABLE = 'available',
  ALLOCATED = 'allocated',
  RESERVED = 'reserved',
  TRANSFERRED_OUT = 'transferred_out',
  TRANSFERRED_IN = 'transferred_in',
  USED = 'used',
  EXPIRED = 'expired',
  DISCARDED = 'discarded',
}

export enum RecommendationType {
  TRANSFER = 'transfer',
  REDISTRIBUTION = 'redistribution',
  SHORTAGE_ALERT = 'shortage_alert',
  EXPIRY_PREVENTION = 'expiry_prevention',
  CAMPAIGN_TRIGGER = 'campaign_trigger',
}

export enum RecommendationStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
  IMPLEMENTED = 'implemented',
}
