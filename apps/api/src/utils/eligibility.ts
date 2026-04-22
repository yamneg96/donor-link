import { DonorEligibilityInput } from "@donorlink/validators";

export interface EligibilityResult {
  eligible: boolean;
  reasons: string[];
  deferralDays?: number;
}

const MIN_DAYS_BETWEEN_DONATIONS = 84; // 12 weeks / 3 months

export function checkDonorEligibility(
  input: DonorEligibilityInput,
  lastDonationDate?: Date
): EligibilityResult {
  const reasons: string[] = [];

  if (input.weight < 45) {
    reasons.push("Weight must be at least 45 kg");
  }

  if (input.hasChronicDisease) {
    reasons.push("Donors with active chronic disease are deferred");
  }

  if (input.isPregnant) {
    reasons.push("Pregnant individuals are not eligible to donate");
  }

  if (input.recentSurgery) {
    reasons.push("Must wait 6 months after surgery");
  }

  if (input.recentTattoo) {
    reasons.push("Must wait 6 months after tattoo or piercing");
  }

  if (input.recentInfection) {
    reasons.push("Must wait 2 weeks after recovering from infection");
  }

  if (input.hemoglobinLevel !== undefined) {
    if (input.hemoglobinLevel < 12.5) {
      reasons.push("Hemoglobin level too low (minimum 12.5 g/dL)");
    }
  }

  if (lastDonationDate) {
    const daysSince = Math.floor(
      (Date.now() - lastDonationDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysSince < MIN_DAYS_BETWEEN_DONATIONS) {
      const remaining = MIN_DAYS_BETWEEN_DONATIONS - daysSince;
      reasons.push(
        `Must wait ${remaining} more days since last donation (84-day minimum)`
      );
      return { eligible: false, reasons, deferralDays: remaining };
    }
  }

  return {
    eligible: reasons.length === 0,
    reasons,
  };
}

export function computeNextEligibleDate(lastDonationDate: Date): Date {
  const next = new Date(lastDonationDate);
  next.setDate(next.getDate() + MIN_DAYS_BETWEEN_DONATIONS);
  return next;
}