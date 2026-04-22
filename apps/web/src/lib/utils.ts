import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { BloodType, RequestUrgency } from "@donorlink/types";

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
  [BloodType.A_POS]:  "bg-red-100 text-red-700",
  [BloodType.A_NEG]:  "bg-red-50 text-red-600",
  [BloodType.B_POS]:  "bg-orange-100 text-orange-700",
  [BloodType.B_NEG]:  "bg-orange-50 text-orange-600",
  [BloodType.AB_POS]: "bg-purple-100 text-purple-700",
  [BloodType.AB_NEG]: "bg-purple-50 text-purple-600",
  [BloodType.O_POS]:  "bg-brand-100 text-brand-700",
  [BloodType.O_NEG]:  "bg-brand-50 text-brand-600",
};

export const URGENCY_BADGE: Record<RequestUrgency, string> = {
  [RequestUrgency.CRITICAL]: "badge-critical",
  [RequestUrgency.URGENT]:   "badge-urgent",
  [RequestUrgency.STANDARD]: "badge-standard",
};

export function getApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as any).response?.data;
    if (res?.message) return res.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}