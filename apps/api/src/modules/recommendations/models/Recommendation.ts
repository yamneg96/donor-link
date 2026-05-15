import mongoose, { Schema, Document } from 'mongoose';
import { RecommendationType, RecommendationStatus } from '../../../core/constants';

export interface IRecommendation extends Document {
  type: RecommendationType; priority: number; sourceOrgId: mongoose.Types.ObjectId | null;
  targetOrgId: mongoose.Types.ObjectId | null; bloodType: string; units: number;
  reasoning: string; status: RecommendationStatus; expiresAt: Date;
  implementedBy: mongoose.Types.ObjectId | null; implementedAt: Date | null;
  metadata: Record<string, unknown>; createdAt: Date; updatedAt: Date;
}

const recommendationSchema = new Schema<IRecommendation>(
  {
    type: { type: String, enum: Object.values(RecommendationType), required: true },
    priority: { type: Number, default: 50, min: 0, max: 100 },
    sourceOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    targetOrgId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    bloodType: { type: String, default: '' }, units: { type: Number, default: 0 },
    reasoning: { type: String, required: true },
    status: { type: String, enum: Object.values(RecommendationStatus), default: RecommendationStatus.PENDING },
    expiresAt: { type: Date, required: true },
    implementedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
    implementedAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);
recommendationSchema.index({ type: 1, status: 1 }); recommendationSchema.index({ priority: -1 }); recommendationSchema.index({ expiresAt: 1 });
export const Recommendation = mongoose.model<IRecommendation>('Recommendation', recommendationSchema);
