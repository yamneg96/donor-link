import mongoose, { Schema, Document } from 'mongoose';
import { BloodType, ComponentType, BloodUnitStatus } from '../../../core/constants';

export interface ILifecycleEntry {
  status: BloodUnitStatus;
  timestamp: Date;
  performedBy: mongoose.Types.ObjectId;
  notes: string;
  organizationId?: mongoose.Types.ObjectId;
}

export interface IBloodUnit extends Document {
  donationId: mongoose.Types.ObjectId;
  donorId: mongoose.Types.ObjectId;
  bloodType: BloodType;
  componentType: ComponentType;
  volume: number;
  collectionDate: Date;
  expiryDate: Date;
  status: BloodUnitStatus;
  organizationId: mongoose.Types.ObjectId;
  currentHospitalId: mongoose.Types.ObjectId;
  barcode: string;
  qrCode: string;
  lifecycleHistory: ILifecycleEntry[];
  reservedFor: mongoose.Types.ObjectId | null;
  reservedAt: Date | null;
  usedAt: Date | null;
  discardReason: string | null;
  transferHistory: mongoose.Types.ObjectId[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const lifecycleEntrySchema = new Schema<ILifecycleEntry>(
  {
    status: { type: String, enum: Object.values(BloodUnitStatus), required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String, default: '' },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization' },
  },
  { _id: false }
);

const bloodUnitSchema = new Schema<IBloodUnit>(
  {
    donationId: { type: Schema.Types.ObjectId, ref: 'Donation', required: true },
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    componentType: { type: String, enum: Object.values(ComponentType), required: true },
    volume: { type: Number, required: true },
    collectionDate: { type: Date, required: true },
    expiryDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(BloodUnitStatus), default: BloodUnitStatus.COLLECTED },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    currentHospitalId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    barcode: { type: String, required: true, unique: true },
    qrCode: { type: String, required: true, unique: true },
    lifecycleHistory: [lifecycleEntrySchema],
    reservedFor: { type: Schema.Types.ObjectId, ref: 'BloodRequest', default: null },
    reservedAt: { type: Date, default: null },
    usedAt: { type: Date, default: null },
    discardReason: { type: String, default: null },
    transferHistory: [{ type: Schema.Types.ObjectId, ref: 'TransferRequest' }],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bloodUnitSchema.index({ bloodType: 1, status: 1 });
bloodUnitSchema.index({ organizationId: 1, status: 1 });
bloodUnitSchema.index({ currentHospitalId: 1, status: 1 });
bloodUnitSchema.index({ expiryDate: 1 });

bloodUnitSchema.index({ donorId: 1 });
bloodUnitSchema.index({ status: 1 });
bloodUnitSchema.index({ componentType: 1 });

export const BloodUnit = mongoose.model<IBloodUnit>('BloodUnit', bloodUnitSchema);
