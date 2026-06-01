import mongoose, { Schema, Document } from 'mongoose';

export interface IAppointmentSlot extends Document {
  hospitalId: mongoose.Types.ObjectId;
  date: Date;
  startTime: string;
  endTime: string;
  capacity: number;
  booked: number;
  isActive: boolean;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSlotSchema = new Schema<IAppointmentSlot>(
  {
    hospitalId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    date: { type: Date, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    capacity: { type: Number, required: true, default: 10 },
    booked: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

appointmentSlotSchema.index({ hospitalId: 1, date: 1 });
appointmentSlotSchema.index({ date: 1, isActive: 1 });

export const AppointmentSlot = mongoose.model<IAppointmentSlot>('AppointmentSlot', appointmentSlotSchema);
