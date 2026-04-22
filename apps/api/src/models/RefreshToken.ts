import mongoose, { Schema, Document } from "mongoose";

export interface IRefreshTokenDocument extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  family: string;
  used: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const refreshTokenSchema = new Schema<IRefreshTokenDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    token: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true }, // detect reuse attacks
    used: { type: Boolean, default: false },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Auto-delete expired tokens
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshToken = mongoose.model<IRefreshTokenDocument>("RefreshToken", refreshTokenSchema);