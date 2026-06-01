import { Router } from 'express';
import { ShipmentController } from '../controllers/shipmentController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();
router.use(authenticate);

// Create shipment
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.create);

// Active shipments & cold chain
router.get('/active', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.getActive);
router.get('/cold-chain-breaches', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), ShipmentController.getColdChainBreaches);
router.get('/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), ShipmentController.getStats);

// Hospital shipments
router.get('/hospital/:hospitalId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.getByHospital);

// Transfer lookup
router.get('/transfer/:transferId', ShipmentController.getByTransfer);

// Single shipment operations
router.get('/:id', ShipmentController.getById);
router.post('/:id/status', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.updateStatus);
router.post('/:id/cold-chain', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.recordColdChain);
router.post('/:id/eta', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER), ShipmentController.recalculateETA);

export { router as shipmentRoutes };
