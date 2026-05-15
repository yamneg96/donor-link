import { Router } from 'express';
import { UserController } from '../controllers/userController';
import { authenticate, authorize, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createUserSchema, updateUserSchema } from '../validators/userValidators';

const router = Router();

router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), UserController.getAll);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), UserController.getById);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), validate({ body: createUserSchema }), UserController.create);
router.put('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), validate({ body: updateUserSchema }), UserController.update);
router.delete('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN), UserController.delete);

export { router as userRoutes };
