import mongoose, { Schema, Document } from 'mongoose';
import { BloodType } from '../../../core/constants';

export enum AppointmentStatus {
  SCHEDULED = 'scheduled',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
  RESCHEDULED = 'rescheduled',
}

export enum AppointmentType {
  SCHEDULED = 'scheduled',
  WALK_IN = 'walk_in',
  BLOOD_DRIVE = 'blood_drive',
  EMERGENCY = 'emergency',
}

export interface IAppointment extends Document {
  donorId: mongoose.Types.ObjectId;
  hospitalId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  scheduledDate: Date;
  scheduledTime: string;
  endTime: string;
  bloodType: BloodType;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  bloodDriveId?: mongoose.Types.ObjectId;
  notes: string;
  cancellationReason?: string;
  rescheduledFrom?: mongoose.Types.ObjectId;
  reminderSent: boolean;
  confirmedAt?: Date;
  checkedInAt?: Date;
  completedAt?: Date;
  qrCode: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    donorId: { type: Schema.Types.ObjectId, ref: 'Donor', required: true },
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    scheduledDate: { type: Date, required: true },
    scheduledTime: { type: String, required: true },
    endTime: { type: String, required: true },
    bloodType: { type: String, enum: Object.values(BloodType) },
    appointmentType: { type: String, enum: Object.values(AppointmentType), default: AppointmentType.SCHEDULED },
    status: { type: String, enum: Object.values(AppointmentStatus), default: AppointmentStatus.SCHEDULED },
    bloodDriveId: { type: Schema.Types.ObjectId, ref: 'Campaign' },
    notes: { type: String, default: '' },
    cancellationReason: { type: String },
    rescheduledFrom: { type: Schema.Types.ObjectId, ref: 'Appointment' },
    reminderSent: { type: Boolean, default: false },
    confirmedAt: { type: Date },
    checkedInAt: { type: Date },
    completedAt: { type: Date },
    qrCode: { type: String, required: true, unique: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appointmentSchema.index({ donorId: 1, scheduledDate: 1 });
appointmentSchema.index({ hospitalId: 1, scheduledDate: 1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ scheduledDate: 1, status: 1 });
appointmentSchema.index({ organizationId: 1 });

export const Appointment = mongoose.model<IAppointment>('Appointment', appointmentSchema);
