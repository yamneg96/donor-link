import { z } from 'zod';
import { BloodType, ComponentType, DonationStatus } from '../../../core/constants';

export const createDonationSchema = z.object({
  donorId: z.string().min(1),
  organizationId: z.string().min(1),
  donationType: z.enum(['voluntary', 'replacement', 'directed']).optional(),
  bloodType: z.nativeEnum(BloodType),
  componentType: z.nativeEnum(ComponentType).optional(),
  volume: z.number().min(100).max(1000).optional(),
  collectionDate: z.string().transform(v => new Date(v)),
  staffId: z.string().min(1),
  screeningResults: z.object({
    hemoglobin: z.number().optional(), bloodPressure: z.string().optional(),
    pulse: z.number().optional(), temperature: z.number().optional(),
    weight: z.number().optional(), passed: z.boolean().optional(), notes: z.string().optional(),
  }).optional(),
  notes: z.string().optional(),
});
export const updateDonationSchema = createDonationSchema.partial();
