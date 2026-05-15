import { z } from 'zod';
import { BloodType, ComponentType, RequestUrgency } from '../../../core/constants';

export const createRequestSchema = z.object({
  requestingOrgId: z.string().min(1),
  bloodType: z.nativeEnum(BloodType),
  componentType: z.nativeEnum(ComponentType).optional(),
  quantity: z.number().int().min(1),
  urgency: z.nativeEnum(RequestUrgency).optional(),
  requestedBy: z.string().min(1),
  patientInfo: z.object({ name: z.string().optional(), age: z.number().optional(), condition: z.string().optional() }).optional(),
  notes: z.string().optional(),
  expiresAt: z.string().transform(v => new Date(v)).optional(),
});
export const updateRequestSchema = createRequestSchema.partial();
