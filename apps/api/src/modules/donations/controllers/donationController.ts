import { Request, Response, NextFunction } from 'express';
import { DonationService } from '../services/donationService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const svc = new DonationService();

export class DonationController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.organizationId) filters.organizationId = req.query.organizationId;
      if (req.query.donorId) filters.donorId = req.query.donorId;
      if (req.query.bloodType) filters.bloodType = req.query.bloodType;
      if (req.query.status) filters.status = req.query.status;
      if (req.organizationId) filters.organizationId = req.organizationId;
      const { donations, total } = await svc.getAll(filters, pagination);
      sendPaginated(res, donations, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getById(req.params.id)); } catch (e) { next(e); } }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendCreated(res, await svc.create(req.body)); } catch (e) { next(e); } }
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.update(req.params.id, req.body), 'Donation updated'); } catch (e) { next(e); } }
  static async process(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.processDonation(req.params.id), 'Donation processed, blood unit created'); } catch (e) { next(e); } }
}
