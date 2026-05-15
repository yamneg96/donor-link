import { Types } from 'mongoose';
import { Role } from '../constants';

/** Authenticated user payload attached to Express Request */
export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  organizationId: string | null;
  firstName: string;
  lastName: string;
}

/** Pagination query parameters */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/** Standard API response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

/** Paginated API response */
export interface PaginatedResponse<T = unknown> extends ApiResponse<T> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/** Filter query object */
export interface FilterParams {
  [key: string]: string | string[] | number | boolean | undefined;
}

/** MongoDB ObjectId type helper */
export type ObjectId = Types.ObjectId;
