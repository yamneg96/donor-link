import { Router } from 'express';
import { HospitalController } from '../controllers/hospitalController';
import { authenticate, authorize, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createHospitalSchema, updateHospitalSchema } from '../validators/hospitalValidators';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), HospitalController.getAll);
router.get('/nearby', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), HospitalController.getNearby);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), HospitalController.getById);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), validate({ body: createHospitalSchema }), HospitalController.create);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), validate({ body: updateHospitalSchema }), HospitalController.update);
router.delete('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), HospitalController.delete);

export { router as hospitalRoutes };
