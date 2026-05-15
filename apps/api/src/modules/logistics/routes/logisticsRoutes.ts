import { Router } from 'express';
import { LogisticsController } from '../controllers/logisticsController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';
const router = Router();
router.use(authenticate);
router.get('/eta', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), LogisticsController.estimateETA);
router.get('/dashboard', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.DISPATCHER), LogisticsController.getDashboard);
export { router as logisticsRoutes };
