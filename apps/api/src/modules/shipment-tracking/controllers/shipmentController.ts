import { Request, Response, NextFunction } from 'express';
import { ShipmentService } from '../services/shipmentService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

export class ShipmentController {
  private static service = new ShipmentService();

  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await ShipmentController.service.create(req.body, req.user!.id.toString());
      sendCreated(res, shipment, 'Shipment created');
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await ShipmentController.service.getById(req.params.id);
      sendSuccess(res, { shipment });
    } catch (error) {
      next(error);
    }
  };

  static getByTransfer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await ShipmentController.service.getByTransfer(req.params.transferId);
      sendSuccess(res, { shipment });
    } catch (error) {
      next(error);
    }
  };

  static getByHospital = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const hospitalId = (req.params.hospitalId || req.user?.organizationId?.toString()) as string;
      const direction = (req.query.direction as 'source' | 'destination' | 'both') || 'both';
      const result = await ShipmentController.service.getByHospital(hospitalId, direction, pagination);
      sendPaginated(res, result.shipments, { page: pagination.page, limit: pagination.limit, total: result.total });
    } catch (error) {
      next(error);
    }
  };

  static getActive = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const shipments = await ShipmentController.service.getActiveShipments();
      sendSuccess(res, { shipments });
    } catch (error) {
      next(error);
    }
  };

  static updateStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { status, location, coordinates, notes } = req.body;
      const shipment = await ShipmentController.service.updateStatus(
        req.params.id, status, req.user!.id.toString(), { location, coordinates, notes }
      );
      sendSuccess(res, { shipment }, 'Shipment status updated');
    } catch (error) {
      next(error);
    }
  };

  static recordColdChain = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const shipment = await ShipmentController.service.recordColdChainReading(req.params.id, req.body);
      sendSuccess(res, { shipment }, 'Cold chain reading recorded');
    } catch (error) {
      next(error);
    }
  };

  static getColdChainBreaches = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const breaches = await ShipmentController.service.getColdChainBreaches();
      sendSuccess(res, { breaches });
    } catch (error) {
      next(error);
    }
  };

  static getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await ShipmentController.service.getStats();
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };

  static recalculateETA = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { eta } = req.body;
      const shipment = await ShipmentController.service.recalculateETA(req.params.id, new Date(eta));
      sendSuccess(res, { shipment }, 'ETA updated');
    } catch (error) {
      next(error);
    }
  };
}
