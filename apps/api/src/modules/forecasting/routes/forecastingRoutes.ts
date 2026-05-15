import { Router } from 'express';
import { ForecastingController } from '../controllers/forecastingController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';
const router = Router();
router.use(authenticate);
router.get('/demand', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), ForecastingController.getForecast);
router.get('/seasonal', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), ForecastingController.getSeasonalPatterns);
export { router as forecastingRoutes };
