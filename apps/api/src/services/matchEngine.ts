import mongoose from "mongoose";
import { User } from "../models/User";
import { Donor } from "../models/Donor";
import { Alert } from "../models/Alert";
import { BloodType, DonorStatus, AlertChannel } from "@donorlink/types";
import { logger } from "../utils/logger";

// Blood type compatibility: which donor types can donate to which recipient types
const COMPATIBLE_DONORS: Record<BloodType, BloodType[]> = {
  [BloodType.A_POS]:  [BloodType.A_POS, BloodType.A_NEG, BloodType.O_POS, BloodType.O_NEG],
  [BloodType.A_NEG]:  [BloodType.A_NEG, BloodType.O_NEG],
  [BloodType.B_POS]:  [BloodType.B_POS, BloodType.B_NEG, BloodType.O_POS, BloodType.O_NEG],
  [BloodType.B_NEG]:  [BloodType.B_NEG, BloodType.O_NEG],
  [BloodType.AB_POS]: Object.values(BloodType), // Universal recipient
  [BloodType.AB_NEG]: [BloodType.A_NEG, BloodType.B_NEG, BloodType.AB_NEG, BloodType.O_NEG],
  [BloodType.O_POS]:  [BloodType.O_POS, BloodType.O_NEG],
  [BloodType.O_NEG]:  [BloodType.O_NEG], // Universal donor
};

export interface MatchedDonor {
  userId: string;
  donorProfileId: string;
  bloodType: BloodType;
  distanceKm: number;
  phone: string;
  email?: string;
  fcmToken?: string;
  notificationPreferences: {
    sms: boolean;
    push: boolean;
    email: boolean;
    emergencyOnly: boolean;
    maxAlertsPerDay: number;
  };
}

export interface MatchResult {
  donors: MatchedDonor[];
  total: number;
}

class MatchEngine {
  /**
   * Find eligible donors near a hospital for a given blood type.
   * Respects compatibility rules, geo radius, and per-donor alert limits.
   */
  async findMatchingDonors(params: {
    bloodType: BloodType;
    coordinates: [number, number]; // [lng, lat]
    radiusKm: number;
    requestId: string;
    excludeDonorIds?: string[];
    limit?: number;
  }): Promise<MatchResult> {
    const {
      bloodType,
      coordinates,
      radiusKm,
      requestId,
      excludeDonorIds = [],
      limit = 50,
    } = params;

    const compatibleTypes = COMPATIBLE_DONORS[bloodType];
    const now = new Date();

    // Find donors in geo radius with compatible blood type
    const usersNearby = await User.aggregate([
      {
        $geoNear: {
          near: { type: "Point", coordinates },
          distanceField: "distanceMeters",
          maxDistance: radiusKm * 1000,
          spherical: true,
          query: {
            isActive: true,
            isVerified: true,
            _id: { $nin: excludeDonorIds.map((id) => new mongoose.Types.ObjectId(id)) },
          },
        },
      },
      { $limit: limit * 3 }, // Over-fetch, filter below
      {
        $lookup: {
          from: "donors",
          localField: "_id",
          foreignField: "userId",
          as: "donorProfile",
        },
      },
      { $unwind: "$donorProfile" },
      {
        $match: {
          "donorProfile.bloodType": { $in: compatibleTypes },
          "donorProfile.status": DonorStatus.ACTIVE,
          "donorProfile.availableForEmergency": true,
          $or: [
            { "donorProfile.nextEligibleDate": { $exists: false } },
            { "donorProfile.nextEligibleDate": { $lte: now } },
          ],
        },
      },
      { $limit: limit },
      {
        $project: {
          _id: 1,
          phone: 1,
          email: 1,
          fcmToken: 1,
          distanceMeters: 1,
          "donorProfile._id": 1,
          "donorProfile.bloodType": 1,
          "donorProfile.notificationPreferences": 1,
        },
      },
    ]);

    // Filter donors who haven't exceeded their daily alert limit
    const enriched = await this.filterByAlertLimit(usersNearby, requestId);

    const donors: MatchedDonor[] = enriched.map((u: any) => ({
      userId: u._id.toString(),
      donorProfileId: u.donorProfile._id.toString(),
      bloodType: u.donorProfile.bloodType,
      distanceKm: Math.round((u.distanceMeters / 1000) * 10) / 10,
      phone: u.phone,
      email: u.email,
      fcmToken: u.fcmToken,
      notificationPreferences: u.donorProfile.notificationPreferences,
    }));

    logger.info("Match engine found donors", {
      requestId,
      bloodType,
      radiusKm,
      matched: donors.length,
    });

    return { donors, total: donors.length };
  }

  private async filterByAlertLimit(users: any[], requestId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const userIds = users.map((u: any) => u._id);

    // Count today's alerts per donor
    const alertCounts = await Alert.aggregate([
      {
        $match: {
          donorId: { $in: userIds },
          createdAt: { $gte: today },
          requestId: { $ne: new mongoose.Types.ObjectId(requestId) },
        },
      },
      { $group: { _id: "$donorId", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(alertCounts.map((a: any) => [a._id.toString(), a.count]));

    return users.filter((u: any) => {
      const maxAlerts = u.donorProfile.notificationPreferences?.maxAlertsPerDay ?? 3;
      const todayCount = countMap.get(u._id.toString()) ?? 0;
      return todayCount < maxAlerts;
    });
  }

  getCompatibleDonorTypes(recipientType: BloodType): BloodType[] {
    return COMPATIBLE_DONORS[recipientType];
  }
}

export const matchEngine = new MatchEngine();