import { Request, Response, NextFunction } from 'express';
import { BloodDispatchService } from '../services/bloodDispatchService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const svc = new BloodDispatchService();

export class BloodDispatchController {
  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dispatchedBy = req.user!.id;
      const dispatch = await svc.createDispatch({ ...req.body, dispatchedBy }, dispatchedBy);
      sendCreated(res, dispatch, 'Blood units dispatched successfully');
    } catch (e) { next(e); }
  }

  static async receive(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { receiptNotes, damagedUnits } = req.body;
      const dispatch = await svc.markAsReceived(req.params.id, req.user!.id, receiptNotes, damagedUnits);
      sendSuccess(res, dispatch, 'Dispatch received and inventory updated');
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dispatch = await svc.getDispatchById(req.params.id);
      sendSuccess(res, dispatch);
    } catch (e) { next(e); }
  }

  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as any);
      const filters: any = {};
      
      // Scoping logic
      if (req.user?.organizationId) {
        const orgId = req.user.organizationId.toString();
        // If it's a hospital, they see dispatches TO them
        // If it's regional, they see dispatches FROM or TO them
        filters.$or = [{ fromOrgId: orgId }, { toOrgId: orgId }];
      }

      if (req.query.status) filters.status = req.query.status;
      
      const result = await svc.getDispatches(filters, pagination);
      sendPaginated(res, result.dispatches, { ...pagination, total: result.total });
    } catch (e) { next(e); }
  }
}
