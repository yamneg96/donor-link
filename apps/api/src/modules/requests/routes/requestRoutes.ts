import { Router } from 'express';
import { RequestController } from '../controllers/requestController';
import { authenticate, authorize, organizationScope, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createRequestSchema } from '../validators/requestValidators';

const router = Router();
router.use(authenticate);
router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), organizationScope, RequestController.getAll);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), RequestController.getById);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), validate({ body: createRequestSchema }), RequestController.create);
router.post('/:id/fulfill', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), RequestController.fulfill);
router.post('/:id/cancel', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), RequestController.cancel);
export { router as requestRoutes };
