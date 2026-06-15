import { Request, Response, NextFunction } from 'express';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';
import { Campaign } from '../models/Campaign';
import { Organization } from '../../organizations/models/Organization';
import { OrganizationType } from '../../../core/constants';
import { eventBus, EventType } from '../../../core/events';

export class CampaignController {
  static async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, unknown>);
      const filters: Record<string, unknown> = { isDeleted: false };
      if (req.query.status) filters.status = req.query.status;
      if (req.query.type) filters.type = req.query.type;
      const [campaigns, total] = await Promise.all([
        Campaign.find(filters).populate('organizationId', 'name code').populate('createdBy', 'firstName lastName').sort({ createdAt: -1 }).skip((pagination.page - 1) * pagination.limit).limit(pagination.limit),
        Campaign.countDocuments(filters),
      ]);
      sendPaginated(res, campaigns, { page: pagination.page, limit: pagination.limit, total });
    } catch (e) { next(e); }
  }

  static async getById(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try { 
      sendSuccess(res, await Campaign.findById(req.params.id).populate('organizationId', 'name code')); 
    } catch (e) { next(e); } 
  }

  static async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      let organizationId = req.body.organizationId || req.user!.organizationId;
      if (!organizationId) {
        const org = await Organization.findOne({ type: OrganizationType.NATIONAL_BLOOD_BANK }) || await Organization.findOne();
        if (org) organizationId = org._id;
      }
      const goal = req.body.goal || req.body.goalUnits || 100;
      const campaign = await Campaign.create({
        ...req.body,
        organizationId,
        goal,
        createdBy: req.user!.id,
      });

      // Emit event for subscribers (like NotificationSubscriber)
      eventBus.emitEvent(EventType.CAMPAIGN_TRIGGERED, { 
        campaignId: campaign._id.toString(), 
        title: campaign.title,
        location: campaign?.location 
      });

      sendCreated(res, campaign);
    } catch (e) { next(e); }
  }

  static async update(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try { 
      sendSuccess(res, await Campaign.findByIdAndUpdate(req.params.id, req.body, { new: true }), 'Campaign updated'); 
    } catch (e) { next(e); } 
  }

  static async delete(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try { 
      await Campaign.findByIdAndUpdate(req.params.id, { isDeleted: true }); 
      sendSuccess(res, { message: 'Campaign deleted' }); 
    } catch (e) { next(e); } 
  }

  static async updateProgress(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try { 
      sendSuccess(res, await Campaign.findByIdAndUpdate(req.params.id, { currentProgress: req.body.progress }, { new: true }), 'Progress updated'); 
    } catch (e) { next(e); } 
  }
}
