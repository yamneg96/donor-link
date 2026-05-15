import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';
import { Alert } from '../models/Alert';
import { AlertStatus } from '../../../core/constants';

export class AlertController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.type) filters.type = req.query.type;
      if (req.query.severity) filters.severity = req.query.severity;
      if (req.query.status) filters.status = req.query.status;
      if (req.organizationId) filters.organizationId = req.organizationId;
      const [alerts, total] = await Promise.all([
        Alert.find(filters).populate('organizationId', 'name code').sort({ createdAt: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        Alert.countDocuments(filters),
      ]);
      sendPaginated(res, alerts, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Alert.findById(req.params.id).populate('organizationId', 'name code')); } catch (e) { next(e); }
  }
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendCreated(res, await Alert.create(req.body)); } catch (e) { next(e); }
  }
  static async acknowledge(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Alert.findByIdAndUpdate(req.params.id, { status: AlertStatus.ACKNOWLEDGED, acknowledgedBy: req.user!.id, acknowledgedAt: new Date() }, { new: true }), 'Alert acknowledged'); } catch (e) { next(e); }
  }
  static async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Alert.findByIdAndUpdate(req.params.id, { status: AlertStatus.RESOLVED, resolvedBy: req.user!.id, resolvedAt: new Date() }, { new: true }), 'Alert resolved'); } catch (e) { next(e); }
  }
}
