/* ================================================================== */
/* MAP UTILITIES                                                       */
/* ================================================================== */

import type { MapMarkerData, MarkerSeverity, SeverityStyleSet } from "./map.types";
import { DEFAULT_CENTER } from "./map.constants";

/**
 * Return Tailwind class sets for a given marker severity.
 */
export function getSeverityStyles(severity?: MarkerSeverity): SeverityStyleSet {
  switch (severity) {
    case "critical":
      return { bg: "bg-red-600", text: "text-white", ring: "ring-red-300", icon: "opacity-100" };
    case "high":
      return { bg: "bg-orange-500", text: "text-white", ring: "ring-orange-300", icon: "opacity-100" };
    case "medium":
      return { bg: "bg-yellow-400", text: "text-black", ring: "ring-yellow-200", icon: "opacity-100" };
    case "low":
      return { bg: "bg-green-600", text: "text-white", ring: "ring-green-300", icon: "opacity-100" };
    default:
      return { bg: "bg-slate-700", text: "text-white", ring: "ring-slate-300", icon: "opacity-80" };
  }
}

/**
 * Calculate center point from an array of markers, or fall back to default.
 */
export function calculateCenter(
  markers: MapMarkerData[],
  explicitCenter?: { lat: number; lng: number },
): { lat: number; lng: number } {
  if (explicitCenter) return explicitCenter;
  if (!markers.length) return { ...DEFAULT_CENTER };

  const lat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
  const lng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
  return { lat, lng };
}

/**
 * Create a stable string key from a DispatchRoute for dependency tracking.
 */
export function routeKey(route: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}): string {
  return `${route.origin.lat},${route.origin.lng}->${route.destination.lat},${route.destination.lng}`;
}
