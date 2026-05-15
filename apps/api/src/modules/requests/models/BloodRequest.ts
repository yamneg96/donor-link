import mongoose, { Schema, Document } from 'mongoose';
import { BloodType, ComponentType, RequestStatus, RequestUrgency } from '../../../core/constants';

export interface IBloodRequest extends Document {
  requestingOrgId: mongoose.Types.ObjectId;
  bloodType: BloodType;
  componentType: ComponentType;
  quantity: number;
  urgency: RequestUrgency;
  status: RequestStatus;
  fulfilledUnits: mongoose.Types.ObjectId[];
  requestedBy: mongoose.Types.ObjectId;
  patientInfo: { name: string; age: number; condition: string };
  notes: string;
  fulfilledAt: Date | null;
  expiresAt: Date;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const bloodRequestSchema = new Schema<IBloodRequest>(
  {
    requestingOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    componentType: { type: String, enum: Object.values(ComponentType), default: ComponentType.WHOLE_BLOOD },
    quantity: { type: Number, required: true, min: 1 },
    urgency: { type: String, enum: Object.values(RequestUrgency), default: RequestUrgency.ROUTINE },
    status: { type: String, enum: Object.values(RequestStatus), default: RequestStatus.PENDING },
    fulfilledUnits: [{ type: Schema.Types.ObjectId, ref: 'BloodUnit' }],
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patientInfo: { name: { type: String, default: '' }, age: { type: Number, default: 0 }, condition: { type: String, default: '' } },
    notes: { type: String, default: '' },
    fulfilledAt: { type: Date, default: null },
    expiresAt: { type: Date, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bloodRequestSchema.index({ requestingOrgId: 1, status: 1 });
bloodRequestSchema.index({ bloodType: 1, status: 1 });
bloodRequestSchema.index({ urgency: 1, status: 1 });
bloodRequestSchema.index({ expiresAt: 1 });

export const BloodRequest = mongoose.model<IBloodRequest>('BloodRequest', bloodRequestSchema);
