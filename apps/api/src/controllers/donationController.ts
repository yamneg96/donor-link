import { Request, Response } from "express";
import { Donation } from "../models/Donation";
import { Donor } from "../models/Donor";
import { Hospital } from "../models/Hospital";
import { BloodRequest } from "../models/BloodRequest";
import { ApiError, asyncHandler } from "../utils/errors";
import { DonationStatus, RequestStatus } from "@donorlink/types";
import { computeNextEligibleDate } from "../utils/eligibility";

export const scheduleDonation = asyncHandler(async (req: Request, res: Response) => {
  const { hospitalId, requestId, scheduledAt } = req.body;
  const donorUserId = req.user!.userId;

  const [donor, hospital] = await Promise.all([
    Donor.findOne({ userId: donorUserId }),
    Hospital.findById(hospitalId),
  ]);

  if (!donor) throw ApiError.notFound("Donor profile not found");
  if (!hospital) throw ApiError.notFound("Hospital not found");

  // Check not already scheduled at this hospital on this date
  const sameDay = new Date(scheduledAt);
  sameDay.setHours(0, 0, 0, 0);
  const nextDay = new Date(sameDay);
  nextDay.setDate(nextDay.getDate() + 1);

  const clash = await Donation.findOne({
    donorId: donorUserId,
    hospitalId,
    scheduledAt: { $gte: sameDay, $lt: nextDay },
    status: DonationStatus.SCHEDULED,
  });
  if (clash) throw ApiError.conflict("You already have a scheduled donation at this hospital on that date");

  const donation = await Donation.create({
    donorId: donorUserId,
    hospitalId,
    requestId: requestId ?? undefined,
    scheduledAt: new Date(scheduledAt),
    status: DonationStatus.SCHEDULED,
    bloodType: donor.bloodType,
  });

  return res.status(201).json({ success: true, data: donation });
});

export const completeDonation = asyncHandler(async (req: Request, res: Response) => {
  const { donationId, unitsDonated, hemoglobinLevel, notes } = req.body;

  const donation = await Donation.findById(donationId).populate("hospitalId");
  if (!donation) throw ApiError.notFound("Donation not found");

  // Only hospital admin of this hospital can complete
  const hospital = await Hospital.findOne({ adminUserId: req.user!.userId, _id: donation.hospitalId });
  if (!hospital) throw ApiError.forbidden("You can only complete donations at your hospital");

  donation.status = DonationStatus.COMPLETED;
  donation.donatedAt = new Date() as any;
  donation.unitsDonated = unitsDonated;
  if (hemoglobinLevel) donation.hemoglobinLevel = hemoglobinLevel;
  if (notes) donation.notes = notes;
  await donation.save();

  // Update donor profile
  const donor = await Donor.findOne({ userId: donation.donorId });
  if (donor) {
    donor.totalDonations += 1;
    donor.lastDonationDate = new Date() as any;
    donor.nextEligibleDate = computeNextEligibleDate(new Date()) as any;
    if (hemoglobinLevel) donor.hemoglobinLevel = hemoglobinLevel;
    await donor.save();
  }

  // If linked to a request, check if fulfilled
  if (donation.requestId) {
    const request = await BloodRequest.findById(donation.requestId);
    if (request && request.unitsMatched >= request.unitsNeeded) {
      request.status = RequestStatus.FULFILLED;
      request.fulfilledAt = new Date() as any;
      await request.save();
    }
  }

  return res.json({ success: true, data: donation, message: "Donation recorded. Thank you!" });
});

export const cancelDonation = asyncHandler(async (req: Request, res: Response) => {
  const donation = await Donation.findById(req.params.id);
  if (!donation) throw ApiError.notFound("Donation not found");

  if (donation.donorId.toString() !== req.user!.userId) {
    throw ApiError.forbidden("You can only cancel your own donations");
  }
  if (donation.status !== DonationStatus.SCHEDULED) {
    throw ApiError.badRequest("Only scheduled donations can be cancelled");
  }

  donation.status = DonationStatus.CANCELLED;
  await donation.save();

  return res.json({ success: true, message: "Donation cancelled" });
});

export const getHospitalDonations = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findOne({ adminUserId: req.user!.userId });
  if (!hospital) throw ApiError.notFound("No hospital found for your account");

  const { page = 1, limit = 20, status } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = { hospitalId: hospital._id };
  if (status) filter.status = status;

  const [donations, total] = await Promise.all([
    Donation.find(filter)
      .populate("donorId", "firstName lastName phone")
      .sort({ scheduledAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Donation.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: { items: donations, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  });
});