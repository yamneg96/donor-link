import { Alert } from "../models/Alert";
import { BloodRequest } from "../models/BloodRequest";
import { Hospital } from "../models/Hospital";
import { matchEngine, MatchedDonor } from "./matchEngine";
import { smsService } from "./smsService";
import { pushService } from "./pushService";
import { emailService } from "./emailService";
import { AlertChannel, AlertStatus, RequestUrgency } from "@donorlink/types";
import { logger } from "../utils/logger";

export interface DispatchResult {
  requestId: string;
  donorsAlerted: number;
  smsSent: number;
  pushSent: number;
  emailSent: number;
}

class AlertService {
  /**
   * Main dispatch: find matching donors for a request and alert them via all configured channels.
   * Called when a new BloodRequest is created or manually re-triggered.
   */
  async dispatchForRequest(requestId: string): Promise<DispatchResult> {
    const request = await BloodRequest.findById(requestId);
    if (!request) throw new Error(`BloodRequest ${requestId} not found`);

    const hospital = await Hospital.findById(request.hospitalId).select("name address");
    if (!hospital) throw new Error(`Hospital ${request.hospitalId} not found`);

    const alreadyAlerted = request.matchedDonorIds.map((id) => id.toString());

    const { donors } = await matchEngine.findMatchingDonors({
      bloodType: request.bloodType,
      coordinates: request.location.coordinates as [number, number],
      radiusKm: request.radiusKm,
      requestId,
      excludeDonorIds: alreadyAlerted,
      limit: 100,
    });

    if (!donors.length) {
      logger.warn("No matching donors found for request", { requestId });
      return { requestId, donorsAlerted: 0, smsSent: 0, pushSent: 0, emailSent: 0 };
    }

    const results = await Promise.allSettled(
      donors.map((donor) => this.alertDonor(donor, request, hospital))
    );

    let smsSent = 0, pushSent = 0, emailSent = 0;
    for (const r of results) {
      if (r.status === "fulfilled") {
        smsSent += r.value.sms ? 1 : 0;
        pushSent += r.value.push ? 1 : 0;
        emailSent += r.value.email ? 1 : 0;
      }
    }

    // Update request with matched donor IDs and alert count
    await BloodRequest.findByIdAndUpdate(requestId, {
      $addToSet: { matchedDonorIds: { $each: donors.map((d) => d.userId) } },
      $inc: { alertsSentCount: donors.length },
    });

    logger.info("Alert dispatch complete", {
      requestId,
      donorsAlerted: donors.length,
      smsSent,
      pushSent,
      emailSent,
    });

    return { requestId, donorsAlerted: donors.length, smsSent, pushSent, emailSent };
  }

  private async alertDonor(
    donor: MatchedDonor,
    request: any,
    hospital: any
  ): Promise<{ sms: boolean; push: boolean; email: boolean }> {
    const prefs = donor.notificationPreferences;
    const urgency: RequestUrgency = request.urgency;
    const hospitalName: string = hospital.name;
    const city: string = hospital.address.city;

    const results = { sms: false, push: false, email: false };

    const alertParams = {
      bloodType: request.bloodType,
      hospitalName,
      urgency,
      city,
      requestId: request._id.toString(),
    };

    // SMS
    if (prefs.sms && donor.phone) {
      const message = smsService.buildDonorAlertMessage(alertParams);
      const smsResult = await smsService.send(donor.phone, message);

      await Alert.create({
        requestId: request._id,
        donorId: donor.userId,
        channel: AlertChannel.SMS,
        status: smsResult.success ? AlertStatus.SENT : AlertStatus.FAILED,
        message,
        sentAt: smsResult.success ? new Date() : undefined,
        failureReason: smsResult.error,
      });

      results.sms = smsResult.success;
    }

    // Push
    if (prefs.push && donor.fcmToken) {
      const pushResult = await pushService.send(
        donor.fcmToken,
        {
          title: `🩸 ${urgency === "critical" ? "URGENT: " : ""}${request.bloodType} Blood Needed`,
          body: `${hospitalName}, ${city} — ${donor.distanceKm}km away`,
        },
        { requestId: request._id.toString(), bloodType: request.bloodType }
      );

      await Alert.create({
        requestId: request._id,
        donorId: donor.userId,
        channel: AlertChannel.PUSH,
        status: pushResult.success ? AlertStatus.SENT : AlertStatus.FAILED,
        message: `Push: ${request.bloodType} needed at ${hospitalName}`,
        sentAt: pushResult.success ? new Date() : undefined,
        failureReason: pushResult.error,
      });

      results.push = pushResult.success;
    }

    // Email
    if (prefs.email && donor.email && !prefs.emergencyOnly) {
      const html = emailService.donorAlertHtml({
        donorName: "Donor",
        ...alertParams,
      });
      const emailResult = await emailService.send({
        to: donor.email,
        subject: `Blood Donation Request — ${request.bloodType} needed at ${hospitalName}`,
        html,
      });

      await Alert.create({
        requestId: request._id,
        donorId: donor.userId,
        channel: AlertChannel.EMAIL,
        status: emailResult.success ? AlertStatus.SENT : AlertStatus.FAILED,
        message: `Email: ${request.bloodType} needed at ${hospitalName}`,
        sentAt: emailResult.success ? new Date() : undefined,
        failureReason: emailResult.error,
      });

      results.email = emailResult.success;
    }

    return results;
  }

  /** Handle donor response (SMS reply YES/NO or app tap) */
  async recordDonorResponse(params: {
    requestId: string;
    donorId: string;
    response: "accepted" | "declined";
  }) {
    const { requestId, donorId, response } = params;

    await Alert.updateMany(
      { requestId, donorId },
      { $set: { donorResponse: response, respondedAt: new Date() } }
    );

    if (response === "accepted") {
      await BloodRequest.findByIdAndUpdate(requestId, {
        $inc: { unitsMatched: 1 },
      });
    }

    logger.info("Donor response recorded", { requestId, donorId, response });
  }
}

export const alertService = new AlertService();