import { Request, Response, NextFunction } from 'express';
import { OrganizationService } from '../services/organizationService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const orgService = new OrganizationService();

export class OrganizationController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.type) filters.type = req.query.type;
      if (req.query.region) filters.region = req.query.region;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.search) filters.name = { $regex: req.query.search, $options: 'i' };
      const { organizations, total } = await orgService.getAll(filters, pagination);
      sendPaginated(res, organizations, { page: pagination.page, limit: pagination.limit, total });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await orgService.getById(req.params.id)); } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendCreated(res, await orgService.create(req.body)); } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await orgService.update(req.params.id, req.body), 'Organization updated'); } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await orgService.delete(req.params.id)); } catch (error) { next(error); }
  }

  static async getHierarchy(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await orgService.getHierarchy(req.params.id)); } catch (error) { next(error); }
  }

  static async getNearby(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const lng = parseFloat(req.query.lng as string);
      const lat = parseFloat(req.query.lat as string);
      const maxDistance = parseFloat(req.query.maxDistance as string) || 50;
      sendSuccess(res, await orgService.getNearby([lng, lat], maxDistance));
    } catch (error) { next(error); }
  }

  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await orgService.getStats()); } catch (error) { next(error); }
  }
}
