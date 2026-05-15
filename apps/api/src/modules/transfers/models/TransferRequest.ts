import mongoose, { Schema, Document } from 'mongoose';
import { TransferStatus, BloodType } from '../../../core/constants';

export interface ITransferRequest extends Document {
  fromOrgId: mongoose.Types.ObjectId;
  toOrgId: mongoose.Types.ObjectId;
  bloodUnits: mongoose.Types.ObjectId[];
  bloodType: BloodType;
  quantity: number;
  status: TransferStatus;
  priority: 'normal' | 'urgent' | 'emergency';
  requestedBy: mongoose.Types.ObjectId;
  approvedBy: mongoose.Types.ObjectId | null;
  approvedAt: Date | null;
  rejectedBy: mongoose.Types.ObjectId | null;
  rejectionReason: string;
  notes: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const transferRequestSchema = new Schema<ITransferRequest>(
  {
    fromOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    toOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    bloodUnits: [{ type: Schema.Types.ObjectId, ref: 'BloodUnit' }],
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    quantity: { type: Number, required: true, min: 1 },
    status: { type: String, enum: Object.values(TransferStatus), default: TransferStatus.PENDING },
    priority: { type: String, enum: ['normal', 'urgent', 'emergency'], default: 'normal' },
    requestedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    approvedAt: { type: Date, default: null },
    rejectedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    rejectionReason: { type: String, default: '' },
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transferRequestSchema.index({ fromOrgId: 1, status: 1 });
transferRequestSchema.index({ toOrgId: 1, status: 1 });
transferRequestSchema.index({ status: 1 });
transferRequestSchema.index({ priority: 1 });

export const TransferRequest = mongoose.model<ITransferRequest>('TransferRequest', transferRequestSchema);
