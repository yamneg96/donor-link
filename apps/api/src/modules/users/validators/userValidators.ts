import { z } from 'zod';
import { Role, UserStatus } from '../../../core/constants';

export const createUserSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  phone: z.string().optional(),
  role: z.nativeEnum(Role),
  organizationId: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  phone: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
  organizationId: z.string().optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const queryUsersSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  role: z.nativeEnum(Role).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  organizationId: z.string().optional(),
  search: z.string().optional(),
});
