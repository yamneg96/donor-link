import { Request, Response, NextFunction } from 'express';
import { InventoryService } from '../services/inventoryService';
import { sendSuccess, sendPaginated, parsePagination } from '../../../core/utils';

export class InventoryController {
  private static service = new InventoryService();

  static getAllUnits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const filters = { ...req.query };
      delete filters.page;
      delete filters.limit;

      // Ensure users only see units in their scope unless they are NATIONAL_ADMIN
      if (req.user?.organizationId) {
        filters.currentHospitalId = req.user.organizationId;
      }

      const result = await InventoryController.service.getAllUnits(filters, pagination);
      sendPaginated(res, result.units, { page: pagination.page, limit: pagination.limit, total: result.total });
    } catch (error) {
      next(error);
    }
  };

  static getStockLevels = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // If user has organizationId, scope to that org
      const orgId = req.user?.organizationId?.toString();
      const levels = await InventoryController.service.getStockLevels(orgId);
      sendSuccess(res, { levels });
    } catch (error) {
      next(error);
    }
  };

  static getStockByOrganization = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const stock = await InventoryController.service.getStockByOrganization();
      sendSuccess(res, { stock });
    } catch (error) {
      next(error);
    }
  };

  static getExpiringUnits = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const days = req.query.days ? parseInt(req.query.days as string, 10) : 3;
      const units = await InventoryController.service.getExpiringUnits(days);
      sendSuccess(res, { units });
    } catch (error) {
      next(error);
    }
  };

  static getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const orgId = req.user?.organizationId?.toString();
      const stats = await InventoryController.service.getInventoryStats(orgId);
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };

  static getUnitByBarcode = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await InventoryController.service.getUnitByBarcode(req.params.barcode);
      sendSuccess(res, { unit });
    } catch (error) {
      next(error);
    }
  };

  static getOrganizationLedger = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const ledger = await InventoryController.service.getOrganizationLedger(req.params.orgId, pagination);
      sendPaginated(res, ledger.entries, { page: pagination.page, limit: pagination.limit, total: ledger.total });
    } catch (error) {
      next(error);
    }
  };

  static getUnitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await InventoryController.service.getUnitById(req.params.id);
      sendSuccess(res, { unit });
    } catch (error) {
      next(error);
    }
  };

  static getUnitLedger = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const ledger = await InventoryController.service.getUnitLedger(req.params.id);
      sendSuccess(res, { ledger });
    } catch (error) {
      next(error);
    }
  };

  static reserveUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { requestId } = req.body;
      const unit = await InventoryController.service.reserveUnit(req.params.id, requestId, req.user!.id.toString());
      sendSuccess(res, { unit }, 'Unit reserved successfully', 200);
    } catch (error) {
      next(error);
    }
  };

  static releaseReservation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await InventoryController.service.releaseReservation(req.params.id, req.user!.id.toString());
      sendSuccess(res, { unit }, 'Unit reservation released', 200);
    } catch (error) {
      next(error);
    }
  };

  static markAsUsed = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await InventoryController.service.markAsUsed(req.params.id, req.user!.id.toString());
      sendSuccess(res, { unit }, 'Unit marked as used', 200);
    } catch (error) {
      next(error);
    }
  };

  static markAsExpired = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const unit = await InventoryController.service.markAsExpired(req.params.id, req.user!.id.toString());
      sendSuccess(res, { unit }, 'Unit marked as expired', 200);
    } catch (error) {
      next(error);
    }
  };

  static discardUnit = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      const unit = await InventoryController.service.discardUnit(req.params.id, reason, req.user!.id.toString());
      sendSuccess(res, { unit }, 'Unit discarded', 200);
    } catch (error) {
      next(error);
    }
  };
}
