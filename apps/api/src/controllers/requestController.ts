import { Request, Response } from "express";
import { BloodRequest } from "../models/BloodRequest";
import { Hospital } from "../models/Hospital";
import { Alert } from "../models/Alert";
import { alertService } from "../services/alertService";
import { ApiError, asyncHandler } from "../utils/errors";
import { RequestStatus, RequestUrgency, UserRole } from "@donorlink/types";
import { CreateBloodRequestInput } from "@donorlink/validators";
import { logger } from "../utils/logger";

export const createRequest = asyncHandler(async (req: Request, res: Response) => {
  const body: CreateBloodRequestInput = req.body;
  const userId = req.user!.userId;

  // Find hospital for this admin
  const hospital = await Hospital.findOne({ adminUserId: userId, isActive: true });
  if (!hospital) throw ApiError.forbidden("No active hospital found for your account");

  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + body.expiresInHours);

  const bloodRequest = await BloodRequest.create({
    hospitalId: hospital._id,
    requestedBy: userId,
    patientName: body.patientName,
    bloodType: body.bloodType,
    unitsNeeded: body.unitsNeeded,
    urgency: body.urgency,
    status: RequestStatus.PENDING,
    location: hospital.location,
    radiusKm: body.radiusKm,
    notes: body.notes,
    expiresAt,
  });

  logger.info("Blood request created", {
    requestId: bloodRequest._id,
    hospitalId: hospital._id,
    bloodType: body.bloodType,
    urgency: body.urgency,
  });

  // Trigger alert dispatch asynchronously (don't block response)
  alertService.dispatchForRequest(bloodRequest._id.toString()).catch((err) => {
    logger.error("Alert dispatch failed", { requestId: bloodRequest._id, error: err.message });
  });

  return res.status(201).json({
    success: true,
    data: bloodRequest,
    message: "Blood request created and donors are being alerted",
  });
});

export const listRequests = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, status, urgency, bloodType } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);
  const user = req.user!;

  const filter: any = {};
  if (status) filter.status = status;
  if (urgency) filter.urgency = urgency;
  if (bloodType) filter.bloodType = bloodType;

  // Hospital admins only see their own requests
  if (user.role === UserRole.HOSPITAL_ADMIN) {
    const hospital = await Hospital.findOne({ adminUserId: user.userId });
    if (hospital) filter.hospitalId = hospital._id;
  }

  const [requests, total] = await Promise.all([
    BloodRequest.find(filter)
      .populate("hospitalId", "name address location emergencyPhone")
      .sort({ urgency: 1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    BloodRequest.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: { items: requests, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  });
});

export const getRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await BloodRequest.findById(req.params.id).populate(
    "hospitalId",
    "name address location emergencyPhone"
  );
  if (!request) throw ApiError.notFound("Blood request not found");
  return res.json({ success: true, data: request });
});

export const cancelRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound("Blood request not found");

  // Only the creating hospital or admins can cancel
  if (req.user!.role === UserRole.HOSPITAL_ADMIN) {
    const hospital = await Hospital.findOne({ adminUserId: req.user!.userId });
    if (!hospital || !hospital._id.equals(request.hospitalId as any)) {
      throw ApiError.forbidden("You can only cancel your own hospital's requests");
    }
  }

  if (request.status === RequestStatus.FULFILLED) {
    throw ApiError.badRequest("Cannot cancel a fulfilled request");
  }

  request.status = RequestStatus.CANCELLED;
  await request.save();

  return res.json({ success: true, data: request, message: "Request cancelled" });
});

export const fulfillRequest = asyncHandler(async (req: Request, res: Response) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound("Blood request not found");

  request.status = RequestStatus.FULFILLED;
  request.fulfilledAt = new Date() as any;
  await request.save();

  return res.json({ success: true, data: request, message: "Request marked as fulfilled" });
});

export const respondToRequest = asyncHandler(async (req: Request, res: Response) => {
  const { requestId } = req.params;
  const { response } = req.body;
  const donorId = req.user!.userId;

  const bloodRequest = await BloodRequest.findById(requestId);
  if (!bloodRequest) throw ApiError.notFound("Blood request not found");

  if (bloodRequest.status !== RequestStatus.PENDING && bloodRequest.status !== RequestStatus.MATCHING) {
    throw ApiError.badRequest("This request is no longer accepting responses");
  }

  await alertService.recordDonorResponse({ requestId, donorId, response });

  return res.json({
    success: true,
    message: response === "accepted" ? "Thank you! The hospital has been notified." : "Response recorded.",
  });
});

export const retriggerAlerts = asyncHandler(async (req: Request, res: Response) => {
  const request = await BloodRequest.findById(req.params.id);
  if (!request) throw ApiError.notFound("Blood request not found");
  if (request.status === RequestStatus.FULFILLED || request.status === RequestStatus.CANCELLED) {
    throw ApiError.badRequest("Cannot alert for a closed request");
  }

  const result = await alertService.dispatchForRequest(req.params.id);
  return res.json({ success: true, data: result });
});

export const getRequestAlerts = asyncHandler(async (req: Request, res: Response) => {
  const alerts = await Alert.find({ requestId: req.params.id })
    .populate("donorId", "firstName lastName phone")
    .sort({ createdAt: -1 });

  return res.json({ success: true, data: alerts });
});