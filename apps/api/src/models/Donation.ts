import mongoose, { Schema, Document } from "mongoose";
import { IDonation, BloodType, DonationStatus } from "@donorlink/types";

export interface IDonationDocument extends Omit<IDonation, "_id" | "createdAt" | "updatedAt">, Document {}

const donationSchema = new Schema<IDonationDocument>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    requestId: { type: Schema.Types.ObjectId, ref: "BloodRequest", index: true },
    scheduledAt: { type: Date, required: true },
    donatedAt: Date,
    status: {
      type: String,
      enum: Object.values(DonationStatus),
      default: DonationStatus.SCHEDULED,
      index: true,
    },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    unitsDonated: { type: Number, min: 1, max: 3 },
    hemoglobinLevel: { type: Number, min: 7, max: 20 },
    notes: { type: String, maxlength: 500 },
    certificateUrl: String,
  },
  { timestamps: true }
);

donationSchema.index({ donorId: 1, scheduledAt: -1 });
donationSchema.index({ hospitalId: 1, status: 1 });

export const Donation = mongoose.model<IDonationDocument>("Donation", donationSchema);