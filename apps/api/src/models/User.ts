import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, UserRole, IdDocumentType, RegionEthiopia, AuthMethod } from "@donorlink/types";

export interface IUserDocument extends Omit<IUser, "_id" | "createdAt" | "updatedAt">, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

const idDocumentSchema = new Schema(
  {
    type: { type: String, enum: Object.values(IdDocumentType), required: true },
    number: { type: String, required: true, uppercase: true, trim: true },
    issuedAt: Date,
    expiresAt: Date,
    verified: { type: Boolean, default: false },
    verifiedAt: Date,
    scanUrl: String,
  },
  { _id: false }
);

const addressSchema = new Schema(
  {
    region: { type: String, enum: Object.values(RegionEthiopia), required: true },
    city: { type: String, required: true, trim: true },
    subcity: { type: String, trim: true },
    woreda: { type: String, trim: true },
    kebele: { type: String, trim: true },
  },
  { _id: false }
);

const faydaProfileSchema = new Schema(
  {
    sub: { type: String, required: true },
    name: String,
    gender: String,
    birthdate: String,
    picture: String,
    phone_number: String,
    phone_number_verified: Boolean,
    address: {
      region: String,
      city: String,
    },
  },
  { _id: false }
);

const userSchema = new Schema<IUserDocument>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    amharicName: { type: String, trim: true },
    phone: {
      type: String,
      sparse: true,
      index: true,
      trim: true,
    },
    email: {
      type: String,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    // Optional for Fayda-only users
    passwordHash: { type: String, select: false },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
      default: UserRole.DONOR,
    },
    // ─── Hybrid Auth Fields ─────────────────────────────────────────────
    authMethod: {
      type: String,
      enum: Object.values(AuthMethod),
      required: true,
      default: AuthMethod.EMAIL_PASSWORD,
    },
    // Fayda pairwise subject identifier — unique per user
    faydaSub: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    // Cached profile from eSignet /userinfo
    faydaProfile: { type: faydaProfileSchema },
    // ─── Legacy Fields (optional for Fayda users) ───────────────────────
    idDocument: { type: idDocumentSchema },
    address: { type: addressSchema },
    location: {
      type: { type: String, enum: ["Point"] },
      coordinates: { type: [Number] },
    },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    onboardingComplete: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.index({ location: "2dsphere" });
userSchema.index(
  { "idDocument.number": 1, "idDocument.type": 1 },
  { unique: true, partialFilterExpression: { "idDocument.number": { $exists: true } } }
);

// Hash password before save (only for email/password users)
userSchema.pre("save", async function (next) {
  if (!this.isModified("passwordHash") || !this.passwordHash) return next();
  const salt = await bcrypt.genSalt(12);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  if (!this.passwordHash) return false;
  return bcrypt.compare(candidate, this.passwordHash);
};

// Never return password hash in JSON
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.passwordHash;
    return ret;
  },
});

export const User = mongoose.model<IUserDocument>("User", userSchema);