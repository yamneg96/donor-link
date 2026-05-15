import mongoose, { Schema, Document } from 'mongoose';
import { CampaignStatus, CampaignType } from '../../../core/constants';

export interface ICampaign extends Document {
  title: string; description: string; targetBloodTypes: string[]; targetRegions: string[];
  organizationId: mongoose.Types.ObjectId; startDate: Date; endDate: Date; status: CampaignStatus;
  type: CampaignType; goal: number; currentProgress: number; metadata: Record<string, unknown>;
  createdBy: mongoose.Types.ObjectId; isDeleted: boolean; createdAt: Date; updatedAt: Date;
}

const campaignSchema = new Schema<ICampaign>(
  {
    title: { type: String, required: true }, description: { type: String, default: '' },
    targetBloodTypes: [{ type: String }], targetRegions: [{ type: String }],
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    startDate: { type: Date, required: true }, endDate: { type: Date, required: true },
    status: { type: String, enum: Object.values(CampaignStatus), default: CampaignStatus.DRAFT },
    type: { type: String, enum: Object.values(CampaignType), default: CampaignType.GENERAL },
    goal: { type: Number, default: 100 }, currentProgress: { type: Number, default: 0 },
    metadata: { type: Schema.Types.Mixed, default: {} },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);
campaignSchema.index({ status: 1 }); campaignSchema.index({ organizationId: 1 }); campaignSchema.index({ startDate: 1, endDate: 1 });
export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);
