import { Router } from 'express';
import { GeoController } from '../controllers/geoController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();

// Public nearby search (authenticated but any role)
router.get('/nearby', authenticate, GeoController.findNearby);

// Emergency radius search
router.post('/emergency-radius', authenticate, authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), GeoController.findInEmergencyRadius);

// Region-based lookup
router.get('/region/:region', authenticate, GeoController.getByRegion);

// Stats
router.get('/stats', authenticate, authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), GeoController.getRegionStats);

// Location management
router.post('/', authenticate, authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), GeoController.registerLocation);
router.get('/:entityType/:entityId', authenticate, GeoController.getEntityLocation);
router.put('/:entityType/:entityId', authenticate, authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), GeoController.updateLocation);

export { router as geoRoutes };
