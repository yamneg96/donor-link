import mongoose, { Schema, Document } from 'mongoose';

export enum BadgeCategory {
  DONATION_COUNT = 'donation_count',
  STREAK = 'streak',
  EMERGENCY_RESPONSE = 'emergency_response',
  CAMPAIGN_PARTICIPATION = 'campaign_participation',
  LOYALTY = 'loyalty',
  MILESTONE = 'milestone',
  SPECIAL = 'special',
}

export interface IBadge {
  badgeId: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: string;
  earnedAt: Date;
}

export interface IMilestone {
  type: string;
  value: number;
  reachedAt: Date;
  description: string;
}

export interface IDonorEngagement extends Document {
  donorId: mongoose.Types.ObjectId;
  totalDonations: number;
  totalVolumeMl: number;
  estimatedLivesSaved: number;
  currentStreak: number;
  longestStreak: number;
  lastDonationDate: Date | null;
  nextEligibleDate: Date | null;
  loyaltyPoints: number;
  badges: IBadge[];
  milestones: IMilestone[];
  campaignsParticipated: number;
  emergencyResponses: number;
  referralCount: number;
  donorSince: Date;
  rank: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const badgeSchema = new Schema<IBadge>(
  {
    badgeId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, default: '' },
    category: { type: String, enum: Object.values(BadgeCategory), required: true },
    icon: { type: String, default: '🩸' },
    earnedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const milestoneSchema = new Schema<IMilestone>(
  {
    type: { type: String, required: true },
    value: { type: Number, required: true },
    reachedAt: { type: Date, default: Date.now },
    description: { type: String, default: '' },
  },
  { _id: false }
);

const donorEngagementSchema = new Schema<IDonorEngagement>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true, unique: true },
    totalDonations: { type: Number, default: 0 },
    totalVolumeMl: { type: Number, default: 0 },
    estimatedLivesSaved: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastDonationDate: { type: Date, default: null },
    nextEligibleDate: { type: Date, default: null },
    loyaltyPoints: { type: Number, default: 0 },
    badges: [badgeSchema],
    milestones: [milestoneSchema],
    campaignsParticipated: { type: Number, default: 0 },
    emergencyResponses: { type: Number, default: 0 },
    referralCount: { type: Number, default: 0 },
    donorSince: { type: Date, default: Date.now },
    rank: { type: String, default: 'Bronze' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

donorEngagementSchema.index({ donorId: 1 });
donorEngagementSchema.index({ loyaltyPoints: -1 });
donorEngagementSchema.index({ totalDonations: -1 });
donorEngagementSchema.index({ estimatedLivesSaved: -1 });

export const DonorEngagement = mongoose.model<IDonorEngagement>('DonorEngagement', donorEngagementSchema);
