import { z } from 'zod';

export const registerLocationSchema = z.object({
  entityType: z.enum(['hospital', 'blood_bank', 'donation_center', 'blood_drive']),
  entityId: z.string().min(1),
  name: z.string().min(1),
  longitude: z.number(),
  latitude: z.number(),
  address: z.string().optional(),
  city: z.string().optional(),
  region: z.string().optional(),
  operatingHours: z.string().optional(),
  contactPhone: z.string().optional(),
  services: z.array(z.string()).optional(),
});

export const nearbyQuerySchema = z.object({
  longitude: z.string().transform(Number),
  latitude: z.string().transform(Number),
  radius: z.string().transform(Number).optional(),
  type: z.enum(['hospital', 'blood_bank', 'donation_center', 'blood_drive']).optional(),
});

export const emergencyRadiusSchema = z.object({
  longitude: z.number(),
  latitude: z.number(),
  radius: z.number().min(1).max(500),
});

export type RegisterLocationInput = z.infer<typeof registerLocationSchema>;
export type EmergencyRadiusInput = z.infer<typeof emergencyRadiusSchema>;
