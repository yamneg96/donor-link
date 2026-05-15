import mongoose, { Schema, Document } from 'mongoose';
import { Role, UserStatus } from '../../../core/constants';

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: Role;
  organizationId: mongoose.Types.ObjectId | null;
  status: UserStatus;
  lastLogin: Date | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  otp: string | null;
  otpExpires: Date | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true, default: '' },
    role: { type: String, enum: Object.values(Role), required: true, default: Role.DONOR },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    status: { type: String, enum: Object.values(UserStatus), default: UserStatus.ACTIVE },
    lastLogin: { type: Date, default: null },
    passwordResetToken: { type: String, default: null, select: false },
    passwordResetExpires: { type: Date, default: null, select: false },
    otp: { type: String, default: null, select: false },
    otpExpires: { type: Date, default: null, select: false },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret: any) {
        delete ret.password;
        delete ret.passwordResetToken;
        delete ret.passwordResetExpires;
        delete ret.otp;
        delete ret.otpExpires;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes

userSchema.index({ organizationId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ isDeleted: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
