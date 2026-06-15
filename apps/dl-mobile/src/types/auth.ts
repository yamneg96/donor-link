import { BloodType } from './donor';

export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  NATIONAL_ADMIN = 'NATIONAL_ADMIN',
  NATIONAL_ANALYST = 'NATIONAL_ANALYST',
  REGIONAL_ADMIN = 'REGIONAL_ADMIN',
  HOSPITAL_ADMIN = 'HOSPITAL_ADMIN',
  LAB_STAFF = 'LAB_STAFF',
  DONOR_COORDINATOR = 'DONOR_COORDINATOR',
  DONOR = 'DONOR',
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: Role;
  organizationId?: string;
  isVerified: boolean;
  bloodType?: BloodType;
  region?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password?: string;
  bloodType: BloodType;
  region: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshResponse {
  accessToken: string;
  refreshToken?: string;
}
