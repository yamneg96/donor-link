import { Router } from "express";
import * as req from "../controllers/requestController";
import { authenticate, authorize } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { alertLimiter } from "../middleware/rateLimiter";
import { UserRole } from "@donorlink/types";
import {
  createBloodRequestSchema,
  respondToRequestSchema,
  paginationSchema,
} from "@donorlink/validators";
import { z } from "zod";

const router = Router();

router.use(authenticate);

// Hospital admins create requests
router.post(
  "/",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  validate(createBloodRequestSchema),
  req.createRequest
);

router.get("/", validate(paginationSchema, "query"), req.listRequests);
router.get("/:id", req.getRequest);

// Donor responds to a request
router.post(
  "/:requestId/respond",
  authorize(UserRole.DONOR),
  validate(z.object({ response: z.enum(["accepted", "declined"]) })),
  req.respondToRequest
);

router.patch(
  "/:id/cancel",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  req.cancelRequest
);

router.patch(
  "/:id/fulfill",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  req.fulfillRequest
);

// Re-trigger alerts (e.g. expanded radius)
router.post(
  "/:id/retrigger",
  alertLimiter,
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.SUPER_ADMIN),
  req.retriggerAlerts
);

router.get(
  "/:id/alerts",
  authorize(UserRole.HOSPITAL_ADMIN, UserRole.BLOOD_BANK_ADMIN, UserRole.MOH_ADMIN, UserRole.SUPER_ADMIN),
  req.getRequestAlerts
);

export default router;