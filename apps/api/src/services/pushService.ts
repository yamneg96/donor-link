import { logger } from "../utils/logger";
import { config } from "../config/env";

export interface PushResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class PushService {
  private admin: any = null;

  private getAdmin() {
    if (!this.admin && config.FIREBASE_PROJECT_ID && config.FIREBASE_PRIVATE_KEY) {
      const firebaseAdmin = require("firebase-admin");
      if (!firebaseAdmin.apps.length) {
        firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: config.FIREBASE_PROJECT_ID,
            clientEmail: config.FIREBASE_CLIENT_EMAIL,
            privateKey: config.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
          }),
        });
      }
      this.admin = firebaseAdmin;
    }
    return this.admin;
  }

  async send(
    fcmToken: string,
    notification: { title: string; body: string },
    data?: Record<string, string>
  ): Promise<PushResult> {
    const admin = this.getAdmin();

    if (!admin) {
      if (config.NODE_ENV === "development") {
        logger.info("[DEV PUSH]", { fcmToken: fcmToken.slice(0, 20) + "...", notification });
        return { success: true, messageId: "dev-mock" };
      }
      return { success: false, error: "Firebase not configured" };
    }

    try {
      const messageId = await admin.messaging().send({
        token: fcmToken,
        notification,
        data: data ?? {},
        android: {
          priority: "high",
          notification: { sound: "default", channelId: "blood_requests" },
        },
        apns: {
          payload: { aps: { sound: "default", badge: 1 } },
        },
      });
      logger.info("Push notification sent", { messageId });
      return { success: true, messageId };
    } catch (err) {
      logger.error("Push notification failed", { error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  }

  async sendMulticast(
    tokens: string[],
    notification: { title: string; body: string },
    data?: Record<string, string>
  ): Promise<{ successCount: number; failureCount: number }> {
    if (!tokens.length) return { successCount: 0, failureCount: 0 };

    const admin = this.getAdmin();
    if (!admin) {
      if (config.NODE_ENV === "development") {
        logger.info(`[DEV PUSH MULTICAST] ${tokens.length} tokens`, notification);
        return { successCount: tokens.length, failureCount: 0 };
      }
      return { successCount: 0, failureCount: tokens.length };
    }

    try {
      const response = await admin.messaging().sendEachForMulticast({
        tokens,
        notification,
        data: data ?? {},
        android: { priority: "high" },
      });
      logger.info("Multicast push sent", {
        successCount: response.successCount,
        failureCount: response.failureCount,
      });
      return { successCount: response.successCount, failureCount: response.failureCount };
    } catch (err) {
      logger.error("Multicast push failed", { error: (err as Error).message });
      return { successCount: 0, failureCount: tokens.length };
    }
  }
}

export const pushService = new PushService();