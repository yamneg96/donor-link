import { Request, Response, NextFunction } from 'express';
import { TransferService } from '../services/transferService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';
const svc = new TransferService();

export class TransferController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.priority) filters.priority = req.query.priority;
      if (req.query.fromOrgId) filters.fromOrgId = req.query.fromOrgId;
      if (req.query.toOrgId) filters.toOrgId = req.query.toOrgId;
      const { transfers, total } = await svc.getAll(filters, pagination);
      sendPaginated(res, transfers, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getById(req.params.id)); } catch (e) { next(e); } }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendCreated(res, await svc.create({ ...req.body, requestedBy: req.user!.id })); } catch (e) { next(e); } }
  static async approve(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.approve(req.params.id, req.user!.id), 'Transfer approved'); } catch (e) { next(e); } }
  static async reject(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.reject(req.params.id, req.user!.id, req.body.reason || ''), 'Transfer rejected'); } catch (e) { next(e); } }
  static async dispatch(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.dispatch(req.params.id, req.body, req.user!.id), 'Transfer dispatched'); } catch (e) { next(e); } }
  static async receive(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.receive(req.params.id, req.user!.id), 'Transfer received'); } catch (e) { next(e); } }
  static async cancel(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.cancel(req.params.id), 'Transfer cancelled'); } catch (e) { next(e); } }
  static async getShipment(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getShipment(req.params.id)); } catch (e) { next(e); } }
  static async addTracking(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.addTracking(req.params.id, req.body)); } catch (e) { next(e); } }
}
