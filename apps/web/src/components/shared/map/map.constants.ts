/* ================================================================== */
/* MAP CONSTANTS                                                       */
/* ================================================================== */

/** Default map center — Addis Ababa, Ethiopia */
export const DEFAULT_CENTER = { lat: 9.0192, lng: 38.7525 } as const;

/** Default zoom level for national view */
export const DEFAULT_ZOOM = 7;

/** Libraries required by the Google Maps API */
export const MAPS_LIBRARIES: ("routes" | "places" | "geometry")[] = ["routes"];

/** Route polyline defaults */
export const ROUTE_DEFAULTS = {
  strokeWeight: 6,
  strokeOpacity: 0.95,
  defaultColor: "#DC2626",
  boundspadding: 100,
} as const;
