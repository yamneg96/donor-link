import rateLimit from 'express-rate-limit';
import { env } from '../../config';

/**
 * Global rate limiter middleware.
 */
export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
});

/**
 * Strict rate limiter for auth endpoints.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication attempts, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    timestamp: new Date().toISOString(),
  },
});
