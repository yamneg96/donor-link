import mongoose, { Schema, Document } from 'mongoose';

export interface IHospital extends Document {
  organizationId: mongoose.Types.ObjectId;
  name: string;
  beds: number;
  departments: string[];
  operatingHours: { open: string; close: string };
  bloodBankCapacity: number;
  hasBloodBank: boolean;
  location: { type: string; coordinates: [number, number] };
  contactPerson: { name: string; phone: string; email: string };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const hospitalSchema = new Schema<IHospital>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, unique: true },
    name: { type: String, required: true },
    beds: { type: Number, default: 0 },
    departments: [{ type: String }],
    operatingHours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '17:00' },
    },
    bloodBankCapacity: { type: Number, default: 500 },
    hasBloodBank: { type: Boolean, default: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    contactPerson: {
      name: { type: String, default: '' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


hospitalSchema.index({ location: '2dsphere' });

export const Hospital = mongoose.model<IHospital>('Hospital', hospitalSchema);
