/**
 * Data Transformers
 * 
 * Converts MongoDB business entities into ML feature vectors
 * and ML responses back into domain-friendly formats.
 */

import type {
  MLForecastRequest,
  MLShortageRiskRequest,
  MLHospitalInventory,
  MLBloodUnit,
  MLAnomalyRequest,
} from './schemas';

// ── Forward Transformers (Business → ML) ────────────

/**
 * Transform historical usage data into ML forecast request.
 */
export function toForecastRequest(
  hospitalId: string,
  bloodType: string,
  dailyUsageCounts: number[],
  forecastDays: number = 7
): MLForecastRequest {
  return {
    hospital_id: hospitalId,
    blood_type: bloodType,
    historical_usage: dailyUsageCounts,
    forecast_days: forecastDays,
  };
}

/**
 * Transform inventory data into shortage risk request.
 */
export function toShortageRiskRequest(params: {
  hospitalId: string;
  bloodType: string;
  currentInventory: number;
  avgDailyUsage: number;
  pendingRequests?: number;
  incomingTransfers?: number;
  emergencyActive?: boolean;
  daysHorizon?: number;
}): MLShortageRiskRequest {
  return {
    hospital_id: params.hospitalId,
    blood_type: params.bloodType,
    current_inventory: params.currentInventory,
    avg_daily_usage: params.avgDailyUsage,
    pending_requests: params.pendingRequests || 0,
    incoming_transfers: params.incomingTransfers || 0,
    emergency_active: params.emergencyActive || false,
    days_horizon: params.daysHorizon || 3,
  };
}

/**
 * Transform hospital inventory records into ML candidate format.
 */
export function toHospitalInventory(hospital: {
  id: string;
  name?: string;
  bloodType: string;
  availableUnits: number;
  avgDailyUsage?: number;
  distanceKm?: number;
  nearestExpiry?: number;
  emergencyActive?: boolean;
}): MLHospitalInventory {
  return {
    hospital_id: hospital.id,
    hospital_name: hospital.name || '',
    blood_type: hospital.bloodType,
    available_units: hospital.availableUnits,
    avg_daily_usage: hospital.avgDailyUsage || 0,
    distance_km: hospital.distanceKm || 0,
    days_until_nearest_expiry: hospital.nearestExpiry || 30,
    emergency_active: hospital.emergencyActive || false,
  };
}

/**
 * Transform blood unit records into ML expiry risk format.
 */
export function toMLBloodUnit(unit: {
  id: string;
  bloodType: string;
  expiryDate: Date;
  componentType?: string;
}): MLBloodUnit {
  const now = new Date();
  const daysUntilExpiry = Math.max(
    0,
    Math.ceil((unit.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  );

  return {
    unit_id: unit.id,
    blood_type: unit.bloodType,
    days_until_expiry: daysUntilExpiry,
    component_type: unit.componentType || 'red_blood_cells',
  };
}

/**
 * Transform usage metric array into anomaly detection request.
 */
export function toAnomalyRequest(
  metricName: string,
  values: number[],
  threshold: number = 2.0,
  context?: Record<string, unknown>
): MLAnomalyRequest {
  return {
    metric_name: metricName,
    values,
    threshold,
    context,
  };
}

// ── Response Formatters (ML → API Response) ─────────

/**
 * Format ML risk level into a display-friendly format.
 */
export function formatRiskLevel(level: string): { label: string; color: string; priority: number } {
  const map: Record<string, { label: string; color: string; priority: number }> = {
    critical: { label: 'Critical', color: '#DC2626', priority: 1 },
    high: { label: 'High Risk', color: '#F97316', priority: 2 },
    medium: { label: 'Moderate', color: '#EAB308', priority: 3 },
    low: { label: 'Low Risk', color: '#22C55E', priority: 4 },
  };
  return map[level] || { label: level, color: '#6B7280', priority: 5 };
}
