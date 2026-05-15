import { Router } from 'express';
import { AuditController } from '../controllers/auditController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';
const router = Router();
router.use(authenticate);
router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), AuditController.getAll);
router.get('/:entityType/:entityId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), AuditController.getByEntity);
export { router as auditRoutes };
