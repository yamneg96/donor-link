import { Request, Response } from "express";
import { Donor } from "../models/Donor";
import { User } from "../models/User";
import { Donation } from "../models/Donation";
import { Alert } from "../models/Alert";
import { ApiError, asyncHandler } from "../utils/errors";
import { checkDonorEligibility, computeNextEligibleDate } from "../utils/eligibility";
import { DonorStatus, UserRole } from "@donorlink/types";

export const getMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const donor = await Donor.findOne({ userId: req.user!.userId }).populate("userId", "-passwordHash");
  if (!donor) throw ApiError.notFound("Donor profile not found");
  return res.json({ success: true, data: donor });
});

export const updateMyProfile = asyncHandler(async (req: Request, res: Response) => {
  const donor = await Donor.findOne({ userId: req.user!.userId });
  if (!donor) throw ApiError.notFound("Donor profile not found");

  const { availableForEmergency, notificationPreferences } = req.body;

  if (availableForEmergency !== undefined) donor.availableForEmergency = availableForEmergency;
  if (notificationPreferences) donor.notificationPreferences = { ...donor.notificationPreferences, ...notificationPreferences };

  // Also update user address/location if provided
  if (req.body.address || req.body.location) {
    await User.findByIdAndUpdate(req.user!.userId, {
      ...(req.body.address && { address: req.body.address }),
      ...(req.body.location && { location: req.body.location }),
    });
  }

  await donor.save();
  return res.json({ success: true, data: donor, message: "Profile updated" });
});

export const checkEligibility = asyncHandler(async (req: Request, res: Response) => {
  const donor = await Donor.findOne({ userId: req.user!.userId });
  if (!donor) throw ApiError.notFound("Donor profile not found");

  const result = checkDonorEligibility(req.body, donor.lastDonationDate ? new Date(donor.lastDonationDate as any) : undefined);

  return res.json({ success: true, data: result });
});

export const getMyDonations = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20 } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const [donations, total] = await Promise.all([
    Donation.find({ donorId: req.user!.userId })
      .populate("hospitalId", "name address")
      .populate("requestId", "bloodType urgency")
      .sort({ scheduledAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Donation.countDocuments({ donorId: req.user!.userId }),
  ]);

  return res.json({
    success: true,
    data: { items: donations, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  });
});

export const getMyAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await Alert.find({ donorId: req.user!.userId })
    .populate("requestId", "bloodType urgency status hospitalId")
    .sort({ createdAt: -1 })
    .limit(50);

  return res.json({ success: true, data: alerts });
});

// ─── Admin-only ───────────────────────────────────────────────────────────────

export const listDonors = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, bloodType, status, region } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = {};
  if (bloodType) filter.bloodType = bloodType;
  if (status) filter.status = status;

  if (region) {
    // Join with User to filter by region
    const userIds = await User.find({ "address.region": region }).distinct("_id");
    filter.userId = { $in: userIds };
  }

  const [donors, total] = await Promise.all([
    Donor.find(filter)
      .populate("userId", "firstName lastName phone email address")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Donor.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: { items: donors, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  });
});

export const deferDonor = asyncHandler(async (req: Request, res: Response) => {
  const { donorId } = req.params;
  const { reason, deferralDays } = req.body;

  const donor = await Donor.findById(donorId);
  if (!donor) throw ApiError.notFound("Donor not found");

  donor.status = DonorStatus.DEFERRED;
  donor.medicalDeferralReason = reason;
  if (deferralDays) {
    const until = new Date();
    until.setDate(until.getDate() + Number(deferralDays));
    donor.deferralUntil = until as any;
  }
  await donor.save();

  return res.json({ success: true, data: donor, message: "Donor deferred" });
});