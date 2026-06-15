import { Router } from 'express';
import { BloodDispatchController } from '../controllers/bloodDispatchController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();

router.use(authenticate);

// View all (scoping handled in controller)
router.get('/', BloodDispatchController.getAll);

// Create dispatch (ENBB/Regional only)
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN), BloodDispatchController.create);

// Receive dispatch (Hospital only)
router.patch('/:id/receive', authorize(Role.HOSPITAL_ADMIN, Role.LAB_STAFF), BloodDispatchController.receive);

router.get('/:id', BloodDispatchController.getById);

export { router as dispatchRoutes };
