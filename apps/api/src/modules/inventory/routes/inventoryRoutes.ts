import { Router } from 'express';
import { InventoryController } from '../controllers/inventoryController';
import { authenticate, authorize, organizationScope } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();
router.use(authenticate);

router.get('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), organizationScope, InventoryController.getAllUnits);
router.post('/', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.createUnit);
router.get('/stock-levels', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.getStockLevels);
router.get('/stock-by-org', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST), InventoryController.getStockByOrganization);
router.get('/expiring', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.getExpiringUnits);
router.get('/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.HOSPITAL_ADMIN), InventoryController.getStats);
router.get('/barcode/:barcode', authenticate, InventoryController.getUnitByBarcode);
router.get('/ledger/:orgId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), InventoryController.getOrganizationLedger);
router.get('/:id', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.getUnitById);
router.get('/:id/ledger', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), InventoryController.getUnitLedger);
router.post('/:id/reserve', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.reserveUnit);
router.post('/:id/release', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.releaseReservation);
router.post('/:id/use', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.markAsUsed);
router.post('/:id/expire', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.markAsExpired);
router.post('/:id/discard', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), InventoryController.discardUnit);

export { router as inventoryRoutes };
