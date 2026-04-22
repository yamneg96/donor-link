import { Request, Response, NextFunction } from "express";
import { verifyAccessToken, JwtPayload } from "../utils/jwt";
import { ApiError, asyncHandler } from "../utils/errors";
import { UserRole } from "@donorlink/types";
import { User } from "../models/User";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload & { _id: string };
    }
  }
}

export const authenticate = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
      throw ApiError.unauthorized("No token provided");
    }

    const token = authHeader.split(" ")[1];

    let payload: JwtPayload;
    try {
      payload = verifyAccessToken(token);
    } catch {
      throw ApiError.unauthorized("Invalid or expired token");
    }

    // Verify user still exists and is active
    const user = await User.findById(payload.userId).select("_id isActive role");
    if (!user || !user.isActive) {
      throw ApiError.unauthorized("Account not found or deactivated");
    }

    req.user = { ...payload, _id: user._id.toString() };
    next();
  }
);

export const authorize = (...roles: UserRole[]) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) throw ApiError.unauthorized();
    if (!roles.includes(req.user.role)) {
      throw ApiError.forbidden("You do not have permission to perform this action");
    }
    next();
  };

export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();

    try {
      const token = authHeader.split(" ")[1];
      const payload = verifyAccessToken(token);
      req.user = { ...payload, _id: payload.userId };
    } catch {
      // silently ignore — optional auth
    }
    next();
  }
);