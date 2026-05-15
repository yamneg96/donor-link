import mongoose, { Schema, Document } from 'mongoose';
import { AlertType, AlertSeverity, AlertStatus } from '../../../core/constants';

export interface IAlert extends Document {
  type: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  organizationId: mongoose.Types.ObjectId | null;
  bloodType: string | null;
  relatedEntity: { entityType: string; entityId: mongoose.Types.ObjectId } | null;
  status: AlertStatus;
  acknowledgedBy: mongoose.Types.ObjectId | null;
  acknowledgedAt: Date | null;
  resolvedBy: mongoose.Types.ObjectId | null;
  resolvedAt: Date | null;
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const alertSchema = new Schema<IAlert>(
  {
    type: { type: String, enum: Object.values(AlertType), required: true },
    severity: { type: String, enum: Object.values(AlertSeverity), required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    bloodType: { type: String, default: null },
    relatedEntity: { entityType: { type: String }, entityId: { type: Schema.Types.ObjectId } },
    status: { type: String, enum: Object.values(AlertStatus), default: AlertStatus.ACTIVE },
    acknowledgedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    acknowledgedAt: { type: Date, default: null },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

alertSchema.index({ type: 1, severity: 1, status: 1 });
alertSchema.index({ organizationId: 1, status: 1 });
alertSchema.index({ createdAt: -1 });

export const Alert = mongoose.model<IAlert>('Alert', alertSchema);
