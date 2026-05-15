import mongoose, { Schema, Document } from 'mongoose';
import { OrganizationType, OrganizationStatus } from '../../../core/constants';

export interface IOrganization extends Document {
  name: string;
  code: string;
  type: OrganizationType;
  region: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  contact: {
    phone: string;
    email: string;
    fax: string;
  };
  parentOrganizationId: mongoose.Types.ObjectId | null;
  status: OrganizationStatus;
  location: {
    type: string;
    coordinates: [number, number];
  };
  metadata: Record<string, unknown>;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const organizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true },
    type: { type: String, enum: Object.values(OrganizationType), required: true },
    region: { type: String, required: true },
    address: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      zipCode: { type: String, default: '' },
      country: { type: String, default: 'Ethiopia' },
    },
    contact: {
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      fax: { type: String, default: '' },
    },
    parentOrganizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    status: { type: String, enum: Object.values(OrganizationStatus), default: OrganizationStatus.ACTIVE },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], default: [0, 0] },
    },
    metadata: { type: Schema.Types.Mixed, default: {} },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


organizationSchema.index({ type: 1 });
organizationSchema.index({ region: 1 });
organizationSchema.index({ status: 1 });
organizationSchema.index({ parentOrganizationId: 1 });
organizationSchema.index({ location: '2dsphere' });

export const Organization = mongoose.model<IOrganization>('Organization', organizationSchema);
