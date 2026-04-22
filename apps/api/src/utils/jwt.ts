import jwt from "jsonwebtoken";
import { config } from "../config/env";
import { UserRole } from "@donorlink/types";

export interface JwtPayload {
  userId: string;
  role: UserRole;
  phone: string;
}

export interface RefreshPayload {
  userId: string;
  tokenFamily: string; // for refresh token rotation
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
    issuer: "donorlink",
    audience: "donorlink-client",
  });
}

export function signRefreshToken(payload: RefreshPayload): string {
  return jwt.sign(payload, config.JWT_REFRESH_SECRET, {
    expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    issuer: "donorlink",
    audience: "donorlink-client",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, config.JWT_ACCESS_SECRET, {
    issuer: "donorlink",
    audience: "donorlink-client",
  }) as JwtPayload;
}

export function verifyRefreshToken(token: string): RefreshPayload {
  return jwt.verify(token, config.JWT_REFRESH_SECRET, {
    issuer: "donorlink",
    audience: "donorlink-client",
  }) as RefreshPayload;
}

export function decodeToken(token: string) {
  return jwt.decode(token);
}