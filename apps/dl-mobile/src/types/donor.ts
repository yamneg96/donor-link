export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
}

export interface Donor {
  id: string;
  userId: string;
  bloodType: BloodType;
  region: string;
  lastDonationDate?: string;
  eligibilityStatus: boolean;
  livesSaved: number;
  totalDonations: number;
  pintsDonated: number;
}

export interface EligibilityCheck {
  isEligible: boolean;
  reason?: string;
  nextEligibleDate?: string;
  restrictions?: any[];
}
