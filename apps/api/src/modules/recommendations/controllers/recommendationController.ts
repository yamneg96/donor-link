import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated, parsePagination } from '../../../core/utils';
import { Recommendation } from '../models/Recommendation';
import { RecommendationStatus } from '../../../core/constants';

export class RecommendationController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.type) filters.type = req.query.type;
      if (req.query.status) filters.status = req.query.status;
      const [recs, total] = await Promise.all([
        Recommendation.find(filters).populate('sourceOrgId', 'name code').populate('targetOrgId', 'name code').sort({ priority: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        Recommendation.countDocuments(filters),
      ]);
      sendPaginated(res, recs, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await Recommendation.findById(req.params.id).populate('sourceOrgId targetOrgId')); } catch (e) { next(e); } }
  static async accept(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Recommendation.findByIdAndUpdate(req.params.id, { status: RecommendationStatus.ACCEPTED, implementedBy: req.user!.id, implementedAt: new Date() }, { new: true }), 'Recommendation accepted'); } catch (e) { next(e); }
  }
  static async reject(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Recommendation.findByIdAndUpdate(req.params.id, { status: RecommendationStatus.REJECTED }, { new: true }), 'Recommendation rejected'); } catch (e) { next(e); }
  }
}
