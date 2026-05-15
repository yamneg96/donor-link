import { Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../../core/utils';
import { Organization } from '../../organizations/models/Organization';

export class LogisticsController {
  static async estimateETA(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { fromOrgId, toOrgId } = req.query;
      const fromOrg = await Organization.findById(fromOrgId);
      const toOrg = await Organization.findById(toOrgId);
      if (!fromOrg || !toOrg) { sendSuccess(res, { estimatedMinutes: 60, distanceKm: 30 }); return; }

      const [lng1, lat1] = fromOrg.location.coordinates;
      const [lng2, lat2] = toOrg.location.coordinates;
      const R = 6371; // Earth's radius in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLng = (lng2 - lng1) * Math.PI / 180;
      const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLng/2)**2;
      const distanceKm = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const estimatedMinutes = Math.round(distanceKm / 40 * 60); // ~40km/h avg

      sendSuccess(res, { fromOrg: fromOrg.name, toOrg: toOrg.name, distanceKm: Math.round(distanceKm * 10) / 10, estimatedMinutes });
    } catch (e) { next(e); }
  }

  static async getDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { TransferRequest } = await import('../../transfers/models/TransferRequest');
      const { TransferShipment } = await import('../../transfers/models/TransferShipment');
      const [activeTransfers, inTransit, pendingApproval] = await Promise.all([
        TransferRequest.countDocuments({ status: { $in: ['approved', 'dispatched', 'in_transit'] } }),
        TransferShipment.countDocuments({ status: 'in_transit' }),
        TransferRequest.countDocuments({ status: 'pending' }),
      ]);
      sendSuccess(res, { activeTransfers, inTransit, pendingApproval });
    } catch (e) { next(e); }
  }
}
