import { EligibilityRepository } from '../repositories/eligibilityRepository';
import { EligibilityStatus, RestrictionType } from '../models/EligibilityRecord';
import { NotFoundError, AppError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';

// Medical compliance constants for Ethiopian National Blood Bank standards
const ELIGIBILITY_RULES = {
  MIN_HEMOGLOBIN_MALE: 13.0,
  MIN_HEMOGLOBIN_FEMALE: 12.5,
  MIN_WEIGHT_KG: 50,
  MIN_AGE: 18,
  MAX_AGE: 65,
  MIN_DONATION_INTERVAL_DAYS: 56,
  BP_SYSTOLIC_MIN: 90,
  BP_SYSTOLIC_MAX: 180,
  BP_DIASTOLIC_MIN: 60,
  BP_DIASTOLIC_MAX: 100,
  PULSE_MIN: 50,
  PULSE_MAX: 100,
  TEMP_MAX_CELSIUS: 37.5,
};

export class EligibilityService {
  private repo = new EligibilityRepository();

  async screenDonor(data: Record<string, any>, donorId: string) {
    const flags: string[] = [];

    // Hemoglobin check
    if (data.hemoglobinLevel != null && data.hemoglobinLevel < ELIGIBILITY_RULES.MIN_HEMOGLOBIN_FEMALE) {
      flags.push('Hemoglobin below minimum threshold');
    }

    // Blood pressure check
    if (data.bloodPressureSystolic != null) {
      if (data.bloodPressureSystolic < ELIGIBILITY_RULES.BP_SYSTOLIC_MIN || data.bloodPressureSystolic > ELIGIBILITY_RULES.BP_SYSTOLIC_MAX) {
        flags.push('Systolic blood pressure out of acceptable range');
      }
    }
    if (data.bloodPressureDiastolic != null) {
      if (data.bloodPressureDiastolic < ELIGIBILITY_RULES.BP_DIASTOLIC_MIN || data.bloodPressureDiastolic > ELIGIBILITY_RULES.BP_DIASTOLIC_MAX) {
        flags.push('Diastolic blood pressure out of acceptable range');
      }
    }

    // Weight check
    if (data.weight != null && data.weight < ELIGIBILITY_RULES.MIN_WEIGHT_KG) {
      flags.push('Weight below minimum requirement');
    }

    // Temperature check
    if (data.temperature != null && data.temperature > ELIGIBILITY_RULES.TEMP_MAX_CELSIUS) {
      flags.push('Temperature above acceptable limit');
    }

    // Pulse check
    if (data.pulseRate != null) {
      if (data.pulseRate < ELIGIBILITY_RULES.PULSE_MIN || data.pulseRate > ELIGIBILITY_RULES.PULSE_MAX) {
        flags.push('Pulse rate out of acceptable range');
      }
    }

    // Donation interval check
    if (data.lastDonationDate) {
      const lastDonation = new Date(data.lastDonationDate);
      const daysSinceLastDonation = Math.floor((Date.now() - lastDonation.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastDonation < ELIGIBILITY_RULES.MIN_DONATION_INTERVAL_DAYS) {
        flags.push(`Insufficient interval since last donation (${daysSinceLastDonation} days, minimum ${ELIGIBILITY_RULES.MIN_DONATION_INTERVAL_DAYS})`);
      }
    }

    // Check for flagged screening answers
    const screeningAnswers = (data.screeningAnswers || []).map((a: any) => ({
      ...a,
      flagged: a.flagged || false,
    }));
    const hasFlaggedAnswers = screeningAnswers.some((a: any) => a.flagged);

    // Determine status
    let status = EligibilityStatus.ELIGIBLE;
    if (flags.length > 0 || hasFlaggedAnswers) {
      status = flags.length > 2 ? EligibilityStatus.INELIGIBLE : EligibilityStatus.DEFERRED;
    }

    // Calculate next eligible date
    let nextEligibleDate: Date | null = null;
    if (data.lastDonationDate) {
      nextEligibleDate = new Date(data.lastDonationDate);
      nextEligibleDate.setDate(nextEligibleDate.getDate() + ELIGIBILITY_RULES.MIN_DONATION_INTERVAL_DAYS);
    }

    const record = await this.repo.create({
      donorId: donorId as any,
      screeningDate: new Date(),
      status,
      screeningAnswers,
      hemoglobinLevel: data.hemoglobinLevel,
      bloodPressureSystolic: data.bloodPressureSystolic,
      bloodPressureDiastolic: data.bloodPressureDiastolic,
      pulseRate: data.pulseRate,
      weight: data.weight,
      temperature: data.temperature,
      lastDonationDate: data.lastDonationDate ? new Date(data.lastDonationDate) : null,
      nextEligibleDate,
      bloodType: data.bloodType,
      reviewNotes: flags.join('; '),
    });

    return { record, flags, eligible: status === EligibilityStatus.ELIGIBLE };
  }

  async checkEligibility(donorId: string) {
    const latest = await this.repo.findLatestByDonor(donorId);
    if (!latest) {
      return { eligible: false, reason: 'No screening record found', needsScreening: true };
    }

    // Check active restrictions
    const restrictions = await this.repo.getActiveRestrictions(donorId);
    const hasPermanentRestriction = restrictions.some(r => r.type === RestrictionType.PERMANENT);
    if (hasPermanentRestriction) {
      return { eligible: false, reason: 'Permanent restriction active', restrictions };
    }

    const hasActiveTemporary = restrictions.some(r => r.type === RestrictionType.TEMPORARY && (!r.endDate || r.endDate > new Date()));
    if (hasActiveTemporary) {
      return { eligible: false, reason: 'Temporary restriction active', restrictions };
    }

    // Check donation interval
    if (latest.nextEligibleDate && latest.nextEligibleDate > new Date()) {
      return {
        eligible: false,
        reason: 'Not yet eligible for next donation',
        nextEligibleDate: latest.nextEligibleDate,
      };
    }

    return {
      eligible: latest.status === EligibilityStatus.ELIGIBLE,
      status: latest.status,
      lastScreeningDate: latest.screeningDate,
      nextEligibleDate: latest.nextEligibleDate,
    };
  }

  async getById(id: string) {
    const record = await this.repo.findById(id);
    if (!record) throw new NotFoundError('Eligibility Record');
    return record;
  }

  async getDonorHistory(donorId: string, pagination: PaginationParams) {
    return this.repo.findByDonor(donorId, pagination);
  }

  async addRestriction(donorId: string, restrictionData: Record<string, any>, userId: string) {
    const latest = await this.repo.findLatestByDonor(donorId);
    if (!latest) throw new NotFoundError('Eligibility Record');

    return this.repo.addRestriction(latest._id.toString(), {
      ...restrictionData,
      imposedBy: userId,
      startDate: new Date(),
      isActive: true,
    });
  }

  async removeRestriction(recordId: string, restrictionId: string) {
    return this.repo.deactivateRestriction(recordId, restrictionId);
  }

  async getActiveRestrictions(donorId: string) {
    return this.repo.getActiveRestrictions(donorId);
  }

  async getStats() {
    return this.repo.countByStatus();
  }
}
