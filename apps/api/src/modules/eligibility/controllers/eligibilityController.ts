import { Request, Response, NextFunction } from 'express';
import { EligibilityService } from '../services/eligibilityService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

export class EligibilityController {
  private static service = new EligibilityService();

  static screenDonor = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.body.donorId || req.params.donorId;
      const result = await EligibilityController.service.screenDonor(req.body, donorId);
      sendCreated(res, result, 'Screening completed');
    } catch (error) {
      next(error);
    }
  };

  static checkEligibility = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const result = await EligibilityController.service.checkEligibility(donorId);
      sendSuccess(res, result);
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await EligibilityController.service.getById(req.params.id);
      sendSuccess(res, { record });
    } catch (error) {
      next(error);
    }
  };

  static getDonorHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const result = await EligibilityController.service.getDonorHistory(donorId, pagination);
      sendPaginated(res, result.records, { page: pagination.page, limit: pagination.limit, total: result.total });
    } catch (error) {
      next(error);
    }
  };

  static addRestriction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.params.donorId;
      const result = await EligibilityController.service.addRestriction(donorId, req.body, req.user!.id.toString());
      sendSuccess(res, { record: result }, 'Restriction added');
    } catch (error) {
      next(error);
    }
  };

  static removeRestriction = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await EligibilityController.service.removeRestriction(req.params.recordId, req.params.restrictionId);
      sendSuccess(res, { record: result }, 'Restriction deactivated');
    } catch (error) {
      next(error);
    }
  };

  static getActiveRestrictions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const restrictions = await EligibilityController.service.getActiveRestrictions(donorId);
      sendSuccess(res, { restrictions });
    } catch (error) {
      next(error);
    }
  };

  static getStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await EligibilityController.service.getStats();
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };
}
