/**
 * ML Service Endpoint Functions
 * 
 * Typed wrappers around the ML HTTP client for each intelligence endpoint.
 * These are the primary interface used by the intelligence module.
 */

import { mlRequest } from './client';
import type {
  MLForecastRequest,
  MLForecastResponse,
  MLAnomalyRequest,
  MLAnomalyResponse,
  MLShortageRiskRequest,
  MLShortageRiskResponse,
  MLRedistributionRequest,
  MLRedistributionResponse,
  MLExpiryRiskRequest,
  MLExpiryRiskResponse,
} from './schemas';

// ── Forecasting ─────────────────────────────────────

export async function predictDemand(
  data: MLForecastRequest
): Promise<MLForecastResponse> {
  return mlRequest<MLForecastResponse>('/forecast/demand', { body: data });
}

// ── Anomaly Detection ───────────────────────────────

export async function detectAnomalies(
  data: MLAnomalyRequest
): Promise<MLAnomalyResponse> {
  return mlRequest<MLAnomalyResponse>('/anomaly/detect', { body: data });
}

// ── Shortage Risk ───────────────────────────────────

export async function scoreShortageRisk(
  data: MLShortageRiskRequest
): Promise<MLShortageRiskResponse> {
  return mlRequest<MLShortageRiskResponse>('/scoring/shortage-risk', { body: data });
}

// ── Redistribution Recommendations ──────────────────

export async function getRedistributionRecommendations(
  data: MLRedistributionRequest
): Promise<MLRedistributionResponse> {
  return mlRequest<MLRedistributionResponse>('/recommendations/redistribution', {
    body: data,
  });
}

// ── Expiry Risk ─────────────────────────────────────

export async function calculateExpiryRisk(
  data: MLExpiryRiskRequest
): Promise<MLExpiryRiskResponse> {
  return mlRequest<MLExpiryRiskResponse>('/expiry/risk', { body: data });
}
