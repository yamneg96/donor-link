import rateLimit from "express-rate-limit";
import { config } from "../config/env";
import { ApiError } from "../utils/errors";

const handler = (_req: any, _res: any, next: any) => {
  next(ApiError.tooManyRequests("Too many requests — please slow down and try again"));
};

/** General API rate limit */
export const apiLimiter = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
});

/** Strict limit for auth endpoints (prevent brute force) */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  skipSuccessfulRequests: true, // Only count failures
});

/** Alert dispatch limiter (prevent alert spam) */
export const alertLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler,
  keyGenerator: (req) => req.user?.userId ?? req.ip ?? "unknown",
});