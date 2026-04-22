import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import { User } from "../models/User";
import { Donor } from "../models/Donor";
import { RefreshToken } from "../models/RefreshToken";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { ApiError, asyncHandler } from "../utils/errors";
import { UserRole, AuthMethod } from "@donorlink/types";
import { RegisterDonorInput, LoginInput, LoginWithEmailInput, RegisterWithEmailInput } from "@donorlink/validators";
import { computeNextEligibleDate } from "../utils/eligibility";
import { logger } from "../utils/logger";
import { config } from "../config/env";
import {
  buildAuthorizationUrl,
  validateState,
  exchangeCodeForTokens,
  validateIdToken,
  fetchUserInfo,
} from "../services/faydaOidc";

// ─── Helper: Issue token pair ─────────────────────────────────────────────────

async function issueTokenPair(user: any) {
  const family = uuidv4();
  const accessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    phone: user.phone ?? user.email,
  });
  const refreshToken = signRefreshToken({
    userId: user._id.toString(),
    tokenFamily: family,
  });

  await RefreshToken.create({
    userId: user._id,
    token: refreshToken,
    family,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return { accessToken, refreshToken, expiresIn: 900 };
}

// ─── Legacy: Register Donor (phone + password) ───────────────────────────────

export const registerDonor = asyncHandler(async (req: Request, res: Response) => {
  const body: RegisterDonorInput = req.body;

  // Check phone uniqueness
  const exists = await User.findOne({ phone: body.phone });
  if (exists) throw ApiError.conflict("An account with this phone number already exists");

  // Check ID document uniqueness
  const idExists = await User.findOne({
    "idDocument.number": body.idDocument.number.toUpperCase(),
    "idDocument.type": body.idDocument.type,
  });
  if (idExists) throw ApiError.conflict("This ID document is already registered");

  // Create user
  const user = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    amharicName: body.amharicName,
    phone: body.phone,
    email: body.email,
    passwordHash: body.password, // pre-save hook hashes it
    role: UserRole.DONOR,
    authMethod: AuthMethod.EMAIL_PASSWORD,
    idDocument: { ...body.idDocument, verified: false },
    address: body.address,
    isVerified: false,
    isActive: true,
    onboardingComplete: true, // legacy flow collects everything
  });

  // Create donor profile
  const lastDonation = undefined;
  const nextEligible = lastDonation ? computeNextEligibleDate(new Date(lastDonation)) : undefined;

  await Donor.create({
    userId: user._id,
    bloodType: body.bloodType,
    dateOfBirth: new Date(body.dateOfBirth),
    weight: body.weight,
    availableForEmergency: body.availableForEmergency,
    nextEligibleDate: nextEligible,
    notificationPreferences: {
      sms: true,
      push: true,
      email: !!body.email,
      emergencyOnly: false,
      maxAlertsPerDay: 3,
    },
  });

  logger.info("Donor registered (legacy)", { userId: user._id, phone: user.phone });

  const tokens = await issueTokenPair(user);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: {
      user: user.toJSON(),
      tokens,
      needsOnboarding: false,
    },
  });
});

// ─── Legacy: Login (phone + password) ─────────────────────────────────────────

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { phone, password }: LoginInput = req.body;

  const user = await User.findOne({ phone, isActive: true }).select("+passwordHash");
  if (!user) throw ApiError.unauthorized("Invalid phone number or password");

  const valid = await user.comparePassword(password);
  if (!valid) throw ApiError.unauthorized("Invalid phone number or password");

  user.lastLoginAt = new Date().toISOString() as any;
  await user.save();

  const tokens = await issueTokenPair(user);
  const donor = await Donor.findOne({ userId: user._id });
  const needsOnboarding = !user.onboardingComplete || (user.role === UserRole.DONOR && !donor);

  logger.info("User logged in (phone)", { userId: user._id, role: user.role });

  return res.json({
    success: true,
    data: { user: user.toJSON(), tokens, needsOnboarding },
  });
});

// ─── Hybrid: Login with Email + Password ──────────────────────────────────────

export const loginWithEmail = asyncHandler(async (req: Request, res: Response) => {
  const { email, password }: LoginWithEmailInput = req.body;

  const user = await User.findOne({ email, isActive: true }).select("+passwordHash");
  if (!user) throw ApiError.unauthorized("Invalid email or password");

  if (!user.passwordHash) {
    throw ApiError.unauthorized("This account uses Fayda authentication. Please sign in with Fayda.");
  }

  const valid = await user.comparePassword(password);
  if (!valid) throw ApiError.unauthorized("Invalid email or password");

  user.lastLoginAt = new Date().toISOString() as any;
  await user.save();

  const tokens = await issueTokenPair(user);
  const donor = await Donor.findOne({ userId: user._id });
  const needsOnboarding = !user.onboardingComplete || (user.role === UserRole.DONOR && !donor);

  logger.info("User logged in (email)", { userId: user._id, role: user.role });

  return res.json({
    success: true,
    data: { user: user.toJSON(), tokens, needsOnboarding },
  });
});

// ─── Hybrid: Register with Email + Password ──────────────────────────────────

export const registerWithEmail = asyncHandler(async (req: Request, res: Response) => {
  const body: RegisterWithEmailInput = req.body;

  const exists = await User.findOne({ email: body.email });
  if (exists) throw ApiError.conflict("An account with this email already exists");

  const user = await User.create({
    firstName: body.firstName,
    lastName: body.lastName,
    amharicName: body.amharicName,
    email: body.email,
    phone: body.phone,
    passwordHash: body.password,
    role: body.role,
    authMethod: AuthMethod.EMAIL_PASSWORD,
    isVerified: false,
    isActive: true,
    onboardingComplete: false,
  });

  logger.info("User registered (email)", { userId: user._id, email: user.email });

  const tokens = await issueTokenPair(user);

  return res.status(201).json({
    success: true,
    message: "Registration successful",
    data: { user: user.toJSON(), tokens, needsOnboarding: true },
  });
});

// ─── Fayda: Initiate Authorization ────────────────────────────────────────────

export const faydaAuthorize = asyncHandler(async (req: Request, res: Response) => {
  const role = (req.query.role as string) || "donor";

  const { url, state } = await buildAuthorizationUrl(role);

  logger.info("Fayda authorization initiated", { role, state });

  return res.json({
    success: true,
    data: { authorizationUrl: url },
  });
});

// ─── Fayda: Handle Callback ──────────────────────────────────────────────────

export const faydaCallback = asyncHandler(async (req: Request, res: Response) => {
  const { code, state } = req.query as { code: string; state: string };

  if (!code || !state) {
    throw ApiError.badRequest("Missing code or state parameter");
  }

  // 1. Validate state (CSRF protection)
  const stateData = validateState(state);
  if (!stateData) {
    throw ApiError.unauthorized("Invalid or expired state parameter. Please try again.");
  }

  // 2. Exchange code for tokens
  const tokenResponse = await exchangeCodeForTokens(code);

  // 3. Validate ID token
  const idTokenPayload = await validateIdToken(tokenResponse.id_token, stateData.nonce);

  // 4. Fetch user info
  const userInfo = await fetchUserInfo(tokenResponse.access_token);

  // 5. Parse name into first/last
  const nameParts = (userInfo.name || "Fayda User").split(" ");
  const firstName = nameParts[0] || "Fayda";
  const lastName = nameParts.slice(1).join(" ") || "User";

  // 6. Upsert user by faydaSub
  let user = await User.findOne({ faydaSub: userInfo.sub });
  let isNewUser = false;

  if (!user) {
    isNewUser = true;
    // Determine role from the auth request
    const role = stateData.role === "hospital_admin" ? UserRole.HOSPITAL_ADMIN
      : stateData.role === "recipient" ? UserRole.RECIPIENT
      : stateData.role === "moh_admin" ? UserRole.MOH_ADMIN
      : UserRole.DONOR;

    user = await User.create({
      firstName,
      lastName,
      phone: userInfo.phone_number,
      faydaSub: userInfo.sub,
      faydaProfile: userInfo,
      authMethod: AuthMethod.FAYDA_OIDC,
      role,
      isVerified: true,  // Fayda-verified identity
      isActive: true,
      onboardingComplete: false,
    });

    logger.info("New Fayda user created", { userId: user._id, sub: userInfo.sub });
  } else {
    // Update existing user's Fayda profile
    user.faydaProfile = userInfo as any;
    user.firstName = firstName;
    user.lastName = lastName;
    user.lastLoginAt = new Date().toISOString() as any;
    if (userInfo.phone_number) user.phone = userInfo.phone_number;
    await user.save();

    logger.info("Existing Fayda user logged in", { userId: user._id, sub: userInfo.sub });
  }

  // 7. Issue donorLink JWT pair
  const tokens = await issueTokenPair(user);

  // 8. Check if onboarding needed
  const donor = await Donor.findOne({ userId: user._id });
  const needsOnboarding = !user.onboardingComplete || (user.role === UserRole.DONOR && !donor);

  return res.json({
    success: true,
    data: { user: user.toJSON(), tokens, needsOnboarding },
  });
});

// ─── Onboard Donor (post-Fayda) ──────────────────────────────────────────────

export const onboardDonor = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const { bloodType, dateOfBirth, weight, address, phone, availableForEmergency } = req.body;

  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  // Update user address/phone
  if (address) user.address = address;
  if (phone) user.phone = phone;
  user.onboardingComplete = true;
  await user.save();

  // Create donor profile
  const existingDonor = await Donor.findOne({ userId });
  if (existingDonor) {
    throw ApiError.conflict("Donor profile already exists");
  }

  const donor = await Donor.create({
    userId,
    bloodType,
    dateOfBirth: new Date(dateOfBirth),
    weight,
    availableForEmergency: availableForEmergency ?? true,
    notificationPreferences: {
      sms: true,
      push: true,
      email: !!user.email,
      emergencyOnly: false,
      maxAlertsPerDay: 3,
    },
  });

  logger.info("Donor onboarded", { userId, bloodType });

  return res.json({
    success: true,
    message: "Onboarding complete",
    data: { user: user.toJSON(), donor },
  });
});

// ─── Refresh Tokens ───────────────────────────────────────────────────────────

export const refreshTokens = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) throw ApiError.badRequest("Refresh token required");

  let payload;
  try {
    payload = verifyRefreshToken(refreshToken);
  } catch {
    throw ApiError.unauthorized("Invalid or expired refresh token");
  }

  const stored = await RefreshToken.findOne({ token: refreshToken });
  if (!stored) throw ApiError.unauthorized("Refresh token not found");

  // Detect reuse attack
  if (stored.used) {
    logger.warn("Refresh token reuse detected — invalidating family", {
      userId: payload.userId,
      family: payload.tokenFamily,
    });
    await RefreshToken.deleteMany({ family: payload.tokenFamily });
    throw ApiError.unauthorized("Refresh token reuse detected. Please log in again.");
  }

  stored.used = true;
  await stored.save();

  const user = await User.findById(payload.userId);
  if (!user || !user.isActive) throw ApiError.unauthorized("Account not found");

  const newAccessToken = signAccessToken({
    userId: user._id.toString(),
    role: user.role,
    phone: user.phone ?? user.email,
  });
  const newRefreshToken = signRefreshToken({
    userId: user._id.toString(),
    tokenFamily: payload.tokenFamily,
  });

  await RefreshToken.create({
    userId: user._id,
    token: newRefreshToken,
    family: payload.tokenFamily,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  return res.json({
    success: true,
    data: { accessToken: newAccessToken, refreshToken: newRefreshToken, expiresIn: 900 },
  });
});

// ─── Logout ───────────────────────────────────────────────────────────────────

export const logout = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await RefreshToken.findOneAndDelete({ token: refreshToken });
  }
  return res.json({ success: true, message: "Logged out successfully" });
});

// ─── Get Current User ─────────────────────────────────────────────────────────

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await User.findById(req.user!.userId);
  if (!user) throw ApiError.notFound("User not found");

  const donor = await Donor.findOne({ userId: user._id });

  return res.json({ success: true, data: { user, donor } });
});