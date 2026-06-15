export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  code?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  success: boolean;
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}
