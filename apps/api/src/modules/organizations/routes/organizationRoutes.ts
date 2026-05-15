import { Router } from 'express';
import { OrganizationController } from '../controllers/organizationController';
import { authenticate, authorize, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createOrganizationSchema, updateOrganizationSchema } from '../validators/organizationValidators';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), OrganizationController.getAll);
router.get('/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), OrganizationController.getStats);
router.get('/nearby', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), OrganizationController.getNearby);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), OrganizationController.getById);
router.get('/:id/children', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN), OrganizationController.getHierarchy);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), validate({ body: createOrganizationSchema }), OrganizationController.create);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), validate({ body: updateOrganizationSchema }), OrganizationController.update);
router.delete('/:id', authorize(Role.SUPER_ADMIN), OrganizationController.delete);

export { router as organizationRoutes };
