import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BloodType, RequestUrgency } from "../types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-ET", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatDateShort(date: string | Date) {
  return new Intl.DateTimeFormat("en-ET", { dateStyle: "medium" }).format(new Date(date));
}

export function timeAgo(date: string | Date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export const BLOOD_TYPE_COLORS: Record<BloodType, string> = {
  [BloodType.A_POSITIVE]:  "bg-red-100 text-red-700",
  [BloodType.A_NEGATIVE]:  "bg-red-50 text-red-600",
  [BloodType.B_POSITIVE]:  "bg-orange-100 text-orange-700",
  [BloodType.B_NEGATIVE]:  "bg-orange-50 text-orange-600",
  [BloodType.AB_POSITIVE]: "bg-purple-100 text-purple-700",
  [BloodType.AB_NEGATIVE]: "bg-purple-50 text-purple-600",
  [BloodType.O_POSITIVE]:  "bg-rose-100 text-rose-700",
  [BloodType.O_NEGATIVE]:  "bg-rose-50 text-rose-600",
};

export const URGENCY_BADGE: Record<RequestUrgency, string> = {
  [RequestUrgency.EMERGENCY]: "bg-m3-error-container text-m3-on-error-container",
  [RequestUrgency.URGENT]:    "bg-amber-100 text-amber-700",
  [RequestUrgency.ROUTINE]:   "bg-m3-surface-variant text-m3-on-surface-variant",
};

export function getApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as any).response?.data;
    if (res?.message) return res.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}