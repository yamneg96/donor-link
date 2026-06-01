import { z } from 'zod';

export const createShipmentSchema = z.object({
  transferId: z.string().min(1, 'Transfer ID is required'),
  sourceHospitalId: z.string().min(1),
  destinationHospitalId: z.string().min(1),
  organizationId: z.string().optional(),
  carrier: z.string().optional(),
  vehicleId: z.string().optional(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  estimatedDepartureTime: z.string().min(1),
  estimatedArrivalTime: z.string().min(1),
  bloodUnitCount: z.number().min(1),
  notes: z.string().optional(),
});

export const updateStatusSchema = z.object({
  status: z.enum(['created', 'picked_up', 'in_transit', 'at_checkpoint', 'delivered', 'failed', 'returned']),
  location: z.string().optional(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }).optional(),
  notes: z.string().optional(),
});

export const coldChainReadingSchema = z.object({
  temperatureCelsius: z.number(),
  humidity: z.number().optional(),
  location: z.string().optional(),
});

export type CreateShipmentInput = z.infer<typeof createShipmentSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type ColdChainReadingInput = z.infer<typeof coldChainReadingSchema>;
