import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendPaginated, parsePagination } from '../../../core/utils';
import { Notification } from '../models/Notification';
import { NotificationStatus } from '../../../core/constants';

export class NotificationController {
  static async getMyNotifications(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = { userId: req.user!.id };
      if (req.query.status) filters.status = req.query.status;
      const [notifications, total] = await Promise.all([
        Notification.find(filters).sort({ createdAt: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        Notification.countDocuments(filters),
      ]);
      sendPaginated(res, notifications, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }
  static async markAsRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { sendSuccess(res, await Notification.findByIdAndUpdate(req.params.id, { status: NotificationStatus.READ, readAt: new Date() }, { new: true }), 'Notification read'); } catch (e) { next(e); }
  }
  static async markAllRead(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await Notification.updateMany({ userId: req.user!.id, status: { $ne: NotificationStatus.READ } }, { status: NotificationStatus.READ, readAt: new Date() });
      sendSuccess(res, { message: 'All notifications marked as read' });
    } catch (e) { next(e); }
  }
  static async getUnreadCount(req: Request, res: Response, next: NextFunction): Promise<void> {
    try { const count = await Notification.countDocuments({ userId: req.user!.id, status: { $ne: NotificationStatus.READ } }); sendSuccess(res, { unreadCount: count }); } catch (e) { next(e); }
  }
}
