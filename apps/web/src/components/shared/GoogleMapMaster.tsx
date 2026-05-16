import { useMemo, useState } from "react";
import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
} from "@vis.gl/react-google-maps";

import { MaterialIcon } from "../shared/MaterialIcon";

type MarkerSeverity =
  | "normal"
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface MapMarkerData {
  id: string | number;
  name: string;

  lat: number;
  lng: number;

  type?: string;
  status?: string;
  severity?: MarkerSeverity;

  inventory?: number;
  metadata?: Record<string, any>;
}

interface GoogleMapMasterProps {
  apiKey: string;
  mapId?: string;

  markers: MapMarkerData[];

  height?: string;
  defaultZoom?: number;

  center?: {
    lat: number;
    lng: number;
  };

  showControls?: boolean;
  enableInfoWindow?: boolean;

  className?: string;

  onMarkerClick?: (marker: MapMarkerData) => void;

  renderInfoWindow?: (
    marker: MapMarkerData,
    close: () => void,
  ) => React.ReactNode;

  loadingOverlay?: React.ReactNode;
}

export function GoogleMapMaster({
  apiKey,
  mapId,

  markers,

  height = "500px",
  defaultZoom = 7,

  center,

  showControls = true,
  enableInfoWindow = true,

  className = "",

  onMarkerClick,
  renderInfoWindow,

  loadingOverlay,
}: GoogleMapMasterProps) {
  const [selectedMarker, setSelectedMarker] =
    useState<MapMarkerData | null>(null);

  /**
   * ==================================================
   * AUTO CENTER CALCULATION
   * ==================================================
   */
  const calculatedCenter = useMemo(() => {
    if (center) return center;

    if (!markers.length) {
      return {
        lat: 9.0192,
        lng: 38.7525,
      };
    }

    const lat =
      markers.reduce((sum, marker) => sum + marker.lat, 0) /
      markers.length;

    const lng =
      markers.reduce((sum, marker) => sum + marker.lng, 0) /
      markers.length;

    return { lat, lng };
  }, [center, markers]);

  /**
   * ==================================================
   * SEVERITY COLOR SYSTEM
   * ==================================================
   */
  const getSeverityStyles = (severity?: MarkerSeverity) => {
    switch (severity) {
      case "critical":
        return {
          bg: "bg-red-600",
          text: "text-white",
          ring: "ring-red-300",
          icon: "opacity-100",
        };

      case "high":
        return {
          bg: "bg-orange-500",
          text: "text-white",
          ring: "ring-orange-300",
          icon: "opacity-100",
        };

      case "medium":
        return {
          bg: "bg-yellow-400",
          text: "text-black",
          ring: "ring-yellow-200",
          icon: "opacity-100",
        };

      case "low":
        return {
          bg: "bg-green-600",
          text: "text-white",
          ring: "ring-green-300",
          icon: "opacity-100",
        };

      default:
        return {
          bg: "bg-slate-700",
          text: "text-white",
          ring: "ring-slate-300",
          icon: "opacity-80",
        };
    }
  };

  /**
   * ==================================================
   * DEFAULT INFOWINDOW UI
   * ==================================================
   */
  const DefaultInfoWindow = ({
    marker,
  }: {
    marker: MapMarkerData;
  }) => {
    const severityStyles = getSeverityStyles(marker.severity);

    return (
      <div className="min-w-[260px] text-black">
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <h4 className="font-semibold text-sm leading-tight">
              {marker.name}
            </h4>

            {marker.type && (
              <p className="text-[11px] text-slate-500 mt-1">
                {marker.type}
              </p>
            )}
          </div>

          {marker.severity && (
            <span
              className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${severityStyles.bg} ${severityStyles.text}`}
            >
              {marker.severity}
            </span>
          )}
        </div>

        {/* Core Stats */}
        <div className="space-y-2 text-xs">
          {marker.status && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Status</span>

              <span className="font-medium text-right">
                {marker.status}
              </span>
            </div>
          )}

          {typeof marker.inventory === "number" && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-slate-500">Inventory</span>

              <span className="font-semibold">
                {marker.inventory} Units
              </span>
            </div>
          )}

          {/* Dynamic Metadata */}
          {marker.metadata &&
            Object.entries(marker.metadata).map(([key, value]) => (
              <div
                key={key}
                className="flex items-center justify-between gap-4"
              >
                <span className="text-slate-500 capitalize">
                  {key.replace(/([A-Z])/g, " $1")}
                </span>

                <span className="font-medium text-right">
                  {String(value)}
                </span>
              </div>
            ))}
        </div>

        {/* Footer CTA */}
        <button className="w-full mt-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors">
          View Operations
        </button>
      </div>
    );
  };

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 ${className}`}
      style={{ height }}
    >
      <APIProvider apiKey={apiKey}>
        <Map
          defaultCenter={calculatedCenter}
          defaultZoom={defaultZoom}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={!showControls}
        >
          {/* ================================================== */}
          {/* MARKERS */}
          {/* ================================================== */}
          {markers.map((marker) => {
            const severityStyles = getSeverityStyles(
              marker.severity,
            );

            return (
              <AdvancedMarker
                key={marker.id}
                position={{
                  lat: marker.lat,
                  lng: marker.lng,
                }}
                onClick={() => {
                  setSelectedMarker(marker);

                  if (onMarkerClick) {
                    onMarkerClick(marker);
                  }
                }}
              >
                {/* ================================================== */}
                {/* CUSTOM BLOOD DROP PIN */}
                {/* ================================================== */}
                <div
                  className={`
                    relative flex items-center justify-center
                    w-12 h-12 rounded-full
                    shadow-2xl
                    border-4 border-white
                    ring-4 ${severityStyles.ring}
                    ${severityStyles.bg}
                    cursor-pointer
                    transition-all duration-300
                    hover:scale-110
                  `}
                >
                  <MaterialIcon
                    icon="water_drop"
                    className={`${severityStyles.text} ${severityStyles.icon}`}
                    size={22}
                    filled
                  />

                  {/* Pulse */}
                  {marker.severity === "critical" && (
                    <span className="absolute inset-0 rounded-full animate-ping bg-red-500 opacity-40" />
                  )}
                </div>
              </AdvancedMarker>
            );
          })}

          {/* ================================================== */}
          {/* INFOWINDOW */}
          {/* ================================================== */}
          {enableInfoWindow && selectedMarker && (
            <InfoWindow
              position={{
                lat: selectedMarker.lat,
                lng: selectedMarker.lng,
              }}
              onCloseClick={() => setSelectedMarker(null)}
            >
              {renderInfoWindow ? (
                renderInfoWindow(selectedMarker, () =>
                  setSelectedMarker(null),
                )
              ) : (
                <DefaultInfoWindow marker={selectedMarker} />
              )}
            </InfoWindow>
          )}
        </Map>
      </APIProvider>

      {/* ================================================== */}
      {/* OPTIONAL OVERLAY */}
      {/* ================================================== */}
      {loadingOverlay && (
        <div className="absolute inset-0 z-20">
          {loadingOverlay}
        </div>
      )}
    </div>
  );
}