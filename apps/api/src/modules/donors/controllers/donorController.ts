import { Request, Response, NextFunction } from 'express';
import { DonorService } from '../services/donorService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const svc = new DonorService();

export class DonorController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.bloodType) filters.bloodType = req.query.bloodType;
      if (req.query.isEligible) filters.isEligible = req.query.isEligible === 'true';
      if (req.query.isAvailable) filters.isAvailable = req.query.isAvailable === 'true';
      const { donors, total } = await svc.getAll(filters, pagination);
      sendPaginated(res, donors, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getById(req.params.id)); } catch (e) { next(e); } }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendCreated(res, await svc.create(req.body)); } catch (e) { next(e); } }
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.update(req.params.id, req.body), 'Donor updated'); } catch (e) { next(e); } }
  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.delete(req.params.id)); } catch (e) { next(e); } }
  static async checkEligibility(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.checkEligibility(req.params.id)); } catch (e) { next(e); } }
  static async findEligible(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const bloodType = req.query.bloodType as string;
      let coordinates: [number, number] | undefined;
      if (req.query.lng && req.query.lat) coordinates = [parseFloat(req.query.lng as string), parseFloat(req.query.lat as string)];
      sendSuccess(res, await svc.findEligibleDonors(bloodType, coordinates, parseFloat(req.query.maxDistance as string) || 50));
    } catch (e) { next(e); }
  }
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await svc.getDonorStats()); } catch (e) { next(e); } }
}
