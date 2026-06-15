import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { User } from '../../modules/users/models/User';
import { Notification } from '../../modules/notifications/models/Notification';
import { NotificationChannel, NotificationStatus } from '../../core/constants';
import { logger } from '../../config';

const expo = new Expo();

export class NotificationService {
  /**
   * Send a push notification to a user's devices.
   */
  async sendPushNotification(userId: string, title: string, body: string, data: any = {}) {
    try {
      const user = await User.findById(userId);
      if (!user || user.pushTokens.length === 0) {
        logger.warn(`No push tokens for user ${userId}`);
        return;
      }

      const messages: ExpoPushMessage[] = [];
      for (const pushToken of user.pushTokens) {
        if (!Expo.isExpoPushToken(pushToken)) {
          logger.error(`Push token ${pushToken} is not a valid Expo push token`);
          continue;
        }

        messages.push({
          to: pushToken,
          sound: 'default',
          title,
          body,
          data: { ...data, title, body },
        });
      }

      const chunks = expo.chunkPushNotifications(messages);
      const tickets = [];
      
      for (const chunk of chunks) {
        try {
          const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          tickets.push(...ticketChunk);
        } catch (error) {
          logger.error('Error sending push notification chunk', error);
        }
      }

      // Create in-app notification record
      await Notification.create({
        userId,
        type: data.type || 'GENERAL',
        channel: NotificationChannel.PUSH,
        title,
        body,
        data,
        status: NotificationStatus.SENT,
        sentAt: new Date(),
      });

      return tickets;
    } catch (error) {
      logger.error('Failed to send push notification', error);
      throw error;
    }
  }

  /**
   * Broadbast notification to all users matching a criteria
   */
  async broadcastNotification(criteria: any, title: string, body: string, data: any = {}) {
    const users = await User.find({ ...criteria, pushTokens: { $exists: true, $not: { $size: 0 } } });
    const promises = users.map(user => this.sendPushNotification(user._id.toString(), title, body, data));
    return Promise.all(promises);
  }
}

export const notificationService = new NotificationService();
