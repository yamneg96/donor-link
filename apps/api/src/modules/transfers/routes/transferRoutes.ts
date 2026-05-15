import { Router } from 'express';
import { TransferController } from '../controllers/transferController';
import { authenticate, authorize, validate } from '../../../core/middleware';
import { Role } from '../../../core/constants';
import { createTransferSchema, dispatchTransferSchema } from '../validators/transferValidators';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), TransferController.getAll);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), TransferController.getById);
router.get('/:id/shipment', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), TransferController.getShipment);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), validate({ body: createTransferSchema }), TransferController.create);
router.post('/:id/approve', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), TransferController.approve);
router.post('/:id/reject', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN), TransferController.reject);
router.post('/:id/dispatch', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), validate({ body: dispatchTransferSchema }), TransferController.dispatch);
router.post('/:id/receive', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), TransferController.receive);
router.post('/:id/cancel', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), TransferController.cancel);
router.post('/:id/tracking', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.DISPATCHER), TransferController.addTracking);

export { router as transferRoutes };
