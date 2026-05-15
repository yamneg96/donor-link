import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { Role } from '../constants';

/**
 * Role-based authorization middleware.
 * Checks if authenticated user has one of the allowed roles.
 */
export function authorize(...allowedRoles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Role '${req.user.role}' does not have access to this resource`));
    }

    next();
  };
}

/**
 * Shorthand to allow any of the provided roles.
 */
export const allowRoles = authorize;
