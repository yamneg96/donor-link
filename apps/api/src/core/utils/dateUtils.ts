import { ComponentType, COMPONENT_SHELF_LIFE } from '../constants';

/**
 * Calculate expiry date for a blood component based on collection date.
 */
export function calculateExpiryDate(collectionDate: Date, componentType: ComponentType): Date {
  const shelfLifeDays = COMPONENT_SHELF_LIFE[componentType];
  const expiry = new Date(collectionDate);
  expiry.setDate(expiry.getDate() + shelfLifeDays);
  return expiry;
}

/**
 * Get days until expiry from now.
 */
export function getDaysUntilExpiry(expiryDate: Date): number {
  const now = new Date();
  const diffMs = expiryDate.getTime() - now.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

/**
 * Check if a blood unit is expiring within N days.
 */
export function isExpiringSoon(expiryDate: Date, thresholdDays: number = 3): boolean {
  return getDaysUntilExpiry(expiryDate) <= thresholdDays && getDaysUntilExpiry(expiryDate) >= 0;
}

/**
 * Check if a blood unit has expired.
 */
export function isExpired(expiryDate: Date): boolean {
  return new Date() > expiryDate;
}

/**
 * Check if a donor is eligible to donate (minimum 56 days between donations).
 */
export function isDonorEligible(lastDonationDate: Date | null, minimumIntervalDays: number = 56): boolean {
  if (!lastDonationDate) return true;
  const daysSinceLastDonation = getDaysUntilExpiry(lastDonationDate) * -1; // inverted
  return daysSinceLastDonation >= minimumIntervalDays;
}
