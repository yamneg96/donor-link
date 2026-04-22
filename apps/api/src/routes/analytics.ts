import { Router } from "express";
import * as analytics from "../controllers/analyticsController";
import { authenticate, authorize } from "../middleware/authenticate";
import { UserRole } from "@donorlink/types";

const router = Router();

const adminOnly = authorize(
  UserRole.BLOOD_BANK_ADMIN,
  UserRole.MOH_ADMIN,
  UserRole.HOSPITAL_ADMIN,
  UserRole.SUPER_ADMIN
);

router.use(authenticate, adminOnly);

router.get("/dashboard", analytics.getDashboardStats);
router.get("/inventory", analytics.getBloodInventoryOverview);
router.get("/requests-trend", analytics.getRequestsTrend);
router.get("/donors-by-region", analytics.getDonorsByRegion);

export default router;