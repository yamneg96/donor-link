import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { Notification } from '../models/Notification';
import { User } from '../../users/models/User';
import { NotificationChannel, NotificationStatus, Role } from '../../../core/constants';
import mongoose from 'mongoose';

const expo = new Expo();

export class NotificationService {
  /**
   * Send a notification to a specific user
   */
  static async sendToUser(
    userId: string | mongoose.Types.ObjectId,
    payload: { title: string; body: string; type: string; data?: any }
  ) {
    try {
      // 1. Create In-App Notification
      const notification = await Notification.create({
        userId,
        title: payload.title,
        body: payload.body,
        type: payload.type,
        data: payload.data || {},
        channel: NotificationChannel.IN_APP,
        status: NotificationStatus.PENDING,
      });

      // 2. Fetch User for Push Tokens
      const user = await User.findById(userId);
      if (user && user.pushTokens && user.pushTokens.length > 0) {
        const messages: ExpoPushMessage[] = [];
        for (const pushToken of user.pushTokens) {
          if (!Expo.isExpoPushToken(pushToken)) continue;

          messages.push({
            to: pushToken,
            sound: 'default',
            title: payload.title,
            body: payload.body,
            data: { ...payload.data, type: payload.type },
          });
        }

        if (messages.length > 0) {
          const chunks = expo.chunkPushNotifications(messages);
          for (const chunk of chunks) {
            try {
              await expo.sendPushNotificationsAsync(chunk);
            } catch (error) {
              console.error('Error sending push notification chunk:', error);
            }
          }
        }
      }

      return notification;
    } catch (error) {
      console.error('Failed to send notification to user:', error);
      throw error;
    }
  }

  /**
   * Broadcast notification to all users of a specific role
   */
  static async broadcastToRole(
    role: Role,
    payload: { title: string; body: string; type: string; data?: any }
  ) {
    try {
      const users = await User.find({ role, status: 'active', isDeleted: false });
      const notifications = await Promise.all(
        users.map((u) => this.sendToUser(u._id, payload))
      );
      return notifications;
    } catch (error) {
      console.error(`Failed to broadcast to role ${role}:`, error);
      throw error;
    }
  }

  /**
   * Broadcast notification to all donors (mobile apps)
   */
  static async notifyDonors(payload: { title: string; body: string; type: string; data?: any }) {
    return this.broadcastToRole(Role.DONOR, payload);
  }

  /**
   * Notify all hospital staff
   */
  static async notifyHospitals(payload: { title: string; body: string; type: string; data?: any }) {
    // This could be refined to only staff in a specific region or all hospitals
    return this.broadcastToRole(Role.HOSPITAL_ADMIN, payload);
  }
}
