import { Router } from 'express';
import { EligibilityController } from '../controllers/eligibilityController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();
router.use(authenticate);

// Donor self-service
router.get('/check', EligibilityController.checkEligibility);
router.get('/check/:donorId', EligibilityController.checkEligibility);
router.get('/history/:donorId', EligibilityController.getDonorHistory);
router.get('/restrictions/:donorId', EligibilityController.getActiveRestrictions);

// Staff operations
router.post('/screen/:donorId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF, Role.DONOR_COORDINATOR), EligibilityController.screenDonor);
router.post('/restrictions/:donorId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), EligibilityController.addRestriction);
router.delete('/restrictions/:recordId/:restrictionId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), EligibilityController.removeRestriction);

// Admin
router.get('/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), EligibilityController.getStats);
router.get('/:id', EligibilityController.getById);

export { router as eligibilityRoutes };
