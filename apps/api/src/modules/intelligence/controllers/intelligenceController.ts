/**
 * Intelligence Controller
 * 
 * HTTP request handlers for all intelligence/ML endpoints.
 * Follows the project pattern of static controller methods.
 */

import { Request, Response, NextFunction } from 'express';
import { IntelligenceService } from '../services/intelligenceService';
import { sendSuccess } from '../../../core/utils';
import { formatRiskLevel } from '../../../infrastructure/ml';

export class IntelligenceController {
  private static service = new IntelligenceService();

  // ── ML Service Health ─────────────────────────────

  static checkHealth = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const health = await IntelligenceController.service.checkHealth();
      sendSuccess(res, { ml: health });
    } catch (error) {
      next(error);
    }
  };

  // ── National Intelligence ─────────────────────────

  /**
   * GET /intelligence/forecast
   * Demand forecast for a hospital + blood type
   */
  static getForecast = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.query.hospitalId as string;
      const bloodType = req.query.bloodType as string;
      const days = parseInt(req.query.days as string) || 7;

      if (!hospitalId || !bloodType) {
        res.status(400).json({
          success: false,
          message: 'hospitalId and bloodType query parameters are required',
        });
        return;
      }

      // Parse historical usage from query (comma-separated) or body
      let historicalUsage: number[] = [];
      if (req.query.historicalUsage) {
        historicalUsage = (req.query.historicalUsage as string)
          .split(',')
          .map(Number)
          .filter((n) => !isNaN(n));
      } else if (req.body?.historicalUsage) {
        historicalUsage = req.body.historicalUsage;
      }

      if (historicalUsage.length < 3) {
        res.status(400).json({
          success: false,
          message: 'At least 3 historical usage data points are required',
        });
        return;
      }

      const result = await IntelligenceController.service.getForecast(
        hospitalId,
        bloodType,
        historicalUsage,
        days
      );

      sendSuccess(res, result);

    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /intelligence/shortage-risk
   * Shortage risk score for a hospital + blood type
   */
  static getShortageRisk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.query.hospitalId as string;
      const bloodType = req.query.bloodType as string;

      if (!hospitalId || !bloodType) {
        res.status(400).json({
          success: false,
          message: 'hospitalId and bloodType query parameters are required',
        });
        return;
      }

      const result = await IntelligenceController.service.getShortageRisk({
        hospitalId,
        bloodType,
        currentInventory: parseInt(req.query.currentInventory as string) || 0,
        avgDailyUsage: parseFloat(req.query.avgDailyUsage as string) || 0,
        pendingRequests: parseInt(req.query.pendingRequests as string) || 0,
        incomingTransfers: parseInt(req.query.incomingTransfers as string) || 0,
        emergencyActive: req.query.emergencyActive === 'true',
        daysHorizon: parseInt(req.query.daysHorizon as string) || 3,
      });

      sendSuccess(res, {
        risk: result,
        display: formatRiskLevel(result.risk_level),
        generatedAt: new Date().toISOString(),
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /intelligence/redistribution
   * Redistribution recommendations
   */
  static getRedistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { target_hospital_id, blood_type, units_needed, urgency, candidate_hospitals } = req.body;

      if (!target_hospital_id || !blood_type || !units_needed || !candidate_hospitals?.length) {
        res.status(400).json({
          success: false,
          message: 'target_hospital_id, blood_type, units_needed, and candidate_hospitals are required',
        });
        return;
      }

      const result = await IntelligenceController.service.getRedistribution({
        target_hospital_id,
        blood_type,
        units_needed,
        urgency: urgency || 'normal',
        candidate_hospitals,
      });

      sendSuccess(res, { redistribution: result, generatedAt: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  };

  /**
   * POST /intelligence/anomaly
   * Anomaly detection on metric values
   */
  static detectAnomalies = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { metric_name, values, threshold, context } = req.body;

      if (!metric_name || !values?.length) {
        res.status(400).json({
          success: false,
          message: 'metric_name and values array are required',
        });
        return;
      }

      const result = await IntelligenceController.service.detectAnomalies(
        metric_name,
        values,
        threshold || 2.0,
        context
      );

      sendSuccess(res, { anomalies: result, generatedAt: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  };

  // ── Hospital Intelligence ─────────────────────────

  /**
   * POST /intelligence/expiry-risk
   * Expiry risk assessment for blood units
   */
  static getExpiryRisk = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { hospital_id, units, avg_daily_usage_by_type, nearby_shortages } = req.body;

      if (!hospital_id || !units?.length) {
        res.status(400).json({
          success: false,
          message: 'hospital_id and units array are required',
        });
        return;
      }

      const result = await IntelligenceController.service.getExpiryRisk({
        hospital_id,
        units,
        avg_daily_usage_by_type: avg_daily_usage_by_type || {},
        nearby_shortages: nearby_shortages || [],
      });

      sendSuccess(res, { expiryRisk: result, generatedAt: new Date().toISOString() });
    } catch (error) {
      next(error);
    }
  };
}
