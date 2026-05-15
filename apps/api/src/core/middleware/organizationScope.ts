import { Request, Response, NextFunction } from 'express';
import { ForbiddenError, UnauthorizedError } from '../errors';
import { Role, ADMIN_ROLES } from '../constants';

/**
 * Organization scope middleware.
 * Restricts data access to the user's own organization.
 * National/Super admins can access all organizations.
 */
export function organizationScope(req: Request, _res: Response, next: NextFunction): void {
  if (!req.user) {
    return next(new UnauthorizedError('Authentication required'));
  }

  // Super admins and national admins can access all organizations
  if ((ADMIN_ROLES as readonly Role[]).includes(req.user.role) || req.user.role === Role.NATIONAL_ANALYST) {
    // If a specific org is requested via query param, use that
    if (req.query.organizationId) {
      req.organizationId = req.query.organizationId as string;
    }
    return next();
  }

  // For regional admins, they can access their region's organizations
  if (req.user.role === Role.REGIONAL_ADMIN) {
    if (req.query.organizationId) {
      req.organizationId = req.query.organizationId as string;
    } else {
      req.organizationId = req.user.organizationId || undefined;
    }
    return next();
  }

  // Hospital staff can only access their own organization
  if (!req.user.organizationId) {
    return next(new ForbiddenError('User is not assigned to any organization'));
  }

  req.organizationId = req.user.organizationId;
  next();
}
