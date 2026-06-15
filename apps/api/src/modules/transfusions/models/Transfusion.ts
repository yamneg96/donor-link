import mongoose, { Schema, Document } from 'mongoose';

export interface ITransfusionEdit {
  editedBy: mongoose.Types.ObjectId;
  editedAt: Date;
  previousData: any;
  reason: string;
}

export interface ITransfusion extends Document {
  bloodUnitId: mongoose.Types.ObjectId;
  hospitalOrgId: mongoose.Types.ObjectId;
  patientInfo: {
    name: string;
    age: number;
    gender: 'male' | 'female' | 'other';
    nationalId: string;
    illness: string;
    ward: string;
  };
  administeredBy: mongoose.Types.ObjectId;
  administeredAt: Date;
  status: 'administered' | 'completed' | 'reported';
  outcome: 'success' | 'complication' | 'failure';
  reactions: string[];
  notes: string;
  editCount: number;
  editHistory: ITransfusionEdit[];
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const transfusionEditSchema = new Schema<ITransfusionEdit>(
  {
    editedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    editedAt: { type: Date, default: Date.now },
    previousData: { type: Schema.Types.Mixed },
    reason: { type: String, required: true },
  },
  { _id: false }
);

const transfusionSchema = new Schema<ITransfusion>(
  {
    bloodUnitId: { type: Schema.Types.ObjectId, ref: 'BloodUnit', required: true },
    hospitalOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    patientInfo: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      gender: { type: String, enum: ['male', 'female', 'other'], required: true },
      nationalId: { type: String, required: true },
      illness: { type: String, required: true },
      ward: { type: String, required: true },
    },
    administeredBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    administeredAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['administered', 'completed', 'reported'], default: 'administered' },
    outcome: { type: String, enum: ['success', 'complication', 'failure'], default: 'success' },
    reactions: [{ type: String }],
    notes: { type: String, default: '' },
    editCount: { type: Number, default: 0, max: 3 },
    editHistory: [transfusionEditSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

transfusionSchema.index({ bloodUnitId: 1 });
transfusionSchema.index({ hospitalOrgId: 1 });
transfusionSchema.index({ administeredAt: -1 });
transfusionSchema.index({ 'patientInfo.nationalId': 1 });

export const Transfusion = mongoose.model<ITransfusion>('Transfusion', transfusionSchema);
