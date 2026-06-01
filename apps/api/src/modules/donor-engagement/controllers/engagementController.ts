import { Request, Response, NextFunction } from 'express';
import { EngagementService } from '../services/engagementService';
import { sendSuccess } from '../../../core/utils';

export class EngagementController {
  private static service = new EngagementService();

  static getProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const profile = await EngagementController.service.getOrCreateProfile(donorId);
      sendSuccess(res, { profile });
    } catch (error) {
      next(error);
    }
  };

  static getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const stats = await EngagementController.service.getDonorStats(donorId);
      sendSuccess(res, stats);
    } catch (error) {
      next(error);
    }
  };

  static getImpactMetrics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const impact = await EngagementController.service.getImpactMetrics(donorId);
      sendSuccess(res, impact);
    } catch (error) {
      next(error);
    }
  };

  static getBadges = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = (req.params.donorId || req.user?.id?.toString()) as string;
      const badges = await EngagementController.service.getBadges(donorId);
      sendSuccess(res, { badges });
    } catch (error) {
      next(error);
    }
  };

  static recordDonation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.params.donorId;
      const volumeMl = req.body.volumeMl || 450;
      const engagement = await EngagementController.service.recordDonation(donorId, volumeMl);
      sendSuccess(res, { engagement }, 'Donation recorded in engagement');
    } catch (error) {
      next(error);
    }
  };

  static recordEmergencyResponse = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.params.donorId;
      await EngagementController.service.recordEmergencyResponse(donorId);
      sendSuccess(res, {}, 'Emergency response recorded');
    } catch (error) {
      next(error);
    }
  };

  static recordCampaignParticipation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.params.donorId;
      await EngagementController.service.recordCampaignParticipation(donorId);
      sendSuccess(res, {}, 'Campaign participation recorded');
    } catch (error) {
      next(error);
    }
  };

  static getLeaderboard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const sortBy = (req.query.sortBy as string) || 'estimatedLivesSaved';
      const leaderboard = await EngagementController.service.getLeaderboard(limit, sortBy);
      sendSuccess(res, { leaderboard });
    } catch (error) {
      next(error);
    }
  };

  static getGlobalStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await EngagementController.service.getGlobalStats();
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };
}
