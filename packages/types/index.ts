// ─── Enums ───────────────────────────────────────────────────────────────────

export enum BloodType {
  A_POS = "A+",
  A_NEG = "A-",
  B_POS = "B+",
  B_NEG = "B-",
  AB_POS = "AB+",
  AB_NEG = "AB-",
  O_POS = "O+",
  O_NEG = "O-",
}

export enum DonorStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DEFERRED = "deferred",     // Temporarily ineligible
  SUSPENDED = "suspended",   // Admin action
}

export enum RequestStatus {
  PENDING = "pending",
  MATCHING = "matching",
  FULFILLED = "fulfilled",
  EXPIRED = "expired",
  CANCELLED = "cancelled",
}

export enum RequestUrgency {
  CRITICAL = "critical",   // < 2 hours
  URGENT = "urgent",       // < 24 hours
  STANDARD = "standard",   // > 24 hours
}

export enum DonationStatus {
  SCHEDULED = "scheduled",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
  NO_SHOW = "no_show",
}

export enum IdDocumentType {
  NATIONAL_ID = "national_id",
  PASSPORT = "passport",
  DRIVER_LICENSE = "driver_license",
}

export enum UserRole {
  DONOR = "donor",
  RECIPIENT = "recipient",
  HOSPITAL_ADMIN = "hospital_admin",
  BLOOD_BANK_ADMIN = "blood_bank_admin",
  MOH_ADMIN = "moh_admin",
  SUPER_ADMIN = "super_admin",
}

export enum AlertChannel {
  SMS = "sms",
  PUSH = "push",
  EMAIL = "email",
}

export enum AlertStatus {
  PENDING = "pending",
  SENT = "sent",
  DELIVERED = "delivered",
  FAILED = "failed",
}

export enum RegionEthiopia {
  ADDIS_ABABA = "Addis Ababa",
  OROMIA = "Oromia",
  AMHARA = "Amhara",
  TIGRAY = "Tigray",
  SOMALI = "Somali",
  SIDAMA = "Sidama",
  SNNP = "SNNP",
  AFAR = "Afar",
  BENISHANGUL_GUMUZ = "Benishangul-Gumuz",
  GAMBELA = "Gambela",
  HARARI = "Harari",
  DIRE_DAWA = "Dire Dawa",
}

// ─── Fayda / National ID Enums ────────────────────────────────────────────────

export enum AuthMethod {
  FAYDA_OIDC = "fayda_oidc",
  EMAIL_PASSWORD = "email_password",
}

export enum AcrLevel {
  /** High-assurance biometric (fingerprint/iris). Required for donors. */
  BIOMETRICS = "mosip:idp:acr:biometrics",
  /** Standard OTP (generated code sent to registered phone). Sufficient for recipients. */
  OTP = "mosip:idp:acr:generated-code",
}

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface GeoLocation {
  type: "Point";
  coordinates: [number, number]; // [longitude, latitude]
}

export interface Address {
  region: RegionEthiopia;
  city: string;
  subcity?: string;
  woreda?: string;
  kebele?: string;
}

export interface IdDocument {
  type: IdDocumentType;
  number: string;
  issuedAt?: string;
  expiresAt?: string;
  verified: boolean;
  verifiedAt?: string;
  scanUrl?: string;
}

// ─── Fayda Identity ───────────────────────────────────────────────────────────

/**
 * Profile data returned by Fayda eSignet /userinfo endpoint.
 * The `sub` field is a pairwise subject identifier — use as the primary
 * user key. Do NOT store the 12-digit FIN (Proclamation 1284/2023).
 */
export interface FaydaUserInfo {
  /** Pairwise subject identifier — PRIMARY KEY for donorLink users */
  sub: string;
  name?: string;
  gender?: string;
  birthdate?: string;
  picture?: string;
  phone_number?: string;
  phone_number_verified?: boolean;
  address?: {
    region?: string;
    city?: string;
  };
}

// ─── User ─────────────────────────────────────────────────────────────────────

export interface IUser {
  _id: string;
  firstName: string;
  lastName: string;
  amharicName?: string;
  phone?: string;
  email?: string;
  /** Only present for email/password auth. Omit for Fayda-only users. */
  passwordHash?: string;
  role: UserRole;
  /** Authentication method used to create this account */
  authMethod: AuthMethod;
  /** Pairwise subject ID from Fayda eSignet. Unique per user. */
  faydaSub?: string;
  /** Cached profile from Fayda /userinfo. Updated on each login. */
  faydaProfile?: FaydaUserInfo;
  /** ID document — required for legacy auth, optional for Fayda. */
  idDocument?: IdDocument;
  address?: Address;
  location?: GeoLocation;
  isVerified: boolean;
  isActive: boolean;
  /** Whether the user has completed the post-login onboarding wizard */
  onboardingComplete: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Donor ────────────────────────────────────────────────────────────────────

export interface DonorProfile {
  _id: string;
  userId: string;
  bloodType: BloodType;
  dateOfBirth: string;
  weight: number; // kg
  hemoglobinLevel?: number; // g/dL — from last screening
  status: DonorStatus;
  totalDonations: number;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  availableForEmergency: boolean;
  notificationPreferences: {
    sms: boolean;
    push: boolean;
    email: boolean;
    emergencyOnly: boolean;
    maxAlertsPerDay: number;
  };
  medicalDeferralReason?: string;
  deferralUntil?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export interface BloodInventoryItem {
  bloodType: BloodType;
  units: number;
  criticalThreshold: number;
}

export interface IHospital {
  _id: string;
  name: string;
  amharicName?: string;
  licenseNumber: string;
  address: Address;
  location: GeoLocation;
  phone: string;
  emergencyPhone: string;
  email: string;
  adminUserId: string;
  bloodInventory: BloodInventoryItem[];
  isVerified: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Blood Request ────────────────────────────────────────────────────────────

export interface IBloodRequest {
  _id: string;
  hospitalId: string;
  hospital?: Pick<IHospital, "_id" | "name" | "address" | "location" | "emergencyPhone">;
  requestedBy: string; // userId of hospital admin
  patientName?: string;
  bloodType: BloodType;
  unitsNeeded: number;
  unitsMatched: number;
  urgency: RequestUrgency;
  status: RequestStatus;
  location: GeoLocation;
  radiusKm: number;
  matchedDonorIds: string[];
  alertsSentCount: number;
  expiresAt: string;
  fulfilledAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Donation ─────────────────────────────────────────────────────────────────

export interface IDonation {
  _id: string;
  donorId: string;
  hospitalId: string;
  requestId?: string;
  scheduledAt: string;
  donatedAt?: string;
  status: DonationStatus;
  bloodType: BloodType;
  unitsDonated?: number;
  hemoglobinLevel?: number;
  notes?: string;
  certificateUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Alert ────────────────────────────────────────────────────────────────────

export interface IAlert {
  _id: string;
  requestId: string;
  donorId: string;
  channel: AlertChannel;
  status: AlertStatus;
  message: string;
  sentAt?: string;
  deliveredAt?: string;
  failureReason?: string;
  donorResponse?: "accepted" | "declined" | "no_response";
  respondedAt?: string;
  createdAt: string;
}

// ─── API Response shapes ──────────────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface LoginResponse {
  user: Omit<IUser, "passwordHash">;
  tokens: AuthTokens;
  /** True when user needs to complete the onboarding wizard */
  needsOnboarding: boolean;
}

// ─── Fayda Auth Flow ──────────────────────────────────────────────────────────

export interface FaydaAuthorizeResponse {
  authorizationUrl: string;
}

export interface FaydaCallbackResponse extends LoginResponse {}

// ─── Dashboard / Analytics ────────────────────────────────────────────────────

export interface DashboardStats {
  totalDonors: number;
  activeDonors: number;
  totalRequests: number;
  fulfilledRequests: number;
  criticalRequests: number;
  totalDonations: number;
  donationsByBloodType: Record<BloodType, number>;
  requestsByRegion: Record<RegionEthiopia, number>;
  averageResponseTimeMinutes: number;
}