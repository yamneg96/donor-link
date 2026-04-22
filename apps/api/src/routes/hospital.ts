import { Router } from "express";
import * as hospital from "../controllers/hospitalController";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { UserRole } from "@donorlink/types";
import {
  createHospitalSchema,
  updateBloodInventorySchema,
  paginationSchema,
} from "@donorlink/validators";

const router = Router();

// Public
router.get("/", validate(paginationSchema, "query"), hospital.listHospitals);
router.get("/nearby", hospital.nearbyHospitals);
router.get("/:id", hospital.getHospital);

// Authenticated
router.post("/", authenticate, validate(createHospitalSchema), hospital.createHospital);
router.get("/my/hospital", authenticate, hospital.getMyHospital);
router.patch(
  "/my/hospital",
  authenticate,
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.SUPER_ADMIN),
  hospital.updateHospital
);
router.put(
  "/my/hospital/inventory",
  authenticate,
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  validate(updateBloodInventorySchema),
  hospital.updateBloodInventory
);

// Super admin / MoH
router.patch(
  "/:id/verify",
  authenticate,
  authorize(UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  hospital.verifyHospital
);

export default router;