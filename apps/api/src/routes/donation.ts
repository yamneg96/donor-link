import { Router } from "express";
import * as donation from "../controllers/donationController";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { UserRole } from "@donorlink/types";
import {
  scheduleDonationSchema,
  completeDonationSchema,
  paginationSchema,
} from "@donorlink/validators";

const router = Router();

router.use(authenticate);

router.post(
  "/schedule",
  authorize(UserRole.DONOR),
  validate(scheduleDonationSchema),
  donation.scheduleDonation
);

router.post(
  "/complete",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  validate(completeDonationSchema),
  donation.completeDonation
);

router.patch("/:id/cancel", authorize(UserRole.DONOR), donation.cancelDonation);

router.get(
  "/hospital",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  validate(paginationSchema, "query"),
  donation.getHospitalDonations
);

export default router;