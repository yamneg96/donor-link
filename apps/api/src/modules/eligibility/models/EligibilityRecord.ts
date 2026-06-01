import mongoose, { Schema, Document } from 'mongoose';
import { BloodType } from '../../../core/constants';

export enum RestrictionType {
  TEMPORARY = 'temporary',
  PERMANENT = 'permanent',
}

export enum EligibilityStatus {
  ELIGIBLE = 'eligible',
  INELIGIBLE = 'ineligible',
  DEFERRED = 'deferred',
  PENDING_REVIEW = 'pending_review',
}

export interface IScreeningAnswer {
  questionId: string;
  question: string;
  answer: string | boolean;
  flagged: boolean;
}

export interface IRestriction {
  type: RestrictionType;
  reason: string;
  startDate: Date;
  endDate?: Date;
  imposedBy: mongoose.Types.ObjectId;
  notes: string;
  isActive: boolean;
}

export interface IEligibilityRecord extends Document {
  donorId: mongoose.Types.ObjectId;
  screeningDate: Date;
  status: EligibilityStatus;
  screeningAnswers: IScreeningAnswer[];
  restrictions: IRestriction[];
  hemoglobinLevel: number | null;
  bloodPressureSystolic: number | null;
  bloodPressureDiastolic: number | null;
  pulseRate: number | null;
  weight: number | null;
  temperature: number | null;
  lastDonationDate: Date | null;
  nextEligibleDate: Date | null;
  bloodType: BloodType;
  reviewedBy: mongoose.Types.ObjectId | null;
  reviewNotes: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const screeningAnswerSchema = new Schema<IScreeningAnswer>(
  {
    questionId: { type: String, required: true },
    question: { type: String, required: true },
    answer: { type: Schema.Types.Mixed, required: true },
    flagged: { type: Boolean, default: false },
  },
  { _id: false }
);

const restrictionSchema = new Schema<IRestriction>(
  {
    type: { type: String, enum: Object.values(RestrictionType), required: true },
    reason: { type: String, required: true },
    startDate: { type: Date, required: true, default: Date.now },
    endDate: { type: Date },
    imposedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notes: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
  },
  { _id: true }
);

const eligibilityRecordSchema = new Schema<IEligibilityRecord>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
    screeningDate: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: Object.values(EligibilityStatus), default: EligibilityStatus.PENDING_REVIEW },
    screeningAnswers: [screeningAnswerSchema],
    restrictions: [restrictionSchema],
    hemoglobinLevel: { type: Number, default: null },
    bloodPressureSystolic: { type: Number, default: null },
    bloodPressureDiastolic: { type: Number, default: null },
    pulseRate: { type: Number, default: null },
    weight: { type: Number, default: null },
    temperature: { type: Number, default: null },
    lastDonationDate: { type: Date, default: null },
    nextEligibleDate: { type: Date, default: null },
    bloodType: { type: String, enum: Object.values(BloodType) },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    reviewNotes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

eligibilityRecordSchema.index({ donorId: 1, screeningDate: -1 });
eligibilityRecordSchema.index({ status: 1 });
eligibilityRecordSchema.index({ donorId: 1, status: 1 });

export const EligibilityRecord = mongoose.model<IEligibilityRecord>('EligibilityRecord', eligibilityRecordSchema);
