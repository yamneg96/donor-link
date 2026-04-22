import mongoose, { Schema, Document } from "mongoose";
import { IBloodRequest, BloodType, RequestStatus, RequestUrgency } from "@donorlink/types";

export interface IBloodRequestDocument extends Omit<IBloodRequest, "_id" | "createdAt" | "updatedAt" | "hospital">, Document {}

const bloodRequestSchema = new Schema<IBloodRequestDocument>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: "Hospital", required: true, index: true },
    requestedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    patientName: { type: String, trim: true },
    bloodType: { type: String, enum: Object.values(BloodType), required: true, index: true },
    unitsNeeded: { type: Number, required: true, min: 1, max: 20 },
    unitsMatched: { type: Number, default: 0 },
    urgency: {
      type: String,
      enum: Object.values(RequestUrgency),
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: Object.values(RequestStatus),
      default: RequestStatus.PENDING,
      index: true,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    radiusKm: { type: Number, default: 50 },
    matchedDonorIds: [{ type: Schema.Types.ObjectId, ref: "User" }],
    alertsSentCount: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true, index: true },
    fulfilledAt: Date,
    notes: { type: String, maxlength: 500 },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ location: "2dsphere" });
bloodRequestSchema.index({ status: 1, urgency: 1, createdAt: -1 });
bloodRequestSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL — auto-remove expired docs

export const BloodRequest = mongoose.model<IBloodRequestDocument>("BloodRequest", bloodRequestSchema);