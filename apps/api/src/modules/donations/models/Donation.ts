import mongoose, { Schema, Document } from 'mongoose';
import { BloodType, ComponentType, DonationStatus } from '../../../core/constants';

export interface IDonation extends Document {
  donorId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  donationType: 'voluntary' | 'replacement' | 'directed';
  bloodType: BloodType;
  componentType: ComponentType;
  volume: number; // in mL
  collectionDate: Date;
  status: DonationStatus;
  staffId: mongoose.Types.ObjectId;
  screeningResults: {
    hemoglobin: number;
    bloodPressure: string;
    pulse: number;
    temperature: number;
    weight: number;
    passed: boolean;
    notes: string;
  };
  testResults: {
    hiv: boolean | null;
    hepatitisB: boolean | null;
    hepatitisC: boolean | null;
    syphilis: boolean | null;
    malaria: boolean | null;
    allClear: boolean | null;
    testedAt: Date | null;
  };
  bloodUnitsCreated: mongoose.Types.ObjectId[];
  notes: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const donationSchema = new Schema<IDonation>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    donationType: { type: String, enum: ['voluntary', 'replacement', 'directed'], default: 'voluntary' },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    componentType: { type: String, enum: Object.values(ComponentType), default: ComponentType.WHOLE_BLOOD },
    volume: { type: Number, default: 450 },
    collectionDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(DonationStatus), default: DonationStatus.COMPLETED },
    staffId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    screeningResults: {
      hemoglobin: { type: Number, default: 0 }, bloodPressure: { type: String, default: '' },
      pulse: { type: Number, default: 0 }, temperature: { type: Number, default: 0 },
      weight: { type: Number, default: 0 }, passed: { type: Boolean, default: true }, notes: { type: String, default: '' },
    },
    testResults: {
      hiv: { type: Boolean, default: null }, hepatitisB: { type: Boolean, default: null },
      hepatitisC: { type: Boolean, default: null }, syphilis: { type: Boolean, default: null },
      malaria: { type: Boolean, default: null }, allClear: { type: Boolean, default: null },
      testedAt: { type: Date, default: null },
    },
    bloodUnitsCreated: [{ type: Schema.Types.ObjectId, ref: 'BloodUnit' }],
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

donationSchema.index({ donorId: 1 });
donationSchema.index({ organizationId: 1 });
donationSchema.index({ collectionDate: -1 });
donationSchema.index({ status: 1 });

export const Donation = mongoose.model<IDonation>('Donation', donationSchema);
