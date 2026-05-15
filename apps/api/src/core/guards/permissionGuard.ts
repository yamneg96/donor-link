import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { Permission, PERMISSIONS } from '../constants';
import { Role } from '../constants';

/**
 * Fine-grained permission guard middleware.
 * Checks if the authenticated user's role has the required permission.
 */
export function requirePermission(permission: Permission) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    const allowedRoles = PERMISSIONS[permission] as readonly Role[];

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Permission '${permission}' denied for role '${req.user.role}'`));
    }

    next();
  };
}
