/**
 * Intelligence Routes
 * 
 * API routes for all ML/AI intelligence endpoints.
 * Protected by authentication and role-based authorization.
 */

import { Router } from 'express';
import { IntelligenceController } from '../controllers/intelligenceController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();

// All intelligence routes require authentication
router.use(authenticate);

// ── ML Service Health ───────────────────────────────
router.get(
  '/health',
  authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN),
  IntelligenceController.checkHealth
);

// ── National Intelligence APIs ──────────────────────

router.get(
  '/forecast',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST,
    Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN
  ),
  IntelligenceController.getForecast
);

router.post(
  '/forecast',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST,
    Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN
  ),
  IntelligenceController.getForecast
);


router.get(
  '/shortage-risk',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST,
    Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN
  ),
  IntelligenceController.getShortageRisk
);

router.post(
  '/redistribution',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN
  ),
  IntelligenceController.getRedistribution
);

router.post(
  '/anomaly',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST
  ),
  IntelligenceController.detectAnomalies
);

// ── Hospital Intelligence APIs ──────────────────────

router.post(
  '/expiry-risk',
  authorize(
    Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN,
    Role.HOSPITAL_ADMIN, Role.LAB_STAFF
  ),
  IntelligenceController.getExpiryRisk
);

export { router as intelligenceRoutes };
