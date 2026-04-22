import mongoose, { Schema, Document } from "mongoose";
import { IHospital, BloodType, RegionEthiopia } from "@donorlink/types";

export interface IHospitalDocument extends Omit<IHospital, "_id" | "createdAt" | "updatedAt">, Document {}

const bloodInventorySchema = new Schema(
  {
    bloodType: { type: String, enum: Object.values(BloodType), required: true },
    units: { type: Number, default: 0, min: 0 },
    criticalThreshold: { type: Number, default: 5, min: 0 },
  },
  { _id: false }
);

const hospitalSchema = new Schema<IHospitalDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    amharicName: { type: String, trim: true },
    licenseNumber: { type: String, required: true, unique: true, uppercase: true, trim: true },
    address: {
      region: { type: String, enum: Object.values(RegionEthiopia), required: true },
      city: { type: String, required: true, trim: true },
      subcity: String,
      woreda: String,
      kebele: String,
    },
    location: {
      type: { type: String, enum: ["Point"], required: true, default: "Point" },
      coordinates: { type: [Number], required: true },
    },
    phone: { type: String, required: true },
    emergencyPhone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    adminUserId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    bloodInventory: [bloodInventorySchema],
    isVerified: { type: Boolean, default: false, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

hospitalSchema.index({ location: "2dsphere" });
hospitalSchema.index({ "address.region": 1 });

// Initialize blood inventory with all types on creation
hospitalSchema.pre("save", function (next) {
  if (this.isNew && (!this.bloodInventory || this.bloodInventory.length === 0)) {
    this.bloodInventory = Object.values(BloodType).map((bt) => ({
      bloodType: bt,
      units: 0,
      criticalThreshold: 5,
    }));
  }
  next();
});

export const Hospital = mongoose.model<IHospitalDocument>("Hospital", hospitalSchema);