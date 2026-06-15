import { Router } from 'express';
import { TransfusionController } from '../controllers/transfusionController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();

router.use(authenticate);

// National/Regional view all
router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN), TransfusionController.getAll);

// Hospital specific
router.get('/my-hospital', authorize(Role.HOSPITAL_ADMIN, Role.LAB_STAFF), TransfusionController.getMyHospitalTransfusions);
router.post('/record', authorize(Role.HOSPITAL_ADMIN, Role.LAB_STAFF), TransfusionController.record);

// Common
router.get('/:id', TransfusionController.getById);
router.patch('/:id', authorize(Role.HOSPITAL_ADMIN, Role.LAB_STAFF), TransfusionController.update);

export { router as transfusionRoutes };
