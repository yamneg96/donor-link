import { z } from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().default(5000),
  API_VERSION: z.string().default("v1"),

  MONGODB_URI: z.string().min(1),

  JWT_ACCESS_SECRET: z.string().min(32),
  JWT_REFRESH_SECRET: z.string().min(32),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  REDIS_URL: z.string().default("redis://localhost:6379"),

  // ─── Fayda eSignet (OIDC) ───────────────────────────────────────────────────
  // Set FAYDA_MOCK=true for development without real eSignet sandbox
  FAYDA_MOCK: z.coerce.boolean().default(true),
  FAYDA_ISSUER: z.string().default("https://esignet.collab.mosip.net"),
  FAYDA_CLIENT_ID: z.string().default("donorlink-dev"),
  FAYDA_REDIRECT_URI: z.string().default("http://localhost:5173/auth/fayda/callback"),
  FAYDA_PRIVATE_KEY_JWK: z.string().optional(), // Base64-encoded RSA JWK — optional when mock=true
  FAYDA_ALGORITHM: z.string().default("RS256"),
  FAYDA_DONOR_ACR: z.string().default("mosip:idp:acr:biometrics"),
  FAYDA_RECIPIENT_ACR: z.string().default("mosip:idp:acr:generated-code"),

  // ─── External Services ──────────────────────────────────────────────────────
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_PHONE_NUMBER: z.string().optional(),

  AT_API_KEY: z.string().optional(),
  AT_USERNAME: z.string().optional(),

  FIREBASE_PROJECT_ID: z.string().optional(),
  FIREBASE_CLIENT_EMAIL: z.string().optional(),
  FIREBASE_PRIVATE_KEY: z.string().optional(),

  RESEND_API_KEY: z.string().optional(),
  RESEND_FROM_EMAIL: z.string().email().default("noreply@donorlink.et"),

  BLOB_READ_WRITE_TOKEN: z.string().optional(),

  MAPBOX_ACCESS_TOKEN: z.string().optional(),

  WEB_APP_URL: z.string().url().default("http://localhost:5173"),
  MOBILE_APP_URL: z.string().default("exp://localhost:8081"),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),

  SUPER_ADMIN_PHONE: z.string().optional(),
  SUPER_ADMIN_PASSWORD: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("❌  Invalid environment variables:");
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = parsed.data;
export type Config = typeof config;