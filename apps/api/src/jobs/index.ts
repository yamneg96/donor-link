import { logger } from '../config';
import { BloodUnit } from '../modules/inventory/models/BloodUnit';
import { Donor } from '../modules/donors/models/Donor';
import { BloodUnitStatus } from '../core/constants';

/**
 * Initialize scheduled jobs for the system.
 * Uses simple setInterval for background tasks (no external cron dependency needed).
 * For production BullMQ workers would handle these, but this ensures they run in dev.
 */
export function initializeJobScheduler(): void {
  logger.info('⏰ Initializing job scheduler...');

  // === Expire blood units job — every 6 hours ===
  setInterval(async () => {
    try {
      const result = await BloodUnit.updateMany(
        { status: BloodUnitStatus.AVAILABLE, expiryDate: { $lte: new Date() }, isDeleted: false },
        { status: BloodUnitStatus.EXPIRED }
      );
      if (result.modifiedCount > 0) {
        logger.info(`🔴 Expired ${result.modifiedCount} blood units`);
      }
    } catch (err) {
      logger.error('Error in expiry job:', err);
    }
  }, 6 * 60 * 60 * 1000);

  // === Re-enable eligible donors — every 12 hours ===
  setInterval(async () => {
    try {
      const result = await Donor.updateMany(
        { isEligible: false, nextEligibleDate: { $lte: new Date() }, isDeleted: false },
        { isEligible: true }
      );
      if (result.modifiedCount > 0) {
        logger.info(`✅ Re-enabled ${result.modifiedCount} donors for donation`);
      }
    } catch (err) {
      logger.error('Error in donor eligibility job:', err);
    }
  }, 12 * 60 * 60 * 1000);

  // === Release stale reservations (>2 hours old) — every 30 minutes ===
  setInterval(async () => {
    try {
      const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
      const result = await BloodUnit.updateMany(
        { status: BloodUnitStatus.RESERVED, reservedAt: { $lte: twoHoursAgo }, isDeleted: false },
        { status: BloodUnitStatus.AVAILABLE, reservedFor: null, reservedAt: null }
      );
      if (result.modifiedCount > 0) {
        logger.info(`♻️ Released ${result.modifiedCount} stale reservations`);
      }
    } catch (err) {
      logger.error('Error in reservation release job:', err);
    }
  }, 30 * 60 * 1000);

  logger.info('✅ Job scheduler initialized');
}
