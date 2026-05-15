import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../errors';
import { logger } from '../../config';

/**
 * Global error handler middleware.
 * Must be registered last in the middleware chain.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error
  if (err instanceof AppError && err.isOperational) {
    logger.warn(`Operational error: ${err.message}`, {
      code: err.code,
      statusCode: err.statusCode,
    });
  } else {
    logger.error('Unexpected error:', err);
  }

  // Handle known operational errors
  if (err instanceof AppError) {
    const response: Record<string, unknown> = {
      success: false,
      message: err.message,
      code: err.code,
      timestamp: new Date().toISOString(),
    };

    // Include validation errors if present
    if (err instanceof ValidationError) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Mongoose validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Database validation failed',
      code: 'VALIDATION_ERROR',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle Mongoose duplicate key errors
  if (err.name === 'MongoServerError' && (err as Record<string, unknown>).code === 11000) {
    res.status(409).json({
      success: false,
      message: 'Duplicate entry detected',
      code: 'CONFLICT',
      timestamp: new Date().toISOString(),
    });
    return;
  }

  // Handle unknown errors
  const statusCode = 500;
  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    code: 'INTERNAL_ERROR',
    timestamp: new Date().toISOString(),
  });
}
