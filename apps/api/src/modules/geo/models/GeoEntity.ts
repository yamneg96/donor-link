import mongoose, { Schema, Document } from 'mongoose';

export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IGeoEntity extends Document {
  entityType: 'hospital' | 'blood_bank' | 'donation_center' | 'blood_drive';
  entityId: mongoose.Types.ObjectId;
  name: string;
  location: IGeoLocation;
  address: string;
  city: string;
  region: string;
  isActive: boolean;
  operatingHours: string;
  contactPhone: string;
  services: string[];
  metadata: Record<string, any>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const geoEntitySchema = new Schema<IGeoEntity>(
  {
    entityType: {
      type: String,
      enum: ['hospital', 'blood_bank', 'donation_center', 'blood_drive'],
      required: true,
    },
    entityId: { type: Schema.Types.ObjectId, required: true },
    name: { type: String, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    address: { type: String, default: '' },
    city: { type: String, default: '' },
    region: { type: String, default: '' },
    isActive: { type: Boolean, default: true },
    operatingHours: { type: String, default: '' },
    contactPhone: { type: String, default: '' },
    services: [{ type: String }],
    metadata: { type: Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

geoEntitySchema.index({ location: '2dsphere' });
geoEntitySchema.index({ entityType: 1, isActive: 1 });
geoEntitySchema.index({ region: 1 });
geoEntitySchema.index({ entityId: 1, entityType: 1 });

export const GeoEntity = mongoose.model<IGeoEntity>('GeoEntity', geoEntitySchema);
