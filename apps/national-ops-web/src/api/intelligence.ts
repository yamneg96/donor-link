/**
 * Intelligence API Client
 * 
 * Interacts with the ML-backed intelligence endpoints in the Express backend.
 */

import { api } from "./client";

export interface MLHospitalInventory {
  hospital_id: string;
  hospital_name?: string;
  blood_type: string;
  available_units: number;
  avg_daily_usage?: number;
  distance_km?: number;
  days_until_nearest_expiry?: number;
  emergency_active?: boolean;
}

export interface MLRedistributionRequest {
  target_hospital_id: string;
  target_hospital_name?: string;
  blood_type: string;
  units_needed: number;
  urgency?: 'normal' | 'high' | 'critical';
  candidate_hospitals: MLHospitalInventory[];
}

export const intelligenceApi = {
  /**
   * Get demand forecast for a hospital and blood type
   */
  getForecast: (params: { 
    hospitalId: string; 
    bloodType: string; 
    days?: number; 
    historicalUsage?: number[] 
  }) => {
    // If historicalUsage is provided in params, we might need to send it in body or query
    // The controller supports both. We'll use a mix here or prefer body if it's large.
    const { historicalUsage, ...queryParams } = params;
    if (historicalUsage) {
      return api.post("/intelligence/forecast", { historicalUsage }, { params: queryParams });
    }
    return api.get("/intelligence/forecast", { params: queryParams });
  },

  /**
   * Get shortage risk score
   */
  getShortageRisk: (params: {
    hospitalId: string;
    bloodType: string;
    currentInventory?: number;
    avgDailyUsage?: number;
    pendingRequests?: number;
    incomingTransfers?: number;
    emergencyActive?: boolean;
    daysHorizon?: number;
  }) => api.get("/intelligence/shortage-risk", { params }),

  /**
   * Get redistribution recommendations
   */
  getRedistribution: (data: MLRedistributionRequest) => 
    api.post("/intelligence/redistribution", data),

  /**
   * Detect anomalies in a metric series
   */
  detectAnomalies: (data: {
    metric_name: string;
    values: number[];
    threshold?: number;
    context?: Record<string, unknown>;
  }) => api.post("/intelligence/anomaly", data),

  /**
   * Assess expiry risk for blood units
   */
  getExpiryRisk: (data: {
    hospital_id: string;
    units: Array<{
      unit_id: string;
      blood_type: string;
      days_until_expiry: number;
      component_type?: string;
    }>;
    avg_daily_usage_by_type?: Record<string, number>;
    nearby_shortages?: string[];
  }) => api.post("/intelligence/expiry-risk", data),

  /**
   * Check ML service health via proxy
   */
  checkHealth: () => api.get("/intelligence/health"),
};
