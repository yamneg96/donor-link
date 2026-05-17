import mongoose, { Schema, Document } from 'mongoose';
import { EmergencyStatus, EmergencySeverity } from '../../../core/constants';

export interface IEmergencyEvent extends Document {
  title: string;
  affectedRegions: string[];
  type: string; severity: EmergencySeverity; description: string;
  organizationId: mongoose.Types.ObjectId; bloodTypesNeeded: string[];
  status: EmergencyStatus; declaredBy: mongoose.Types.ObjectId;
  resolvedBy: mongoose.Types.ObjectId | null; resolvedAt: Date | null;
  affectedArea: string; contactPhone: string; metadata: Record<string, unknown>;
  createdAt: Date; updatedAt: Date;
}

const emergencyEventSchema = new Schema<IEmergencyEvent>(
  {
    title: { type: String, required: true },
    affectedRegions: [{ type: String }],
    type: { type: String, required: true, default: 'blood_shortage' },
    severity: { type: String, enum: Object.values(EmergencySeverity), required: true },
    description: { type: String, required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    bloodTypesNeeded: [{ type: String }],
    status: { type: String, enum: Object.values(EmergencyStatus), default: EmergencyStatus.DECLARED },
    declaredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    resolvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    resolvedAt: { type: Date, default: null },
    affectedArea: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
emergencyEventSchema.index({ status: 1 }); emergencyEventSchema.index({ severity: 1 }); emergencyEventSchema.index({ organizationId: 1 });
export const EmergencyEvent = mongoose.model<IEmergencyEvent>('EmergencyEvent', emergencyEventSchema);
