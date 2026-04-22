import { config } from "../config/env";
import { logger } from "../utils/logger";

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class SmsService {
  private twilioClient: any = null;
  private atClient: any = null;

  private getTwilio() {
    if (!this.twilioClient && config.TWILIO_ACCOUNT_SID && config.TWILIO_AUTH_TOKEN) {
      const twilio = require("twilio");
      this.twilioClient = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
    }
    return this.twilioClient;
  }

  private getAfricasTalking() {
    if (!this.atClient && config.AT_API_KEY && config.AT_USERNAME) {
      const AfricasTalking = require("africastalking");
      const at = AfricasTalking({ apiKey: config.AT_API_KEY, username: config.AT_USERNAME });
      this.atClient = at.SMS;
    }
    return this.atClient;
  }

  async send(to: string, message: string): Promise<SmsResult> {
    // Try Africa's Talking first (better Ethiopian coverage + USSD support)
    const at = this.getAfricasTalking();
    if (at) {
      try {
        const result = await at.send({ to: [to], message });
        const recipient = result.SMSMessageData?.Recipients?.[0];
        if (recipient?.status === "Success") {
          logger.info("SMS sent via Africa's Talking", { to, messageId: recipient.messageId });
          return { success: true, messageId: recipient.messageId };
        }
      } catch (err) {
        logger.warn("Africa's Talking SMS failed, falling back to Twilio", { error: (err as Error).message });
      }
    }

    // Fallback: Twilio
    const twilio = this.getTwilio();
    if (twilio && config.TWILIO_PHONE_NUMBER) {
      try {
        const msg = await twilio.messages.create({
          body: message,
          from: config.TWILIO_PHONE_NUMBER,
          to,
        });
        logger.info("SMS sent via Twilio", { to, sid: msg.sid });
        return { success: true, messageId: msg.sid };
      } catch (err) {
        logger.error("Twilio SMS failed", { error: (err as Error).message });
        return { success: false, error: (err as Error).message };
      }
    }

    // Dev: just log
    if (config.NODE_ENV === "development") {
      logger.info(`[DEV SMS] To: ${to}\n${message}`);
      return { success: true, messageId: "dev-mock" };
    }

    return { success: false, error: "No SMS provider configured" };
  }

  async sendBulk(recipients: string[], message: string): Promise<SmsResult[]> {
    return Promise.all(recipients.map((r) => this.send(r, message)));
  }

  buildDonorAlertMessage(params: {
    bloodType: string;
    hospitalName: string;
    urgency: string;
    city: string;
    requestId: string;
  }): string {
    const urgencyText = params.urgency === "critical" ? "URGENT" : params.urgency.toUpperCase();
    return (
      `[DonorLink] ${urgencyText}: ${params.bloodType} blood needed at ${params.hospitalName}, ${params.city}.\n` +
      `Reply YES to confirm donation or visit donorlink.et/respond/${params.requestId}`
    );
  }

  buildAmharicDonorAlert(params: {
    bloodType: string;
    hospitalName: string;
    city: string;
    requestId: string;
  }): string {
    // Amharic: "DonorLink: [bloodType] ደም ያስፈልጋል - [hospitalName], [city]. YES ብለው ይልኩ"
    return (
      `[DonorLink]: ${params.bloodType} ደም ያስፈልጋል - ${params.hospitalName}፣ ${params.city}.\n` +
      `YES ብለው ይልኩ ወይም donorlink.et/respond/${params.requestId} ይጎብኙ`
    );
  }
}

export const smsService = new SmsService();