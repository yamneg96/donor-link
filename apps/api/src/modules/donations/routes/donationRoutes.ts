import { Router } from 'express';
import { DonationController } from '../controllers/donationController';
import { authenticate, authorize, organizationScope, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createDonationSchema, updateDonationSchema } from '../validators/donationValidators';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF, Role.DONOR_COORDINATOR), organizationScope, DonationController.getAll);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), DonationController.getById);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF, Role.DONOR_COORDINATOR), validate({ body: createDonationSchema }), DonationController.create);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), validate({ body: updateDonationSchema }), DonationController.update);
router.post('/:id/process', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), DonationController.process);

export { router as donationRoutes };
