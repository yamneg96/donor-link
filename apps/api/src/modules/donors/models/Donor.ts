import mongoose, { Schema, Document } from 'mongoose';
import { BloodType } from '../../../core/constants';

export interface IDonor extends Document {
  userId: mongoose.Types.ObjectId;
  bloodType: BloodType;
  dateOfBirth: Date;
  gender: 'male' | 'female' | 'other';
  weight: number;
  height: number;
  isEligible: boolean;
  eligibilityNotes: string;
  lastDonationDate: Date | null;
  totalDonations: number;
  nextEligibleDate: Date | null;
  medicalHistory: string[];
  location: { type: string; coordinates: [number, number] };
  preferredDonationCenter: mongoose.Types.ObjectId | null;
  isAvailable: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const donorSchema = new Schema<IDonor>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    dateOfBirth: { type: Date, required: true },
    gender: { type: String, enum: ['male', 'female', 'other'], required: true },
    weight: { type: Number, required: true },
    height: { type: Number, default: 0 },
    isEligible: { type: Boolean, default: true },
    eligibilityNotes: { type: String, default: '' },
    lastDonationDate: { type: Date, default: null },
    totalDonations: { type: Number, default: 0 },
    nextEligibleDate: { type: Date, default: null },
    medicalHistory: [{ type: String }],
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    preferredDonationCenter: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    isAvailable: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


donorSchema.index({ bloodType: 1 });
donorSchema.index({ isEligible: 1 });
donorSchema.index({ isAvailable: 1 });
donorSchema.index({ location: '2dsphere' });
donorSchema.index({ nextEligibleDate: 1 });

export const Donor = mongoose.model<IDonor>('Donor', donorSchema);
