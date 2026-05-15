import { z } from 'zod';
import { BloodType } from '../../../core/constants';

export const createDonorSchema = z.object({
  userId: z.string().min(1),
  bloodType: z.nativeEnum(BloodType),
  dateOfBirth: z.string().transform(v => new Date(v)),
  gender: z.enum(['male', 'female', 'other']),
  weight: z.number().min(45),
  height: z.number().optional(),
  medicalHistory: z.array(z.string()).optional(),
  location: z.object({ type: z.literal('Point').optional(), coordinates: z.tuple([z.number(), z.number()]) }).optional(),
  preferredDonationCenter: z.string().optional(),
});
export const updateDonorSchema = createDonorSchema.partial();
