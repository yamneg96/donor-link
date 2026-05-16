/* ================================================================== */
/* GOOGLE MAP MASTER — Slim orchestrator                               */
/* ================================================================== */

import { useState, useMemo } from "react";
import { APIProvider, Map, AdvancedMarker } from "@vis.gl/react-google-maps";

import type { GoogleMapMasterProps, MapMarkerData } from "./map.types";
import { MAPS_LIBRARIES } from "./map.constants";
import { calculateCenter, getSeverityStyles } from "./map.utils";

import { MapDirections } from "./MapDirections";
import { MapClusterer } from "./MapClusterer";
import { MapMarker } from "./MapMarker";
import { MapInfoWindowOverlay } from "./MapInfoWindow";

export function GoogleMapMaster({
  apiKey,
  mapId,
  markers,
  height = "1000px",
  defaultZoom = 7,
  center,
  showControls = true,
  enableInfoWindow = true,
  enableClustering = true,
  enableDirections = true,
  dispatchRoutes = [],
  className = "",
  onMarkerClick,
  renderInfoWindow,
  loadingOverlay,
}: GoogleMapMasterProps) {
  const [selectedMarker, setSelectedMarker] = useState<MapMarkerData | null>(
    null,
  );

  const calculatedCenter = useMemo(
    () => calculateCenter(markers, center),
    [center, markers],
  );

  const handleMarkerClick = (marker: MapMarkerData) => {
    setSelectedMarker(marker);
    onMarkerClick?.(marker);
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}
      style={{ height }}
    >
      <APIProvider apiKey={apiKey} libraries={MAPS_LIBRARIES}>
        <Map
          defaultCenter={calculatedCenter}
          defaultZoom={defaultZoom}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={!showControls}
        >
          {/* ── DIRECTIONS ── */}
          {enableDirections && dispatchRoutes.length > 0 && (
            <MapDirections routes={dispatchRoutes} />
          )}

          {/* ── MARKERS ── */}
          {enableClustering ? (
            <MapClusterer
              markers={markers}
              onSelectMarker={handleMarkerClick}
            />
          ) : (
            markers.map((marker) => {
              const styles = getSeverityStyles(marker.severity);
              return (
                <AdvancedMarker
                  key={marker.id}
                  position={{ lat: marker.lat, lng: marker.lng }}
                  onClick={() => handleMarkerClick(marker)}
                >
                  <MapMarker severity={marker.severity} styles={styles} />
                </AdvancedMarker>
              );
            })
          )}

          {/* ── INFO WINDOW ── */}
          {enableInfoWindow && selectedMarker && (
            <MapInfoWindowOverlay
              marker={selectedMarker}
              onClose={() => setSelectedMarker(null)}
              renderContent={renderInfoWindow}
            />
          )}
        </Map>
      </APIProvider>

      {loadingOverlay && (
        <div className="absolute inset-0 z-20">{loadingOverlay}</div>
      )}
    </div>
  );
}
