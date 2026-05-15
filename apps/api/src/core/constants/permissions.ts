import { Role } from './roles';

/**
 * Permission definitions for DonorLink RBAC system.
 * Each permission is a string action mapped to allowed roles.
 */
export const PERMISSIONS = {
  // Users
  'users:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'users:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'users:update': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'users:delete': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN],

  // Organizations
  'organizations:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN],
  'organizations:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'organizations:update': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN],
  'organizations:delete': [Role.SUPER_ADMIN],

  // Donors
  'donors:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR],
  'donors:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR],
  'donors:update': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR],
  'donors:delete': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN],

  // Donations
  'donations:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF, Role.DONOR_COORDINATOR],
  'donations:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF, Role.DONOR_COORDINATOR],
  'donations:update': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],

  // Inventory
  'inventory:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],
  'inventory:manage': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],
  'inventory:reserve': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],

  // Transfers
  'transfers:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'transfers:approve': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'transfers:dispatch': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER],
  'transfers:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DISPATCHER],

  // Blood Requests
  'requests:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],
  'requests:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],
  'requests:fulfill': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF],

  // Alerts
  'alerts:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'alerts:acknowledge': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'alerts:resolve': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],

  // Campaigns
  'campaigns:create': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN],
  'campaigns:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.DONOR_COORDINATOR],
  'campaigns:manage': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN],

  // Emergency
  'emergency:declare': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'emergency:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'emergency:resolve': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN],

  // Analytics
  'analytics:national': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST],
  'analytics:regional': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN],
  'analytics:hospital': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],

  // Audit
  'audit:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN],

  // Recommendations
  'recommendations:read': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
  'recommendations:manage': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],

  // Dashboard
  'dashboard:national': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.NATIONAL_ANALYST],
  'dashboard:hospital': [Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.REGIONAL_ADMIN, Role.HOSPITAL_ADMIN],
} as const;

export type Permission = keyof typeof PERMISSIONS;
