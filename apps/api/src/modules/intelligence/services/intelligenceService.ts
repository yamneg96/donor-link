/**
 * Intelligence Service
 * 
 * Orchestrates ML calls with data transformation, caching, and event emission.
 * This is the primary interface for all intelligence operations.
 */

import {
  predictDemand,
  detectAnomalies,
  scoreShortageRisk,
  getRedistributionRecommendations,
  calculateExpiryRisk,
  checkMLHealth,
  toForecastRequest,
  toShortageRiskRequest,
  toAnomalyRequest,
  mlCache,
  CACHE_TTL,
  MLServiceError,
} from '../../../infrastructure/ml';
import type {
  MLForecastResponse,
  MLAnomalyResponse,
  MLShortageRiskResponse,
  MLRedistributionRequest,
  MLRedistributionResponse,
  MLExpiryRiskRequest,
  MLExpiryRiskResponse,
} from '../../../infrastructure/ml';
import { eventBus, EventType } from '../../../core/events';
import { logger } from '../../../config';

export class IntelligenceService {

  // ── Demand Forecasting ────────────────────────────

  async getForecast(
    hospitalId: string,
    bloodType: string,
    historicalUsage: number[],
    forecastDays: number = 7
  ): Promise<MLForecastResponse> {
    const request = toForecastRequest(hospitalId, bloodType, historicalUsage, forecastDays);
    const cacheKey = mlCache.key('/forecast/demand', request);

    const cached = mlCache.get<MLForecastResponse>(cacheKey);
    if (cached) return cached;

    try {
      const result = await predictDemand(request);
      mlCache.set(cacheKey, result, CACHE_TTL.FORECAST);
      return result;
    } catch (error) {
      logger.error(`[Intelligence] Forecast failed for ${hospitalId}/${bloodType}:`, error);
      throw error;
    }
  }

  // ── Anomaly Detection ─────────────────────────────

  async detectAnomalies(
    metricName: string,
    values: number[],
    threshold: number = 2.0,
    context?: Record<string, unknown>
  ): Promise<MLAnomalyResponse> {
    const request = toAnomalyRequest(metricName, values, threshold, context);
    const cacheKey = mlCache.key('/anomaly/detect', request);

    const cached = mlCache.get<MLAnomalyResponse>(cacheKey);
    if (cached) return cached;

    try {
      const result = await detectAnomalies(request);
      mlCache.set(cacheKey, result, CACHE_TTL.ANOMALY);

      // Emit events for critical anomalies
      if (result.anomalies.some(a => a.severity === 'critical')) {
        eventBus.emitEvent(EventType.INVENTORY_CRITICAL, {
          type: 'anomaly_detected',
          metricName,
          anomalyCount: result.anomaly_count,
          criticalCount: result.anomalies.filter(a => a.severity === 'critical').length,
        });
      }

      return result;
    } catch (error) {
      logger.error(`[Intelligence] Anomaly detection failed for ${metricName}:`, error);
      throw error;
    }
  }

  // ── Shortage Risk Scoring ─────────────────────────

  async getShortageRisk(params: {
    hospitalId: string;
    bloodType: string;
    currentInventory: number;
    avgDailyUsage: number;
    pendingRequests?: number;
    incomingTransfers?: number;
    emergencyActive?: boolean;
    daysHorizon?: number;
  }): Promise<MLShortageRiskResponse> {
    const request = toShortageRiskRequest(params);
    const cacheKey = mlCache.key('/scoring/shortage-risk', request);

    const cached = mlCache.get<MLShortageRiskResponse>(cacheKey);
    if (cached) return cached;

    try {
      const result = await scoreShortageRisk(request);
      mlCache.set(cacheKey, result, CACHE_TTL.SHORTAGE_RISK);

      // Emit event for critical/high risk
      if (result.risk_level === 'critical' || result.risk_level === 'high') {
        eventBus.emitEvent(EventType.SHORTAGE_DETECTED, {
          hospitalId: params.hospitalId,
          bloodType: params.bloodType,
          riskLevel: result.risk_level,
          riskScore: result.risk_score,
          daysOfSupply: result.days_of_supply,
          recommendation: result.recommendation,
        });
      }

      return result;
    } catch (error) {
      logger.error(`[Intelligence] Shortage risk failed for ${params.hospitalId}/${params.bloodType}:`, error);
      throw error;
    }
  }

  // ── Redistribution Recommendations ────────────────

  async getRedistribution(
    request: MLRedistributionRequest
  ): Promise<MLRedistributionResponse> {
    const cacheKey = mlCache.key('/recommendations/redistribution', request);

    const cached = mlCache.get<MLRedistributionResponse>(cacheKey);
    if (cached) return cached;

    try {
      const result = await getRedistributionRecommendations(request);
      mlCache.set(cacheKey, result, CACHE_TTL.REDISTRIBUTION);
      return result;
    } catch (error) {
      logger.error(`[Intelligence] Redistribution failed for ${request.target_hospital_id}:`, error);
      throw error;
    }
  }

  // ── Expiry Risk Intelligence ──────────────────────

  async getExpiryRisk(
    request: MLExpiryRiskRequest
  ): Promise<MLExpiryRiskResponse> {
    const cacheKey = mlCache.key('/expiry/risk', request);

    const cached = mlCache.get<MLExpiryRiskResponse>(cacheKey);
    if (cached) return cached;

    try {
      const result = await calculateExpiryRisk(request);
      mlCache.set(cacheKey, result, CACHE_TTL.EXPIRY_RISK);
      return result;
    } catch (error) {
      logger.error(`[Intelligence] Expiry risk failed for ${request.hospital_id}:`, error);
      throw error;
    }
  }

  // ── Health Check ──────────────────────────────────

  async checkHealth(): Promise<{ status: string; available: boolean }> {
    return checkMLHealth();
  }
}
