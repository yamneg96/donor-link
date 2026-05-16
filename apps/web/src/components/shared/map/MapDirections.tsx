/* ================================================================== */
/* MAP DIRECTIONS — Route rendering via Google Directions API          */
/* ================================================================== */

import { useEffect, useRef, useMemo } from "react";
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps";
import type { DispatchRoute } from "./map.types";
import { ROUTE_DEFAULTS } from "./map.constants";
import { routeKey } from "./map.utils";

interface MapDirectionsProps {
  routes: DispatchRoute[];
}

/**
 * Renders driving directions on the map for each DispatchRoute.
 *
 * KEY FIX: Uses `useMapsLibrary("routes")` which is the CORRECT way to
 * wait for the Google Maps Routes library when using @vis.gl/react-google-maps.
 * The previous implementation used `window.google` directly which races with
 * the async API loading done by <APIProvider>.
 */
export function MapDirections({ routes }: MapDirectionsProps) {
  const map = useMap();
  const routesLibrary = useMapsLibrary("routes");

  const renderersRef = useRef<google.maps.DirectionsRenderer[]>([]);

  // Stable serialized key so we only re-render when routes actually change
  const routesFingerprint = useMemo(
    () => routes.map(routeKey).join("|"),
    [routes],
  );

  useEffect(() => {
    if (!map || !routesLibrary || routes.length === 0) return;

    let mounted = true;

    const directionsService = new routesLibrary.DirectionsService();

    // ── Cleanup previous renderers ──
    renderersRef.current.forEach((r) => r.setMap(null));
    renderersRef.current = [];

    const bounds = new google.maps.LatLngBounds();

    const renderAllRoutes = async () => {
      for (const route of routes) {
        if (!mounted) return;

        try {
          // ── Create renderer ──
          const renderer = new routesLibrary.DirectionsRenderer({
            map,
            suppressMarkers: false,
            preserveViewport: true,
            polylineOptions: {
              strokeColor: route.color || ROUTE_DEFAULTS.defaultColor,
              strokeOpacity: ROUTE_DEFAULTS.strokeOpacity,
              strokeWeight: ROUTE_DEFAULTS.strokeWeight,
            },
            markerOptions: {
              zIndex: 999,
            },
          });

          // ── Fetch route ──
          const response = await directionsService.route({
            origin: route.origin,
            destination: route.destination,
            travelMode:
              route.travelMode || google.maps.TravelMode.DRIVING,
          });

          if (!mounted) {
            renderer.setMap(null);
            return;
          }

          // ── Apply route ──
          renderer.setDirections(response);
          renderersRef.current.push(renderer);

          // ── Extend bounds ──
          const leg = response.routes?.[0]?.legs?.[0];
          if (leg) {
            bounds.extend(leg.start_location);
            bounds.extend(leg.end_location);
          }
        } catch (error) {
          console.error("[MapDirections] Directions request failed:", error);
        }
      }

      // ── Fit map to all routes ──
      if (mounted && !bounds.isEmpty()) {
        map.fitBounds(bounds, ROUTE_DEFAULTS.boundspadding);
      }
    };

    renderAllRoutes();

    return () => {
      mounted = false;
      renderersRef.current.forEach((r) => r.setMap(null));
      renderersRef.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, routesLibrary, routesFingerprint]);

  return null;
}
