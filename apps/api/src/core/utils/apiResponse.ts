import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export function sendSuccess<T>(res: Response, data: T, message: string = 'Success', statusCode: number = 200): void {
  const response: ApiResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  };
  res.status(statusCode).json(response);
}

export function sendCreated<T>(res: Response, data: T, message: string = 'Created successfully'): void {
  sendSuccess(res, data, message, 201);
}

export function sendPaginated<T>(
  res: Response,
  data: T,
  pagination: { page: number; limit: number; total: number },
  message: string = 'Success'
): void {
  const totalPages = Math.ceil(pagination.total / pagination.limit);
  const response: PaginatedResponse<T> = {
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      total: pagination.total,
      totalPages,
      hasNext: pagination.page < totalPages,
      hasPrev: pagination.page > 1,
    },
  };
  res.status(200).json(response);
}

export function sendNoContent(res: Response): void {
  res.status(204).send();
}
