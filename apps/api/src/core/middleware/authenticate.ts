import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/crypto';
import { UnauthorizedError } from '../errors';
import { AuthUser } from '../types';
import { Role } from '../constants';

/**
 * JWT authentication middleware.
 * Verifies Bearer token and attaches authenticated user to request.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No authentication token provided');
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError('Invalid token format');
    }

    const decoded = verifyAccessToken(token);

    const user: AuthUser = {
      id: decoded.id as string,
      email: decoded.email as string,
      role: decoded.role as Role,
      organizationId: (decoded.organizationId as string) || null,
      firstName: decoded.firstName as string,
      lastName: decoded.lastName as string,
    };

    req.user = user;
    next();
  } catch (error: unknown) {
    if (error instanceof UnauthorizedError) {
      next(error);
    } else {
      next(new UnauthorizedError('Invalid or expired token'));
    }
  }
}
