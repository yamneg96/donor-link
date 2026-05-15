import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated, parsePagination } from '../../../core/utils';
import { AuditLog } from '../models/AuditLog';

export class AuditController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.entityType) filters.entityType = req.query.entityType;
      if (req.query.action) filters.action = req.query.action;
      if (req.query.performedBy) filters.performedBy = req.query.performedBy;
      if (req.query.organizationId) filters.organizationId = req.query.organizationId;
      const [logs, total] = await Promise.all([
        AuditLog.find(filters).populate('performedBy', 'firstName lastName email').sort({ timestamp: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        AuditLog.countDocuments(filters),
      ]);
      sendPaginated(res, logs, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getByEntity(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const logs = await AuditLog.find({ entityType: req.params.entityType, entityId: req.params.entityId }).populate('performedBy', 'firstName lastName').sort({ timestamp: -1 });
      sendSuccess(res, logs);
    } catch (e) { next(e); }
  }
}
