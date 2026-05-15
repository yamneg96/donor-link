import { z } from 'zod';

export const createHospitalSchema = z.object({
  organizationId: z.string().min(1),
  name: z.string().min(2).max(200),
  beds: z.number().int().min(0).optional(),
  departments: z.array(z.string()).optional(),
  operatingHours: z.object({ open: z.string().optional(), close: z.string().optional() }).optional(),
  bloodBankCapacity: z.number().int().min(0).optional(),
  hasBloodBank: z.boolean().optional(),
  location: z.object({ type: z.literal('Point').optional(), coordinates: z.tuple([z.number(), z.number()]) }).optional(),
  contactPerson: z.object({ name: z.string().optional(), phone: z.string().optional(), email: z.string().email().optional() }).optional(),
});
export const updateHospitalSchema = createHospitalSchema.partial();
