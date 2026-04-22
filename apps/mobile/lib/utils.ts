import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function timeAgo(date: string | Date) {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function formatDate(date: string | Date) {
  return new Intl.DateTimeFormat("en-ET", { dateStyle: "medium" }).format(new Date(date));
}

export function getApiError(error: unknown): string {
  if (error && typeof error === "object" && "response" in error) {
    const res = (error as any).response?.data;
    if (res?.message) return res.message;
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}