import { Router } from 'express';
import { DonorController } from '../controllers/donorController';
import { authenticate, authorize, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createDonorSchema, updateDonorSchema } from '../validators/donorValidators';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), DonorController.getAll);
router.get('/eligible', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), DonorController.findEligible);
router.get('/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), DonorController.getStats);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), DonorController.getById);
router.get('/:id/eligibility', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), DonorController.checkEligibility);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), validate({ body: createDonorSchema }), DonorController.create);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), validate({ body: updateDonorSchema }), DonorController.update);
router.delete('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), DonorController.delete);

export { router as donorRoutes };
