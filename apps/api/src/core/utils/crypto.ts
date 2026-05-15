import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { env } from '../../config';

const SALT_ROUNDS = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAccessToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRY as string,
  });
}

export function generateRefreshToken(payload: Record<string, unknown>): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRY as string,
  });
}

export function verifyAccessToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as Record<string, unknown>;
}

export function verifyRefreshToken(token: string): Record<string, unknown> {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as Record<string, unknown>;
}

export function generateOTP(length: number = 6): string {
  const digits = '0123456789';
  let otp = '';
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
}

export function generateBarcode(): string {
  return `BU-${Date.now()}-${uuidv4().slice(0, 8).toUpperCase()}`;
}

export function generateQRCode(): string {
  return `QR-${uuidv4()}`;
}

export function generateOrgCode(type: string, region: string): string {
  const prefix = type.slice(0, 3).toUpperCase();
  const regionCode = region.slice(0, 3).toUpperCase();
  const suffix = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${regionCode}-${suffix}`;
}
