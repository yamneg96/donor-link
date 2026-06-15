import { Request, Response, NextFunction } from 'express';
import { TransfusionService } from '../services/transfusionService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const svc = new TransfusionService();

export class TransfusionController {
  static async record(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const hospitalOrgId = req.user!.organizationId;
      const transfusion = await svc.recordTransfusion({ ...req.body, hospitalOrgId }, req.user!.id);
      sendCreated(res, transfusion, 'Transfusion recorded successfully');
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const transfusion = await svc.getTransfusionById(req.params.id);
      sendSuccess(res, transfusion);
    } catch (e) { next(e); }
  }

  static async getMyHospitalTransfusions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const hospitalOrgId = req.user!.organizationId!.toString();
      const result = await svc.getHospitalTransfusions(hospitalOrgId, pagination);
      sendPaginated(res, result.transfusions, { ...pagination, total: result.total });
    } catch (e) { next(e); }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const filters: any = {};
      if (req.query.hospitalOrgId) filters.hospitalOrgId = req.query.hospitalOrgId;
      if (req.query.bloodType) filters['bloodUnitId.bloodType'] = req.query.bloodType;
      
      const result = await svc.getAllTransfusions(filters, pagination);
      sendPaginated(res, result.transfusions, { ...pagination, total: result.total });
    } catch (e) { next(e); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { reason, ...updates } = req.body;
      if (!reason) {
        return next(new Error('Reason for update is required for accountability'));
      }
      const transfusion = await svc.updateTransfusion(req.params.id, updates, req.user!.id, reason);
      sendSuccess(res, transfusion, 'Transfusion record updated');
    } catch (e) { next(e); }
  }
}
