import { BloodType } from './donor';

export enum RequestUrgency {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT',
  CRITICAL = 'CRITICAL',
}

export enum RequestStatus {
  OPEN = 'OPEN',
  PARTIALLY_FULFILLED = 'PARTIALLY_FULFILLED',
  FULFILLED = 'FULFILLED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export interface BloodRequest {
  id: string;
  hospitalId: string;
  bloodType: BloodType;
  unitsRequested: number;
  unitsFulfilled: number;
  urgency: RequestUrgency;
  reason?: string;
  patientInfo?: string;
  status: RequestStatus;
  createdAt: string;
  hospitalName?: string;
}
