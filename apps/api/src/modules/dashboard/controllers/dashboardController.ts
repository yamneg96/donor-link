import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../../core/utils';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { Donor } from '../../donors/models/Donor';
import { Organization } from '../../organizations/models/Organization';
import { TransferRequest } from '../../transfers/models/TransferRequest';
import { Alert } from '../../alerts/models/Alert';
import { EmergencyEvent } from '../../emergency/models/EmergencyEvent';
import { Campaign } from '../../campaigns/models/Campaign';
import { Transfusion } from '../../transfusions/models/Transfusion';
import { BloodDispatch } from '../../dispatches/models/BloodDispatch';
import { BloodRequest } from '../../requests/models/BloodRequest';
import { BloodUnitStatus, AlertStatus, EmergencyStatus, CampaignStatus, AlertSeverity, RequestStatus } from '../../../core/constants';

export class DashboardController {
  static async getPublicStats(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalUnits, activeTransfers, criticalShortages] = await Promise.all([
        BloodUnit.countDocuments({ status: BloodUnitStatus.AVAILABLE, isDeleted: false }),
        TransferRequest.countDocuments({ status: { $in: ['pending', 'in-transit'] } }),
        Alert.countDocuments({ status: AlertStatus.ACTIVE, severity: AlertSeverity.CRITICAL }),
      ]);
      sendSuccess(res, { totalUnits, activeTransfers, criticalShortages }, 'Public stats retrieved');
    } catch (e) { next(e); }
  }

  static async getNationalDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const [totalAvailableUnits, totalOrgs, totalDonors, activeAlerts, activeEmergencies, activeCampaigns, pendingTransfers, stockByBloodType, recentAlerts, totalDispatched, totalTransfused, pendingRequests] = await Promise.all([
        BloodUnit.countDocuments({ status: BloodUnitStatus.AVAILABLE, isDeleted: false }),
        Organization.countDocuments({ isDeleted: false }),
        Donor.countDocuments({ isDeleted: false }),
        Alert.countDocuments({ status: AlertStatus.ACTIVE }),
        EmergencyEvent.countDocuments({ status: { $in: [EmergencyStatus.DECLARED, EmergencyStatus.ACTIVE, EmergencyStatus.RESPONDING] } }),
        Campaign.countDocuments({ status: CampaignStatus.ACTIVE }),
        BloodDispatch.countDocuments({ status: 'pending' }),
        BloodUnit.aggregate([{ $match: { status: BloodUnitStatus.AVAILABLE, isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }, { $sort: { _id: 1 } }]),
        Alert.find({ status: AlertStatus.ACTIVE }).sort({ createdAt: -1 }).limit(10).populate('organizationId', 'name code'),
        BloodDispatch.countDocuments({ status: { $ne: 'rejected' } }),
        Transfusion.countDocuments({ isDeleted: false }),
        BloodRequest.countDocuments({ status: RequestStatus.PENDING }),
      ]);
      sendSuccess(res, { totalAvailableUnits, totalOrgs, totalDonors, activeAlerts, activeEmergencies, activeCampaigns, pendingTransfers, stockByBloodType, recentAlerts, totalDispatched, totalTransfused, pendingRequests });
    } catch (e) { next(e); }
  }

  static async getHospitalDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const orgId = req.params.orgId || req.organizationId;
      const orgObjectId = require('mongoose').Types.ObjectId.createFromHexString(orgId as string);
      const [availableUnits, expiringUnits, pendingTransfersIn, pendingTransfersOut, stockByBloodType, alerts, transfusionsLastMonth] = await Promise.all([
        BloodUnit.countDocuments({ currentHospitalId: orgObjectId, status: BloodUnitStatus.AVAILABLE, isDeleted: false }),
        BloodUnit.countDocuments({ currentHospitalId: orgObjectId, status: BloodUnitStatus.AVAILABLE, isDeleted: false, expiryDate: { $lte: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), $gt: new Date() } }),
        BloodDispatch.countDocuments({ toOrgId: orgId, status: { $in: ['pending', 'dispatched', 'in_transit'] } }),
        BloodDispatch.countDocuments({ fromOrgId: orgId, status: { $in: ['pending', 'dispatched', 'in_transit'] } }),
        BloodUnit.aggregate([{ $match: { currentHospitalId: orgObjectId, status: BloodUnitStatus.AVAILABLE, isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]),
        Alert.find({ organizationId: orgId, status: AlertStatus.ACTIVE }).sort({ createdAt: -1 }).limit(5),
        Transfusion.countDocuments({ hospitalOrgId: orgObjectId, createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) } }),
      ]);
      sendSuccess(res, { availableUnits, expiringUnits, pendingTransfersIn, pendingTransfersOut, stockByBloodType, alerts, transfusionsLastMonth });
    } catch (e) { next(e); }
  }
}
