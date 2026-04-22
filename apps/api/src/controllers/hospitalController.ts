import { Request, Response } from "express";
import { Hospital } from "../models/Hospital";
import { User } from "../models/User";
import { ApiError, asyncHandler } from "../utils/errors";
import { UserRole, BloodType } from "@donorlink/types";
import { CreateHospitalInput } from "@donorlink/validators";

export const createHospital = asyncHandler(async (req: Request, res: Response) => {
  const body: CreateHospitalInput = req.body;

  const existing = await Hospital.findOne({ licenseNumber: body.licenseNumber.toUpperCase() });
  if (existing) throw ApiError.conflict("A hospital with this license number already exists");

  const hospital = await Hospital.create({
    ...body,
    licenseNumber: body.licenseNumber.toUpperCase(),
    adminUserId: req.user!.userId,
    isVerified: false,
  });

  // Update user role
  await User.findByIdAndUpdate(req.user!.userId, { role: UserRole.HOSPITAL_ADMIN });

  return res.status(201).json({ success: true, data: hospital, message: "Hospital registered. Pending verification." });
});

export const getMyHospital = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findOne({ adminUserId: req.user!.userId });
  if (!hospital) throw ApiError.notFound("No hospital found for your account");
  return res.json({ success: true, data: hospital });
});

export const updateHospital = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findOne({ adminUserId: req.user!.userId });
  if (!hospital) throw ApiError.notFound("No hospital found for your account");

  const allowed = ["phone", "emergencyPhone", "email", "address", "location"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) (hospital as any)[key] = req.body[key];
  }
  await hospital.save();

  return res.json({ success: true, data: hospital });
});

export const updateBloodInventory = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findOne({ adminUserId: req.user!.userId });
  if (!hospital) throw ApiError.notFound("No hospital found for your account");

  const { inventory } = req.body;
  hospital.bloodInventory = inventory;
  await hospital.save();

  // Check if any blood type is critically low and log a warning
  const critical = hospital.bloodInventory.filter(
    (item) => item.units <= item.criticalThreshold
  );
  if (critical.length) {
    const types = critical.map((c) => `${c.bloodType} (${c.units} units)`).join(", ");
    // In production, this would trigger an internal alert to MoH
    console.warn(`[CRITICAL INVENTORY] ${hospital.name}: ${types}`);
  }

  return res.json({ success: true, data: hospital.bloodInventory, message: "Inventory updated" });
});

export const listHospitals = asyncHandler(async (req: Request, res: Response) => {
  const { page = 1, limit = 20, region, verified } = req.query as any;
  const skip = (Number(page) - 1) * Number(limit);

  const filter: any = { isActive: true };
  if (region) filter["address.region"] = region;
  if (verified !== undefined) filter.isVerified = verified === "true";

  const [hospitals, total] = await Promise.all([
    Hospital.find(filter)
      .select("-adminUserId")
      .sort({ name: 1 })
      .skip(skip)
      .limit(Number(limit)),
    Hospital.countDocuments(filter),
  ]);

  return res.json({
    success: true,
    data: { items: hospitals, total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
  });
});

export const getHospital = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findById(req.params.id).select("-adminUserId");
  if (!hospital) throw ApiError.notFound("Hospital not found");
  return res.json({ success: true, data: hospital });
});

export const verifyHospital = asyncHandler(async (req: Request, res: Response) => {
  const hospital = await Hospital.findByIdAndUpdate(
    req.params.id,
    { isVerified: true },
    { new: true }
  );
  if (!hospital) throw ApiError.notFound("Hospital not found");
  return res.json({ success: true, data: hospital, message: "Hospital verified" });
});

export const nearbyHospitals = asyncHandler(async (req: Request, res: Response) => {
  const { lng, lat, radiusKm = 100 } = req.query as any;
  if (!lng || !lat) throw ApiError.badRequest("lng and lat are required");

  const hospitals = await Hospital.find({
    isActive: true,
    isVerified: true,
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [Number(lng), Number(lat)] },
        $maxDistance: Number(radiusKm) * 1000,
      },
    },
  }).limit(20);

  return res.json({ success: true, data: hospitals });
});