import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/userService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

const userService = new UserService();

export class UserController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = {};
      if (req.query.role) filters.role = req.query.role;
      if (req.query.status) filters.status = req.query.status;
      if (req.query.organizationId) filters.organizationId = req.query.organizationId;
      if (req.query.search) {
        filters.$or = [
          { firstName: { $regex: req.query.search, $options: 'i' } },
          { lastName: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ];
      }
      const { users, total } = await userService.getAllUsers(filters, pagination);
      sendPaginated(res, users, { page: pagination.page, limit: pagination.limit, total });
    } catch (error) { next(error); }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.getUserById(req.params.id);
      sendSuccess(res, user);
    } catch (error) { next(error); }
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body);
      sendCreated(res, user);
    } catch (error) { next(error); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.updateUser(req.params.id, req.body);
      sendSuccess(res, user, 'User updated');
    } catch (error) { next(error); }
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.deleteUser(req.params.id);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  static async savePushToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.savePushToken(req.user!.id, req.body.token);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }

  static async removePushToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await userService.removePushToken(req.user!.id, req.body.token);
      sendSuccess(res, result);
    } catch (error) { next(error); }
  }
}
