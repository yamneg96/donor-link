import mongoose, { Schema, Document } from 'mongoose';
import { NotificationChannel, NotificationStatus } from '../../../core/constants';

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId; type: string; channel: NotificationChannel;
  title: string; body: string; data: Record<string, unknown>;
  status: NotificationStatus; readAt: Date | null; sentAt: Date | null;
  createdAt: Date; updatedAt: Date;
}

const notificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, required: true },
    channel: { type: String, enum: Object.values(NotificationChannel), default: NotificationChannel.IN_APP },
    title: { type: String, required: true }, body: { type: String, default: '' },
    data: { type: Schema.Types.Mixed, default: {} },
    status: { type: String, enum: Object.values(NotificationStatus), default: NotificationStatus.PENDING },
    readAt: { type: Date, default: null }, sentAt: { type: Date, default: null },
  },
  { timestamps: true }
);
notificationSchema.index({ userId: 1, status: 1 }); notificationSchema.index({ createdAt: -1 });
export const Notification = mongoose.model<INotification>('Notification', notificationSchema);
