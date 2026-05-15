import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';
import { EmergencyEvent } from '../models/EmergencyEvent';
import { EmergencyStatus } from '../../../core/constants';
import { eventBus, EventType } from '../../../core/events';

export class EmergencyController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.severity) filters.severity = req.query.severity;
      const [events, total] = await Promise.all([
        EmergencyEvent.find(filters).populate('organizationId', 'name code').populate('declaredBy', 'firstName lastName').sort({ createdAt: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        EmergencyEvent.countDocuments(filters),
      ]);
      sendPaginated(res, events, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await EmergencyEvent.findById(req.params.id).populate('organizationId declaredBy')); } catch (e) { next(e); } }
  static async declare(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await EmergencyEvent.create({ ...req.body, declaredBy: req.user!.id });
      eventBus.emitEvent(EventType.EMERGENCY_DECLARED, { emergencyId: event._id.toString(), severity: event.severity, bloodTypes: event.bloodTypesNeeded });
      sendCreated(res, event, 'Emergency declared');
    } catch (e) { next(e); }
  }
  static async resolve(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = await EmergencyEvent.findByIdAndUpdate(req.params.id, { status: EmergencyStatus.RESOLVED, resolvedBy: req.user!.id, resolvedAt: new Date() }, { new: true });
      eventBus.emitEvent(EventType.EMERGENCY_RESOLVED, { emergencyId: req.params.id });
      sendSuccess(res, event, 'Emergency resolved');
    } catch (e) { next(e); }
  }
  static async update(req: Request, res: Response, next: NextFunction): Promise<void> { try { sendSuccess(res, await EmergencyEvent.findByIdAndUpdate(req.params.id, req.body, { new: true })); } catch (e) { next(e); } }
}
