import { Router } from 'express';
import { EngagementController } from '../controllers/engagementController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();
router.use(authenticate);

// Public / donor-facing
router.get('/my', EngagementController.getProfile);
router.get('/my/stats', EngagementController.getStats);
router.get('/my/impact', EngagementController.getImpactMetrics);
router.get('/my/badges', EngagementController.getBadges);

// Leaderboard (any authenticated user)
router.get('/leaderboard', EngagementController.getLeaderboard);
router.get('/global-stats', EngagementController.getGlobalStats);

// Donor-specific lookups (staff)
router.get('/:donorId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), EngagementController.getProfile);
router.get('/:donorId/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), EngagementController.getStats);
router.get('/:donorId/impact', EngagementController.getImpactMetrics);
router.get('/:donorId/badges', EngagementController.getBadges);

// Staff engagement recording
router.post('/:donorId/record-donation', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), EngagementController.recordDonation);
router.post('/:donorId/emergency-response', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), EngagementController.recordEmergencyResponse);
router.post('/:donorId/campaign-participation', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR), EngagementController.recordCampaignParticipation);

export { router as engagementRoutes };
