import { Request, Response } from "express";
import { User } from "../models/User";
import { Donor } from "../models/Donor";
import { Hospital } from "../models/Hospital";
import { BloodRequest } from "../models/BloodRequest";
import { Donation } from "../models/Donation";
import { asyncHandler } from "../utils/errors";
import { BloodType, DonationStatus, DonorStatus, RequestStatus } from "@donorlink/types";

export const getDashboardStats = asyncHandler(async (req: Request, res: Response) => {
  const [
    totalDonors,
    activeDonors,
    totalRequests,
    fulfilledRequests,
    criticalRequests,
    totalDonations,
    donationsByType,
  ] = await Promise.all([
    Donor.countDocuments(),
    Donor.countDocuments({ status: DonorStatus.ACTIVE, availableForEmergency: true }),
    BloodRequest.countDocuments(),
    BloodRequest.countDocuments({ status: RequestStatus.FULFILLED }),
    BloodRequest.countDocuments({ status: { $in: [RequestStatus.PENDING, RequestStatus.MATCHING] }, urgency: "critical" }),
    Donation.countDocuments({ status: DonationStatus.COMPLETED }),
    Donation.aggregate([
      { $match: { status: DonationStatus.COMPLETED } },
      { $group: { _id: "$bloodType", count: { $sum: 1 } } },
    ]),
  ]);

  const donationsByBloodType = Object.values(BloodType).reduce((acc, bt) => {
    const found = donationsByType.find((d: any) => d._id === bt);
    acc[bt] = found ? found.count : 0;
    return acc;
  }, {} as Record<BloodType, number>);

  return res.json({
    success: true,
    data: {
      totalDonors,
      activeDonors,
      totalRequests,
      fulfilledRequests,
      criticalRequests,
      totalDonations,
      fulfillmentRate: totalRequests > 0 ? Math.round((fulfilledRequests / totalRequests) * 100) : 0,
      donationsByBloodType,
    },
  });
});

export const getBloodInventoryOverview = asyncHandler(async (req: Request, res: Response) => {
  const hospitals = await Hospital.find({ isActive: true, isVerified: true }).select(
    "name address bloodInventory"
  );

  const overview = Object.values(BloodType).reduce((acc, bt) => {
    acc[bt] = { totalUnits: 0, criticalHospitals: [] as string[] };
    return acc;
  }, {} as Record<BloodType, { totalUnits: number; criticalHospitals: string[] }>);

  for (const h of hospitals) {
    for (const item of h.bloodInventory) {
      const bt = item.bloodType as BloodType;
      overview[bt].totalUnits += item.units;
      if (item.units <= item.criticalThreshold) {
        overview[bt].criticalHospitals.push(h.name);
      }
    }
  }

  return res.json({ success: true, data: overview });
});

export const getRequestsTrend = asyncHandler(async (req: Request, res: Response) => {
  const { days = 30 } = req.query as any;
  const from = new Date();
  from.setDate(from.getDate() - Number(days));

  const trend = await BloodRequest.aggregate([
    { $match: { createdAt: { $gte: from } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: 1 },
        fulfilled: { $sum: { $cond: [{ $eq: ["$status", RequestStatus.FULFILLED] }, 1, 0] } },
        critical: { $sum: { $cond: [{ $eq: ["$urgency", "critical"] }, 1, 0] } },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  return res.json({ success: true, data: trend });
});

export const getDonorsByRegion = asyncHandler(async (_req: Request, res: Response) => {
  const result = await User.aggregate([
    { $match: { isActive: true } },
    {
      $lookup: {
        from: "donors",
        localField: "_id",
        foreignField: "userId",
        as: "donor",
      },
    },
    { $unwind: "$donor" },
    {
      $group: {
        _id: "$address.region",
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ["$donor.status", DonorStatus.ACTIVE] }, 1, 0] } },
      },
    },
    { $sort: { total: -1 } },
  ]);

  return res.json({ success: true, data: result });
});