import mongoose, { Schema, Document } from 'mongoose';

export interface IDamagedUnit {
  bloodUnitId: mongoose.Types.ObjectId;
  reason: string;
  notes: string;
}

export interface IBloodDispatch extends Document {
  fromOrgId: mongoose.Types.ObjectId;
  toOrgId: mongoose.Types.ObjectId;
  bloodUnits: mongoose.Types.ObjectId[];
  status: 'pending' | 'dispatched' | 'in_transit' | 'received' | 'partially_received' | 'rejected';
  priority: 'normal' | 'urgent' | 'emergency';
  dispatchNotes: string;
  receiptNotes: string;
  damagedUnits: IDamagedUnit[];
  dispatchedBy: mongoose.Types.ObjectId;
  approvedBy: mongoose.Types.ObjectId | null;
  receivedBy: mongoose.Types.ObjectId | null;
  dispatchedAt: Date | null;
  receivedAt: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const damagedUnitSchema = new Schema<IDamagedUnit>(
  {
    bloodUnitId: { type: Schema.Types.ObjectId, ref: 'BloodUnit', required: true },
    reason: { type: String, required: true },
    notes: { type: String, default: '' },
  },
  { _id: false }
);

const bloodDispatchSchema = new Schema<IBloodDispatch>(
  {
    fromOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    toOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    bloodUnits: [{ type: Schema.Types.ObjectId, ref: 'BloodUnit' }],
    status: { 
      type: String, 
      enum: ['pending', 'dispatched', 'in_transit', 'received', 'partially_received', 'rejected'], 
      default: 'pending' 
    },
    priority: { type: String, enum: ['normal', 'urgent', 'emergency'], default: 'normal' },
    dispatchNotes: { type: String, default: '' },
    receiptNotes: { type: String, default: '' },
    damagedUnits: [damagedUnitSchema],
    dispatchedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    receivedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    dispatchedAt: { type: Date, default: null },
    receivedAt: { type: Date, default: null },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

bloodDispatchSchema.index({ fromOrgId: 1, status: 1 });
bloodDispatchSchema.index({ toOrgId: 1, status: 1 });
bloodDispatchSchema.index({ status: 1 });
bloodDispatchSchema.index({ createdAt: -1 });

export const BloodDispatch = mongoose.model<IBloodDispatch>('BloodDispatch', bloodDispatchSchema);
