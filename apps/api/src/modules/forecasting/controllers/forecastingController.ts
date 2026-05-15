import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../../core/utils';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { Donation } from '../../donations/models/Donation';
import { BloodUnitStatus, ALL_BLOOD_TYPES } from '../../../core/constants';

export class ForecastingController {
  /** Deterministic demand forecasting based on historical usage trends */
  static async getForecast(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.query.organizationId as string;
      const days = parseInt(req.query.days as string) || 30;

      // Historical usage per blood type over the last 90 days
      const ninetyDaysAgo = new Date(); ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);
      const match: Record<string, unknown> = { status: BloodUnitStatus.USED, isDeleted: false, usedAt: { $gte: ninetyDaysAgo } };
      if (orgId) match.currentHospitalId = require('mongoose').Types.ObjectId.createFromHexString(orgId);

      const usageTrend = await BloodUnit.aggregate([
        { $match: match },
        { $group: { _id: '$bloodType', totalUsed: { $sum: 1 } } },
      ]);

      // Calculate daily average usage and project forward
      const forecast = usageTrend.map((item: { _id: string; totalUsed: number }) => {
        const dailyAvg = item.totalUsed / 90;
        return {
          bloodType: item._id,
          dailyAvgUsage: Math.round(dailyAvg * 100) / 100,
          projectedDemand: Math.ceil(dailyAvg * days),
          forecastDays: days,
        };
      });

      // Current stock
      const stockMatch: Record<string, unknown> = { status: BloodUnitStatus.AVAILABLE, isDeleted: false };
      if (orgId) stockMatch.currentHospitalId = require('mongoose').Types.ObjectId.createFromHexString(orgId);
      const currentStock = await BloodUnit.aggregate([
        { $match: stockMatch },
        { $group: { _id: '$bloodType', available: { $sum: 1 } } },
      ]);

      const stockMap = new Map(currentStock.map((s: { _id: string; available: number }) => [s._id, s.available]));
      const forecastWithGap = forecast.map((f: { bloodType: string; projectedDemand: number; dailyAvgUsage: number; forecastDays: number }) => ({
        ...f,
        currentStock: stockMap.get(f.bloodType) || 0,
        gap: f.projectedDemand - (stockMap.get(f.bloodType) || 0),
        daysUntilDepletion: (stockMap.get(f.bloodType) || 0) > 0 && f.dailyAvgUsage > 0 ? Math.floor((stockMap.get(f.bloodType) || 0) / f.dailyAvgUsage) : null,
      }));

      sendSuccess(res, { forecast: forecastWithGap, generatedAt: new Date().toISOString(), periodDays: days });
    } catch (e) { next(e); }
  }

  /** Seasonal pattern analysis */
  static async getSeasonalPatterns(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const patterns = await Donation.aggregate([
        { $match: { isDeleted: false } },
        { $group: { _id: { month: { $month: '$collectionDate' }, bloodType: '$bloodType' }, count: { $sum: 1 } } },
        { $sort: { '_id.month': 1 } },
      ]);
      sendSuccess(res, { patterns });
    } catch (e) { next(e); }
  }
}
