/* ================================================================== */
/* MAP TYPE DEFINITIONS                                                */
/* ================================================================== */

export type MarkerSeverity =
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
  metadata?: Record<string, unknown>;
}

export interface DispatchRoute {
  id?: string | number;
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  travelMode?: google.maps.TravelMode;
  color?: string;
  sourceName?: string;
  destinationName?: string;
}

export interface SeverityStyleSet {
  bg: string;
  text: string;
  ring: string;
  icon: string;
}

export interface GoogleMapMasterProps {
  apiKey: string;
  mapId?: string;
  markers: MapMarkerData[];
  height?: string;
  defaultZoom?: number;
  center?: { lat: number; lng: number };
  showControls?: boolean;
  enableInfoWindow?: boolean;
  enableClustering?: boolean;
  enableDirections?: boolean;
  className?: string;
  dispatchRoutes?: DispatchRoute[];
  onMarkerClick?: (marker: MapMarkerData) => void;
  renderInfoWindow?: (
    marker: MapMarkerData,
    close: () => void,
  ) => React.ReactNode;
  loadingOverlay?: React.ReactNode;
}
