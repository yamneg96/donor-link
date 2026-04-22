import { logger } from "../utils/logger";
import { config } from "../config/env";

export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

class EmailService {
  private resend: any = null;

  private getResend() {
    if (!this.resend && config.RESEND_API_KEY) {
      const { Resend } = require("resend");
      this.resend = new Resend(config.RESEND_API_KEY);
    }
    return this.resend;
  }

  async send(params: {
    to: string | string[];
    subject: string;
    html: string;
    text?: string;
  }): Promise<EmailResult> {
    const resend = this.getResend();

    if (!resend) {
      if (config.NODE_ENV === "development") {
        logger.info("[DEV EMAIL]", { to: params.to, subject: params.subject });
        return { success: true, messageId: "dev-mock" };
      }
      return { success: false, error: "Email service not configured" };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: config.RESEND_FROM_EMAIL,
        to: params.to,
        subject: params.subject,
        html: params.html,
        text: params.text,
      });

      if (error) {
        logger.error("Resend email failed", { error });
        return { success: false, error: error.message };
      }

      logger.info("Email sent", { messageId: data?.id, to: params.to });
      return { success: true, messageId: data?.id };
    } catch (err) {
      logger.error("Email send threw", { error: (err as Error).message });
      return { success: false, error: (err as Error).message };
    }
  }

  donorAlertHtml(params: {
    donorName: string;
    bloodType: string;
    hospitalName: string;
    city: string;
    urgency: string;
    requestId: string;
  }): string {
    const color = params.urgency === "critical" ? "#DC2626" : params.urgency === "urgent" ? "#D97706" : "#059669";
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
<body style="font-family:sans-serif;background:#f9fafb;margin:0;padding:24px">
  <div style="max-width:480px;margin:0 auto;background:#fff;border-radius:12px;overflow:hidden;border:1px solid #e5e7eb">
    <div style="background:${color};padding:20px 24px">
      <h1 style="color:#fff;margin:0;font-size:20px">🩸 Blood Donation Request</h1>
      <p style="color:rgba(255,255,255,0.85);margin:4px 0 0;font-size:14px">${params.urgency.toUpperCase()} — ${params.bloodType} needed</p>
    </div>
    <div style="padding:24px">
      <p style="font-size:16px;color:#111827">Hello <strong>${params.donorName}</strong>,</p>
      <p style="color:#374151">Your blood type <strong>${params.bloodType}</strong> is urgently needed at:</p>
      <div style="background:#f3f4f6;border-radius:8px;padding:16px;margin:16px 0">
        <p style="margin:0;font-weight:600;color:#111827">${params.hospitalName}</p>
        <p style="margin:4px 0 0;color:#6b7280;font-size:14px">${params.city}, Ethiopia</p>
      </div>
      <a href="https://donorlink.et/respond/${params.requestId}?action=accept"
        style="display:inline-block;background:#DC2626;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 0">
        I Can Donate
      </a>
      <a href="https://donorlink.et/respond/${params.requestId}?action=decline"
        style="display:inline-block;background:#f3f4f6;color:#374151;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:8px 8px">
        Not Available
      </a>
      <p style="font-size:12px;color:#9ca3af;margin-top:24px">
        You are receiving this because you registered as a blood donor with DonorLink Ethiopia.
        <a href="https://donorlink.et/settings/notifications" style="color:#6b7280">Manage notifications</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }
}

export const emailService = new EmailService();