import mongoose, { Schema, Document } from "mongoose";
import { IAlert, AlertChannel, AlertStatus } from "@donorlink/types";

export interface IAlertDocument extends Omit<IAlert, "_id" | "createdAt">, Document {}

const alertSchema = new Schema<IAlertDocument>(
  {
    requestId: { type: Schema.Types.ObjectId, ref: "BloodRequest", required: true, index: true },
    donorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    channel: { type: String, enum: Object.values(AlertChannel), required: true },
    status: { type: String, enum: Object.values(AlertStatus), default: AlertStatus.PENDING, index: true },
    message: { type: String, required: true },
    sentAt: Date,
    deliveredAt: Date,
    failureReason: String,
    donorResponse: { type: String, enum: ["accepted", "declined", "no_response"] },
    respondedAt: Date,
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

alertSchema.index({ requestId: 1, donorId: 1 });
alertSchema.index({ donorId: 1, createdAt: -1 });
// Auto-delete alert records after 90 days
alertSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 90 });

export const Alert = mongoose.model<IAlertDocument>("Alert", alertSchema);