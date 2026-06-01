import { z } from 'zod';
import { BloodType } from '../../../core/constants';

export const screeningAnswerSchema = z.object({
  questionId: z.string().min(1),
  question: z.string().min(1),
  answer: z.union([z.string(), z.boolean()]),
  flagged: z.boolean().optional(),
});

export const screenDonorSchema = z.object({
  donorId: z.string().min(1, 'Donor ID is required'),
  hemoglobinLevel: z.number().optional(),
  bloodPressureSystolic: z.number().optional(),
  bloodPressureDiastolic: z.number().optional(),
  pulseRate: z.number().optional(),
  weight: z.number().optional(),
  temperature: z.number().optional(),
  lastDonationDate: z.string().optional(),
  bloodType: z.nativeEnum(BloodType).optional(),
  screeningAnswers: z.array(screeningAnswerSchema).optional(),
});

export const addRestrictionSchema = z.object({
  type: z.enum(['temporary', 'permanent']),
  reason: z.string().min(1, 'Reason is required'),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

export type ScreenDonorInput = z.infer<typeof screenDonorSchema>;
export type AddRestrictionInput = z.infer<typeof addRestrictionSchema>;
