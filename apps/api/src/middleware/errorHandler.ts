import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors";
import { logger } from "../utils/logger";
import { config } from "../config/env";

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  // Log every error
  logger.error("Request error", {
    message: err.message,
    stack: config.NODE_ENV === "development" ? err.stack : undefined,
    method: req.method,
    url: req.originalUrl,
    userId: req.user?.userId,
  });

  // Known operational errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
    });
  }

  // Mongoose duplicate key
  if ((err as any).code === 11000) {
    const field = Object.keys((err as any).keyValue ?? {})[0] ?? "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists`,
    });
  }

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const errors: Record<string, string[]> = {};
    for (const [key, val] of Object.entries((err as any).errors)) {
      errors[key] = [(val as any).message];
    }
    return res.status(400).json({ success: false, message: "Validation failed", errors });
  }

  // Mongoose cast error (bad ObjectId)
  if (err.name === "CastError") {
    return res.status(400).json({ success: false, message: "Invalid ID format" });
  }

  // JWT errors (should be caught upstream, but just in case)
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Invalid or expired token" });
  }

  // Unknown errors — don't leak details in production
  return res.status(500).json({
    success: false,
    message:
      config.NODE_ENV === "production"
        ? "Something went wrong. Please try again."
        : err.message,
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
}