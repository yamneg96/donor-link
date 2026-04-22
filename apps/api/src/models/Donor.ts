import mongoose, { Schema, Document } from "mongoose";
import { DonorProfile, BloodType, DonorStatus } from "@donorlink/types";

export interface IDonorDocument extends Omit<DonorProfile, "_id" | "createdAt" | "updatedAt">, Document {}

const donorSchema = new Schema<IDonorDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true, index: true },
    bloodType: { type: String, enum: Object.values(BloodType), required: true, index: true },
    dateOfBirth: { type: Date, required: true },
    weight: { type: Number, required: true },
    hemoglobinLevel: Number,
    status: {
      type: String,
      enum: Object.values(DonorStatus),
      default: DonorStatus.ACTIVE,
      index: true,
    },
    totalDonations: { type: Number, default: 0 },
    lastDonationDate: Date,
    nextEligibleDate: Date,
    availableForEmergency: { type: Boolean, default: true, index: true },
    notificationPreferences: {
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      email: { type: Boolean, default: false },
      emergencyOnly: { type: Boolean, default: false },
      maxAlertsPerDay: { type: Number, default: 3 },
    },
    medicalDeferralReason: String,
    deferralUntil: Date,
  },
  { timestamps: true }
);

// Compound index for geo-matching queries
donorSchema.index({ bloodType: 1, status: 1, availableForEmergency: 1 });
donorSchema.index({ nextEligibleDate: 1 });

export const Donor = mongoose.model<IDonorDocument>("Donor", donorSchema);