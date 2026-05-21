/**
 * ML Service TypeScript Schemas
 * 
 * Mirror of the FastAPI Pydantic schemas for type safety
 * in the Express ↔ ML communication layer.
 */

// ── Forecasting ─────────────────────────────────────

export interface MLForecastRequest {
  blood_type: string;
  hospital_id: string;
  historical_usage: number[];
  forecast_days?: number;
}

export interface MLForecastPoint {
  day: number;
  predicted_demand: number;
  lower_bound: number;
  upper_bound: number;
  confidence: number;
}

export interface MLForecastResponse {
  hospital_id: string;
  blood_type: string;
  forecast: MLForecastPoint[];
  method: string;
  trend: 'rising' | 'stable' | 'declining';
  avg_confidence: number;
  data_points_used: number;
}

// ── Anomaly Detection ───────────────────────────────

export interface MLAnomalyRequest {
  metric_name: string;
  values: number[];
  threshold?: number;
  context?: Record<string, unknown>;
}

export interface MLDetectedAnomaly {
  index: number;
  value: number;
  z_score: number;
  severity: 'warning' | 'critical';
  deviation_pct: number;
}

export interface MLAnomalyResponse {
  metric_name: string;
  total_points: number;
  anomalies: MLDetectedAnomaly[];
  anomaly_count: number;
  mean: number;
  std_dev: number;
  threshold_used: number;
}

// ── Shortage Risk Scoring ───────────────────────────

export interface MLShortageRiskRequest {
  hospital_id: string;
  blood_type: string;
  current_inventory: number;
  avg_daily_usage: number;
  pending_requests?: number;
  incoming_transfers?: number;
  emergency_active?: boolean;
  days_horizon?: number;
}

export interface MLShortageRiskResponse {
  hospital_id: string;
  blood_type: string;
  risk_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  days_of_supply: number;
  projected_deficit: number;
  factors: Record<string, number>;
  recommendation: string;
}

// ── Redistribution Recommendations ──────────────────

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

export interface MLRecommendationScore {
  hospital_id: string;
  hospital_name: string;
  overall_score: number;
  recommended_units: number;
  factors: Record<string, number>;
  rationale: string;
}

export interface MLRedistributionResponse {
  target_hospital_id: string;
  blood_type: string;
  units_needed: number;
  recommendations: MLRecommendationScore[];
  fulfillment_pct: number;
}

// ── Expiry Risk ─────────────────────────────────────

export interface MLBloodUnit {
  unit_id: string;
  blood_type: string;
  days_until_expiry: number;
  component_type?: string;
}

export interface MLExpiryRiskRequest {
  hospital_id: string;
  units: MLBloodUnit[];
  avg_daily_usage_by_type?: Record<string, number>;
  nearby_shortages?: string[];
}

export interface MLUnitExpiryRisk {
  unit_id: string;
  blood_type: string;
  days_until_expiry: number;
  risk_score: number;
  risk_level: 'critical' | 'high' | 'medium' | 'low';
  action: 'use_immediately' | 'redistribute' | 'monitor' | 'safe';
  rationale: string;
}

export interface MLExpiryRiskResponse {
  hospital_id: string;
  total_units: number;
  at_risk_units: number;
  critical_units: number;
  assessments: MLUnitExpiryRisk[];
  summary: string;
}
