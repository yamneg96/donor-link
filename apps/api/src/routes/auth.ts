import { Router } from "express";
import * as auth from "../controllers/authController";
import { validate } from "../middleware/validate";
import { authenticate } from "../middleware/authenticate";
import { authLimiter } from "../middleware/rateLimiter";
import {
  registerDonorSchema,
  loginSchema,
  loginWithEmailSchema,
  registerWithEmailSchema,
  refreshTokenSchema,
  onboardDonorSchema,
} from "@donorlink/validators";

const router = Router();

// ─── Legacy Auth (Phone + Password) ──────────────────────────────────────────
router.post("/register/donor", authLimiter, validate(registerDonorSchema), auth.registerDonor);
router.post("/login", authLimiter, validate(loginSchema), auth.login);

// ─── Hybrid Auth (Email + Password Fallback) ─────────────────────────────────
router.post("/login/email", authLimiter, validate(loginWithEmailSchema), auth.loginWithEmail);
router.post("/register/email", authLimiter, validate(registerWithEmailSchema), auth.registerWithEmail);

// ─── Fayda eSignet (OIDC) ────────────────────────────────────────────────────
router.get("/fayda/authorize", auth.faydaAuthorize);
router.get("/fayda/callback", auth.faydaCallback);

// ─── Post-Login Onboarding ───────────────────────────────────────────────────
router.post("/onboard", authenticate, validate(onboardDonorSchema), auth.onboardDonor);

// ─── Token Management ────────────────────────────────────────────────────────
router.post("/refresh", validate(refreshTokenSchema), auth.refreshTokens);
router.post("/logout", auth.logout);
router.get("/me", authenticate, auth.getMe);

export default router;