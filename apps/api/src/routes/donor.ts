import { Router } from "express";
import * as donor from "../controllers/donorController";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { UserRole } from "@donorlink/types";
import {
  updateDonorProfileSchema,
  donorEligibilityCheckSchema,
  paginationSchema,
} from "@donorlink/validators";

const router = Router();

// All donor routes require auth
router.use(authenticate);

// Self routes
router.get("/me", donor.getMyProfile);
router.patch("/me", validate(updateDonorProfileSchema), donor.updateMyProfile);
router.post("/me/eligibility", validate(donorEligibilityCheckSchema), donor.checkEligibility);
router.get("/me/donations", validate(paginationSchema, "query"), donor.getMyDonations);
router.get("/me/alerts", donor.getMyAlerts);

// Admin routes
router.get(
  "/",
  authorize(UserRole.BLOOD_BANK_ADMIN, UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  validate(paginationSchema, "query"),
  donor.listDonors
);
router.patch(
  "/:donorId/defer",
  authorize(UserRole.BLOOD_BANK_ADMIN, UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  donor.deferDonor
);

export default router;