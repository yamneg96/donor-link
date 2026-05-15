import { z } from 'zod';
import { OrganizationType, OrganizationStatus } from '../../../core/constants';

export const createOrganizationSchema = z.object({
  name: z.string().min(2).max(200),
  code: z.string().min(3).max(20).optional(),
  type: z.nativeEnum(OrganizationType),
  region: z.string().min(2),
  address: z.object({
    street: z.string().optional(), city: z.string().optional(), state: z.string().optional(),
    zipCode: z.string().optional(), country: z.string().optional(),
  }).optional(),
  contact: z.object({
    phone: z.string().optional(), email: z.string().email().optional(), fax: z.string().optional(),
  }).optional(),
  parentOrganizationId: z.string().optional(),
  location: z.object({ type: z.literal('Point').optional(), coordinates: z.tuple([z.number(), z.number()]) }).optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.partial();
