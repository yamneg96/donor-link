import { z } from "zod";

// ─── Roles ────────────────────────────────────────────────────────────────────

export enum RegionEthiopia {
  ADDIS_ABABA = 'Addis Ababa',
  AFAR = 'Afar',
  AMHARA = 'Amhara',
  BENISHANGUL_GUMUZ = 'Benishangul-Gumuz',
  DIRE_DAWA = 'Dire Dawa',
  GAMBELA = 'Gambela',
  HARARI = 'Harari',
  OROMIA = 'Oromia',
  SIDAMA = 'Sidama',
  SOMALI = 'Somali',
  SOUTH_ETHIOPIA = 'South Ethiopia',
  SOUTH_WEST_ETHIOPIA = 'South West Ethiopia',
  TIGRAY = 'Tigray',
}

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NATIONAL_ADMIN = 'NATIONAL_ADMIN',
  NATIONAL_ANALYST = 'NATIONAL_ANALYST',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  LAB_STAFF = 'LAB_STAFF',
  DISPATCHER = 'DISPATCHER',
  DONOR_COORDINATOR = 'DONOR_COORDINATOR',
  DONOR = 'DONOR',
}

export const onboardDonorSchema = z.object({
  bloodType: z.string().min(1, "Blood type is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  weight: z.number().min(45, "Weight must be at least 45kg"),
  phone: z.string().min(10, "Phone number is required"),
  address: z.object({
    region: z.nativeEnum(RegionEthiopia),
    city: z.string().min(1, "City is required"),
    subcity: z.string().optional(),
    woreda: z.string().optional(),
  }),
  availableForEmergency: z.boolean(),
});

export type OnboardDonorInput = z.infer<typeof onboardDonorSchema>;

export const ADMIN_ROLES: UserRole[] = [UserRole.SUPER_ADMIN, UserRole.NATIONAL_ADMIN];
export const STAFF_ROLES: UserRole[] = [
  UserRole.SUPER_ADMIN, UserRole.NATIONAL_ADMIN, UserRole.NATIONAL_ANALYST,
  UserRole.REGIONAL_ADMIN, UserRole.HOSPITAL_ADMIN, UserRole.LAB_STAFF,
  UserRole.DISPATCHER, UserRole.DONOR_COORDINATOR,
];

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  organizationId: string | null;
  status: 'active' | 'inactive' | 'suspended' | 'pending';
  lastLogin: string | null;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Organization ─────────────────────────────────────────────────────────────

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

export interface IOrganization {
  _id: string;
  name: string;
  code: string;
  type: OrganizationType;
  region: string;
  address: { street: string; city: string; state: string; zipCode: string; country: string };
  contact: { phone: string; email: string; fax: string };
  parentOrganizationId: string | null;
  status: OrganizationStatus;
  location: { type: string; coordinates: [number, number] };
  metadata: Record<string, unknown>;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export interface IHospital {
  _id: string;
  organizationId: string;
  name: string;
  beds: number;
  departments: string[];
  operatingHours: { open: string; close: string };
  bloodBankCapacity: number;
  hasBloodBank: boolean;
  location: { type: string; coordinates: [number, number] };
  contactPerson: { name: string; phone: string; email: string };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Blood Types & Components ─────────────────────────────────────────────────

export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

export enum ComponentType {
  WHOLE_BLOOD = 'whole_blood',
  RED_BLOOD_CELLS = 'red_blood_cells',
  PLATELETS = 'platelets',
  PLASMA = 'plasma',
  CRYOPRECIPITATE = 'cryoprecipitate',
}

// ─── Blood Unit ───────────────────────────────────────────────────────────────

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

export interface ILifecycleEntry {
  status: BloodUnitStatus;
  timestamp: string;
  performedBy: string;
  notes: string;
  organizationId?: string;
}

export interface IBloodUnit {
  _id: string;
  donationId: string;
  donorId: string;
  bloodType: BloodType;
  componentType: ComponentType;
  volume: number;
  collectionDate: string;
  expiryDate: string;
  status: BloodUnitStatus;
  organizationId: string;
  currentHospitalId: string;
  barcode: string;
  qrCode: string;
  lifecycleHistory: ILifecycleEntry[];
  reservedFor: string | null;
  reservedAt: string | null;
  usedAt: string | null;
  discardReason: string | null;
  transferHistory: string[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Transfer ─────────────────────────────────────────────────────────────────

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

export interface ITransferRequest {
  _id: string;
  fromOrganizationId: string;
  toOrganizationId: string;
  bloodType: BloodType;
  componentType: ComponentType;
  quantity: number;
  urgency: 'routine' | 'urgent' | 'emergency';
  status: TransferStatus;
  requestedBy: string;
  approvedBy?: string;
  bloodUnitIds: string[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Request ──────────────────────────────────────────────────────────────────

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

export interface IBloodRequest {
  _id: string;
  organizationId: string;
  bloodType: BloodType;
  componentType: ComponentType;
  quantity: number;
  urgency: RequestUrgency;
  status: RequestStatus;
  requestedBy: string;
  fulfilledQuantity: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Donation ─────────────────────────────────────────────────────────────────

export enum DonationStatus {
  SCHEDULED = 'scheduled',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  DEFERRED = 'deferred',
  CANCELLED = 'cancelled',
}

export interface IDonation {
  _id: string;
  donorId: string;
  organizationId: string;
  scheduledDate: string;
  status: DonationStatus;
  bloodType: BloodType;
  volume: number;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Donor ────────────────────────────────────────────────────────────────────

export interface IDonor {
  _id: string;
  userId: string;
  bloodType: BloodType;
  dateOfBirth: string;
  gender: string;
  weight: number;
  height: number;
  isEligible: boolean;
  totalDonations: number;
  lastDonationDate?: string;
  location: { type: string; coordinates: [number, number] };
  createdAt: string;
  updatedAt: string;
}

// ─── Campaign ─────────────────────────────────────────────────────────────────

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

export interface ICampaign {
  _id: string;
  title: string;
  description: string;
  type: CampaignType;
  status: CampaignStatus;
  targetBloodTypes: BloodType[];
  targetRegions: string[];
  startDate: string;
  endDate: string;
  goalUnits: number;
  collectedUnits: number;
  organizationId: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Emergency ────────────────────────────────────────────────────────────────

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

export interface IEmergencyEvent {
  _id: string;
  title: string;
  description: string;
  severity: EmergencySeverity;
  status: EmergencyStatus;
  affectedRegions: string[];
  bloodTypesNeeded: BloodType[];
  declaredBy: string;
  organizationId: string;
  resolvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export enum AlertType {
  SHORTAGE = 'shortage',
  EXPIRY = 'expiry',
  EMERGENCY = 'emergency',
  SYSTEM = 'system',
  TRANSFER = 'transfer',
}

export enum AlertSeverity {
  INFO = 'info',
  WARNING = 'warning',
  CRITICAL = 'critical',
}

export enum AlertStatus {
  ACTIVE = 'active',
  ACKNOWLEDGED = 'acknowledged',
  RESOLVED = 'resolved',
}

export interface IAlert {
  _id: string;
  type: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  organizationId: string;
  acknowledgedBy?: string;
  resolvedBy?: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

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

export interface INotification {
  _id: string;
  userId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  title: string;
  body: string;
  metadata: Record<string, unknown>;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Audit ────────────────────────────────────────────────────────────────────

export interface IAuditLog {
  _id: string;
  action: string;
  resource: string;
  resourceId: string;
  performedBy: string;
  organizationId: string;
  metadata: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
  createdAt: string;
}

// ─── Recommendation ──────────────────────────────────────────────────────────

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

export interface IRecommendation {
  _id: string;
  type: RecommendationType;
  status: RecommendationStatus;
  title: string;
  description: string;
  confidence: number;
  metadata: Record<string, unknown>;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Inventory Action ─────────────────────────────────────────────────────────

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

export interface IInventoryLedger {
  _id: string;
  bloodUnitId: string;
  action: InventoryAction;
  organizationId: string;
  performedBy: string;
  metadata: Record<string, unknown>;
  previousStatus: string | null;
  newStatus: string | null;
  notes: string;
  timestamp: string;
  createdAt: string;
}

// ─── API Response Wrapper ─────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  code: string;
  errors?: Record<string, string[]>;
}

// ─── Auth Response Types ──────────────────────────────────────────────────────

export interface LoginResponse {
  user: IUser;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface TokenRefreshResponse {
  accessToken: string;
  refreshToken: string;
}

// ─── Stock Level ──────────────────────────────────────────────────────────────

export interface IStockLevel {
  bloodType: BloodType;
  componentType: ComponentType;
  available: number;
  reserved: number;
  total: number;
  target?: number;
}

// ─── Intelligence (ML) Types ─────────────────────────────────────────────────

export interface IMLForecastPoint {
  day: number;
  predicted_demand: number;
  lower_bound: number;
  upper_bound: number;
}

export interface IMLForecastResponse {
  forecast: IMLForecastPoint[];
  generatedAt: string;
}

export interface IMLShortageRisk {
  hospital_id: string;
  blood_type: string;
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  days_of_supply: number;
  projected_deficit: number;
  recommendation: string;
}


export interface IMLShortageRiskResponse {
  risk: IMLShortageRisk;
  display: {
    label: string;
    color: string;
  };
  generatedAt: string;
}

export interface IMLRedistributionRecommendation {
  source_hospital_id: string;
  units_to_transfer: number;
  logistics_score: number;
  expiry_score: number;
  combined_score: number;
  estimated_delivery_hours: number;
}

export interface IMLRedistributionResponse {
  redistribution: {
    target_hospital_id: string;
    blood_type: string;
    units_needed: number;
    urgency: string;
    recommendations: IMLRedistributionRecommendation[];
    ml_explanation: string;
  };
  generatedAt: string;
}

export interface IMLAnomalyDetection {
  is_anomaly: boolean;
  severity: number;
  metric_name: string;
  detected_at: string;
  context?: Record<string, unknown>;
}

export interface IMLExpiryRisk {
  unit_id: string;
  expiry_risk_score: number;
  remaining_days: number;
  recommendation: 'MONITOR' | 'REDISTRIBUTE' | 'PRIORITIZE_USE';
}

export interface IMLHealth {
  status: string;
  version: string;
  engines: string[];
}

