import { Request, Response, NextFunction } from 'express';
import { RequestService } from '../services/requestService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';
const svc = new RequestService();

export class RequestController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.bloodType) filters.bloodType = req.query.bloodType;
      if (req.query.urgency) filters.urgency = req.query.urgency;
      if (req.query.status) filters.status = req.query.status;
      if (req.organizationId) filters.requestingOrgId = req.organizationId;
      const { requests, total } = await svc.getAll(filters, pagination);
      sendPaginated(res, requests, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getById(req.params.id)); } catch (e) { next(e); } }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendCreated(res, await svc.create({ ...req.body, requestedBy: req.user!.id })); } catch (e) { next(e); } }
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.update(req.params.id, req.body)); } catch (e) { next(e); } }
  static async fulfill(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.fulfillUnit(req.params.id, req.body.unitId), 'Unit fulfilled'); } catch (e) { next(e); } }
  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.cancel(req.params.id), 'Request cancelled'); } catch (e) { next(e); } }
}
