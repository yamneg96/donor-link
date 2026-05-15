import { z } from 'zod';
import { BloodType } from '../../../core/constants';

export const createTransferSchema = z.object({
  fromOrgId: z.string().min(1),
  toOrgId: z.string().min(1),
  bloodUnits: z.array(z.string()).optional(),
  bloodType: z.nativeEnum(BloodType),
  quantity: z.number().int().min(1),
  priority: z.enum(['normal', 'urgent', 'emergency']).optional(),
  notes: z.string().optional(),
});

export const dispatchTransferSchema = z.object({
  departureTime: z.string().transform(v => new Date(v)),
  estimatedArrival: z.string().transform(v => new Date(v)),
  vehicleInfo: z.object({
    type: z.string().optional(), plateNumber: z.string().optional(),
    driverName: z.string().optional(), driverPhone: z.string().optional(),
  }).optional(),
});
