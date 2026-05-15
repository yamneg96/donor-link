import { Request, Response, NextFunction } from 'express';
import { HospitalService } from '../services/hospitalService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const svc = new HospitalService();

export class HospitalController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.search) filters.name = { $regex: req.query.search, $options: 'i' };
      if (req.query.hasBloodBank) filters.hasBloodBank = req.query.hasBloodBank === 'true';
      const { hospitals, total } = await svc.getAll(filters, pagination);
      sendPaginated(res, hospitals, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await svc.getById(req.params.id)); } catch (e) { next(e); }
  }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendCreated(res, await svc.create(req.body)); } catch (e) { next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await svc.update(req.params.id, req.body), 'Hospital updated'); } catch (e) { next(e); }
  }
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await svc.delete(req.params.id)); } catch (e) { next(e); }
  }
  static async getNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lng = parseFloat(req.query.lng as string); const lat = parseFloat(req.query.lat as string);
      sendSuccess(res, await svc.getNearby([lng, lat], parseFloat(req.query.maxDistance as string) || 50));
    } catch (e) { next(e); }
  }
}
