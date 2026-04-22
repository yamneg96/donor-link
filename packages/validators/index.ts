import { z } from "zod";
import {
  BloodType,
  IdDocumentType,
  UserRole,
  RequestUrgency,
  RegionEthiopia,
} from "@donorlink/types";

// ─── Primitives ───────────────────────────────────────────────────────────────

export const phoneSchema = z
  .string()
  .regex(/^\+251[79]\d{8}$/, "Must be a valid Ethiopian phone number (+251...)");

export const ethiopianIdSchema = z
  .string()
  .min(6, "ID number too short")
  .max(20, "ID number too long")
  .regex(/^[A-Z0-9\-]+$/i, "Invalid ID format");

export const geoLocationSchema = z.object({
  type: z.literal("Point"),
  coordinates: z.tuple([
    z.number().min(33).max(48),  // ET longitude range
    z.number().min(3).max(15),   // ET latitude range
  ]),
});

export const addressSchema = z.object({
  region: z.nativeEnum(RegionEthiopia),
  city: z.string().min(2).max(100),
  subcity: z.string().max(100).optional(),
  woreda: z.string().max(100).optional(),
  kebele: z.string().max(50).optional(),
});

export const idDocumentSchema = z.object({
  type: z.nativeEnum(IdDocumentType),
  number: ethiopianIdSchema,
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  scanUrl: z.string().url().optional(),
});

// ─── Auth (Legacy — Phone/Password) ──────────────────────────────────────────

export const registerDonorSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  amharicName: z.string().max(100).optional(),
  phone: phoneSchema,
  email: z.string().email().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  idDocument: idDocumentSchema,
  address: addressSchema,
  bloodType: z.nativeEnum(BloodType),
  dateOfBirth: z.string().date(),
  weight: z.number().min(45, "Minimum weight to donate is 45 kg").max(200),
  availableForEmergency: z.boolean().default(true),
});

export const registerHospitalAdminSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: phoneSchema,
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/)
    .regex(/[0-9]/),
  idDocument: idDocumentSchema,
  role: z.enum([
    UserRole.HOSPITAL_ADMIN,
    UserRole.BLOOD_BANK_ADMIN,
    UserRole.MOH_ADMIN,
  ]),
  hospitalId: z.string().optional(),
});

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1),
});

// ─── Auth (Hybrid — Email/Password Fallback) ─────────────────────────────────

/** Login via email + password (hybrid fallback) */
export const loginWithEmailSchema = z.object({
  email: z.string().email("Must be a valid email address"),
  password: z.string().min(1, "Password is required"),
});

/** Register via email + password (hybrid fallback for any role) */
export const registerWithEmailSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  amharicName: z.string().max(100).optional(),
  email: z.string().email("Must be a valid email address"),
  phone: phoneSchema.optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: z.nativeEnum(UserRole).default(UserRole.DONOR),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/),
    confirmPassword: z.string(),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Fayda OIDC ───────────────────────────────────────────────────────────────

/** Query params for initiating Fayda authorization */
export const faydaAuthorizeSchema = z.object({
  role: z.nativeEnum(UserRole).default(UserRole.DONOR),
});

/** Query params returned in the Fayda callback redirect */
export const faydaCallbackSchema = z.object({
  code: z.string().min(1, "Authorization code is required"),
  state: z.string().min(1, "State parameter is required"),
});

/** Post-Fayda onboarding — donor-specific data not in the ID token */
export const onboardDonorSchema = z.object({
  bloodType: z.nativeEnum(BloodType),
  dateOfBirth: z.string().date(),
  weight: z.number().min(45, "Minimum weight to donate is 45 kg").max(200),
  address: addressSchema,
  phone: phoneSchema.optional(),
  availableForEmergency: z.boolean().default(true),
});

/** Post-Fayda onboarding for hospital/admin roles */
export const onboardAdminSchema = z.object({
  phone: phoneSchema,
  hospitalId: z.string().optional(),
  address: addressSchema.optional(),
});

// ─── Donor ────────────────────────────────────────────────────────────────────

export const updateDonorProfileSchema = z.object({
  availableForEmergency: z.boolean().optional(),
  address: addressSchema.optional(),
  location: geoLocationSchema.optional(),
  notificationPreferences: z
    .object({
      sms: z.boolean(),
      push: z.boolean(),
      email: z.boolean(),
      emergencyOnly: z.boolean(),
      maxAlertsPerDay: z.number().min(1).max(10),
    })
    .optional(),
});

export const donorEligibilityCheckSchema = z.object({
  weight: z.number().min(45).max(200),
  hemoglobinLevel: z.number().min(7).max(20).optional(),
  lastDonationDate: z.string().date().optional(),
  hasChronicDisease: z.boolean(),
  isPregnant: z.boolean().optional(),
  recentSurgery: z.boolean(),
  recentTattoo: z.boolean(),
  recentInfection: z.boolean(),
});

// ─── Hospital ─────────────────────────────────────────────────────────────────

export const createHospitalSchema = z.object({
  name: z.string().min(3).max(200),
  amharicName: z.string().max(200).optional(),
  licenseNumber: z.string().min(4).max(50),
  address: addressSchema,
  location: geoLocationSchema,
  phone: phoneSchema,
  emergencyPhone: phoneSchema,
  email: z.string().email(),
});

export const updateBloodInventorySchema = z.object({
  inventory: z.array(
    z.object({
      bloodType: z.nativeEnum(BloodType),
      units: z.number().int().min(0),
      criticalThreshold: z.number().int().min(0),
    })
  ),
});

// ─── Blood Request ────────────────────────────────────────────────────────────

export const createBloodRequestSchema = z.object({
  bloodType: z.nativeEnum(BloodType),
  unitsNeeded: z.number().int().min(1).max(20),
  urgency: z.nativeEnum(RequestUrgency),
  patientName: z.string().max(100).optional(),
  notes: z.string().max(500).optional(),
  radiusKm: z.number().min(1).max(200).default(50),
  expiresInHours: z.number().min(1).max(72).default(24),
});

export const respondToRequestSchema = z.object({
  requestId: z.string(),
  response: z.enum(["accepted", "declined"]),
  estimatedArrivalMinutes: z.number().min(5).max(480).optional(),
});

// ─── Donation ─────────────────────────────────────────────────────────────────

export const scheduleDonationSchema = z.object({
  hospitalId: z.string(),
  requestId: z.string().optional(),
  scheduledAt: z.string().datetime(),
});

export const completeDonationSchema = z.object({
  donationId: z.string(),
  unitsDonated: z.number().min(1).max(3),
  hemoglobinLevel: z.number().min(7).max(20).optional(),
  notes: z.string().max(500).optional(),
});

// ─── Pagination ────────────────────────────────────────────────────────────────

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const dateRangeSchema = z.object({
  from: z.string().date().optional(),
  to: z.string().date().optional(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterDonorInput = z.infer<typeof registerDonorSchema>;
export type RegisterHospitalAdminInput = z.infer<typeof registerHospitalAdminSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginWithEmailInput = z.infer<typeof loginWithEmailSchema>;
export type RegisterWithEmailInput = z.infer<typeof registerWithEmailSchema>;
export type CreateBloodRequestInput = z.infer<typeof createBloodRequestSchema>;
export type CreateHospitalInput = z.infer<typeof createHospitalSchema>;
export type UpdateDonorProfileInput = z.infer<typeof updateDonorProfileSchema>;
export type DonorEligibilityInput = z.infer<typeof donorEligibilityCheckSchema>;
export type ScheduleDonationInput = z.infer<typeof scheduleDonationSchema>;
export type CompleteDonationInput = z.infer<typeof completeDonationSchema>;
export type UpdateBloodInventoryInput = z.infer<typeof updateBloodInventorySchema>;
export type FaydaAuthorizeInput = z.infer<typeof faydaAuthorizeSchema>;
export type FaydaCallbackInput = z.infer<typeof faydaCallbackSchema>;
export type OnboardDonorInput = z.infer<typeof onboardDonorSchema>;
export type OnboardAdminInput = z.infer<typeof onboardAdminSchema>;