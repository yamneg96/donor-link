import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../../core/utils';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { Donation } from '../../donations/models/Donation';
import { TransferRequest } from '../../transfers/models/TransferRequest';
import { Donor } from '../../donors/models/Donor';
import { Organization } from '../../organizations/models/Organization';
import { BloodUnitStatus } from '../../../core/constants';

export class AnalyticsController {
  static async getNationalAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalUnits, availableUnits, totalDonors, totalOrgs, unitsByBloodType, unitsByStatus, donationsTrend] = await Promise.all([
        BloodUnit.countDocuments({ isDeleted: false }),
        BloodUnit.countDocuments({ status: BloodUnitStatus.AVAILABLE, isDeleted: false }),
        Donor.countDocuments({ isDeleted: false }),
        Organization.countDocuments({ isDeleted: false }),
        BloodUnit.aggregate([{ $match: { status: BloodUnitStatus.AVAILABLE, isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]),
        BloodUnit.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: '$status', count: { $sum: 1 } } }]),
        Donation.aggregate([
          { $match: { isDeleted: false } },
          { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$collectionDate' } }, count: { $sum: 1 } } },
          { $sort: { _id: -1 } }, { $limit: 12 },
        ]),
      ]);
      sendSuccess(res, { totalUnits, availableUnits, totalDonors, totalOrgs, unitsByBloodType, unitsByStatus, donationsTrend });
    } catch (e) { next(e); }
  }

  static async getHospitalAnalytics(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.params.orgId || req.organizationId;
      const [stockLevels, transfersIn, transfersOut, recentDonations] = await Promise.all([
        BloodUnit.aggregate([{ $match: { currentHospitalId: require('mongoose').Types.ObjectId.createFromHexString(orgId as string), status: BloodUnitStatus.AVAILABLE, isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]),
        TransferRequest.countDocuments({ toOrgId: orgId, status: 'completed' }),
        TransferRequest.countDocuments({ fromOrgId: orgId, status: 'completed' }),
        Donation.countDocuments({ organizationId: orgId, isDeleted: false }),
      ]);
      sendSuccess(res, { orgId, stockLevels, transfersIn, transfersOut, recentDonations });
    } catch (e) { next(e); }
  }

  static async getTransferAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [byStatus, byPriority, trend] = await Promise.all([
        TransferRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
        TransferRequest.aggregate([{ $group: { _id: '$priority', count: { $sum: 1 } } }]),
        TransferRequest.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, count: { $sum: 1 } } }, { $sort: { _id: -1 } }, { $limit: 12 }]),
      ]);
      sendSuccess(res, { byStatus, byPriority, trend });
    } catch (e) { next(e); }
  }

  static async getWastageAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [expired, discarded, wastageByBloodType] = await Promise.all([
        BloodUnit.countDocuments({ status: BloodUnitStatus.EXPIRED, isDeleted: false }),
        BloodUnit.countDocuments({ status: BloodUnitStatus.DISCARDED, isDeleted: false }),
        BloodUnit.aggregate([{ $match: { status: { $in: [BloodUnitStatus.EXPIRED, BloodUnitStatus.DISCARDED] }, isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]),
      ]);
      const totalUnits = await BloodUnit.countDocuments({ isDeleted: false });
      const wastageRate = totalUnits > 0 ? ((expired + discarded) / totalUnits * 100).toFixed(2) : '0';
      sendSuccess(res, { expired, discarded, wastageRate: `${wastageRate}%`, wastageByBloodType });
    } catch (e) { next(e); }
  }

  static async getDonorAnalytics(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalDonors, byBloodType, eligibleDonors, donationsTrend] = await Promise.all([
        Donor.countDocuments({ isDeleted: false }),
        Donor.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]),
        Donor.countDocuments({ isEligible: true, isDeleted: false }),
        Donation.aggregate([{ $group: { _id: { $dateToString: { format: '%Y-%m', date: '$collectionDate' } }, count: { $sum: 1 }, totalVolume: { $sum: '$volume' } } }, { $sort: { _id: -1 } }, { $limit: 12 }]),
      ]);
      sendSuccess(res, { totalDonors, eligibleDonors, eligibilityRate: totalDonors > 0 ? ((eligibleDonors / totalDonors) * 100).toFixed(1) : '0', byBloodType, donationsTrend });
    } catch (e) { next(e); }
  }
}
