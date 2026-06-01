import { Request, Response, NextFunction } from 'express';
import { GeoService } from '../services/geoService';
import { sendSuccess, sendCreated } from '../../../core/utils';

export class GeoController {
  private static service = new GeoService();

  static registerLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const entity = await GeoController.service.registerLocation(req.body);
      sendCreated(res, entity, 'Location registered');
    } catch (error) {
      next(error);
    }
  };

  static findNearby = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { longitude, latitude, radius, type } = req.query;
      const lng = parseFloat(longitude as string);
      const lat = parseFloat(latitude as string);
      const maxKm = radius ? parseFloat(radius as string) : 50;

      let results;
      switch (type) {
        case 'hospital':
          results = await GeoController.service.findNearbyHospitals(lng, lat, maxKm);
          break;
        case 'blood_bank':
          results = await GeoController.service.findNearbyBloodBanks(lng, lat, maxKm);
          break;
        case 'donation_center':
          results = await GeoController.service.findNearbyDonationCenters(lng, lat, maxKm);
          break;
        case 'blood_drive':
          results = await GeoController.service.findNearbyBloodDrives(lng, lat, maxKm);
          break;
        default:
          results = await GeoController.service.findNearbyAll(lng, lat, maxKm);
      }

      sendSuccess(res, { results, count: results.length });
    } catch (error) {
      next(error);
    }
  };

  static findInEmergencyRadius = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { longitude, latitude, radius } = req.body;
      const results = await GeoController.service.findInEmergencyRadius(longitude, latitude, radius);
      sendSuccess(res, { results, count: results.length });
    } catch (error) {
      next(error);
    }
  };

  static getByRegion = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { region } = req.params;
      const type = req.query.type as string | undefined;
      const results = await GeoController.service.getByRegion(region, type);
      sendSuccess(res, { results });
    } catch (error) {
      next(error);
    }
  };

  static getEntityLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entityType, entityId } = req.params;
      const entity = await GeoController.service.getEntityLocation(entityType, entityId);
      sendSuccess(res, { entity });
    } catch (error) {
      next(error);
    }
  };

  static updateLocation = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { entityType, entityId } = req.params;
      const entity = await GeoController.service.updateLocation(entityType, entityId, req.body);
      sendSuccess(res, { entity }, 'Location updated');
    } catch (error) {
      next(error);
    }
  };

  static getRegionStats = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const stats = await GeoController.service.getRegionStats();
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };
}
