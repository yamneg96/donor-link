import { Router } from 'express';
import { DashboardController } from '../controllers/dashboardController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';
const router = Router();

router.get('/stats', DashboardController.getPublicStats);

router.use(authenticate);
router.get('/national', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), DashboardController.getNationalDashboard);
router.get('/hospital/:orgId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), DashboardController.getHospitalDashboard);
router.get('/hospital', authorize(Role.HOSPITAL_ADMIN, Role.LAB_STAFF), DashboardController.getHospitalDashboard);
export { router as dashboardRoutes };
