import { AuthUser } from './common';

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
      organizationId?: string;
    }
  }
}
