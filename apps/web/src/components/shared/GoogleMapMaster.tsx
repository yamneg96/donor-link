import {
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  APIProvider,
  Map,
  AdvancedMarker,
  InfoWindow,
  useMap,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

import {
  MarkerClusterer,
  type Marker,
} from "@googlemaps/markerclusterer";

import { MaterialIcon } from "../shared/MaterialIcon";

/* ========================================================== */
/* TYPES */
/* ========================================================== */

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

export interface DispatchRoute {
  id?: string | number;

  origin: {
    lat: number;
    lng: number;
  };

  destination: {
    lat: number;
    lng: number;
  };

  travelMode?: google.maps.TravelMode;

  color?: string;

  sourceName?: string;

  destinationName?: string;
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

  enableClustering?: boolean;

  enableDirections?: boolean;

  className?: string;

  dispatchRoutes?: DispatchRoute[];

  onMarkerClick?: (
    marker: MapMarkerData,
  ) => void;

  renderInfoWindow?: (
    marker: MapMarkerData,
    close: () => void,
  ) => React.ReactNode;

  loadingOverlay?: React.ReactNode;
}

/* ========================================================== */
/* ROUTE RENDERER */
/* ========================================================== */

interface DirectionRoutesProps {
  routes: DispatchRoute[];
}

function DirectionRoutes({
  routes,
}: DirectionRoutesProps) {
  const map = useMap();

  const routesLibrary =
    useMapsLibrary("routes");

  const renderersRef = useRef<
    google.maps.DirectionsRenderer[]
  >([]);

  useEffect(() => {
    if (!map || !routesLibrary) return;

    let mounted = true;

    const directionsService =
      new routesLibrary.DirectionsService();

    /* CLEAR OLD ROUTES */

    renderersRef.current.forEach(
      (renderer) => {
        renderer.setMap(null);
      },
    );

    renderersRef.current = [];

    const bounds =
      new google.maps.LatLngBounds();

    const renderRoutes = async () => {
      for (const route of routes) {
        try {
          const renderer =
            new routesLibrary.DirectionsRenderer(
              {
                map,

                suppressMarkers: false,

                preserveViewport: true,

                polylineOptions: {
                  strokeColor:
                    route.color ||
                    "#DC2626",

                  strokeOpacity: 0.95,

                  strokeWeight: 6,
                },

                markerOptions: {
                  zIndex: 999,
                },
              },
            );

          const response =
            await directionsService.route({
              origin: route.origin,

              destination:
                route.destination,

              travelMode:
                route.travelMode ||
                google.maps.TravelMode
                  .DRIVING,
            });

          if (!mounted) return;

          renderer.setDirections(
            response,
          );

          renderersRef.current.push(
            renderer,
          );

          const leg =
            response.routes?.[0]?.legs?.[0];

          if (leg) {
            bounds.extend(
              leg.start_location,
            );

            bounds.extend(
              leg.end_location,
            );
          }
        } catch (error) {
          console.error(
            "Directions error:",
            error,
          );
        }
      }

      if (!bounds.isEmpty()) {
        map.fitBounds(bounds, 120);
      }
    };

    renderRoutes();

    return () => {
      mounted = false;

      renderersRef.current.forEach(
        (renderer) => {
          renderer.setMap(null);
        },
      );

      renderersRef.current = [];
    };
  }, [map, routesLibrary, routes]);

  return null;
}

/* ========================================================== */
/* CLUSTER MARKERS */
/* ========================================================== */

interface ClusterMarkersProps {
  markers: MapMarkerData[];

  getSeverityStyles: (
    severity?: MarkerSeverity,
  ) => {
    bg: string;
    text: string;
    ring: string;
    icon: string;
  };

  onSelectMarker: (
    marker: MapMarkerData,
  ) => void;
}

function ClusterMarkers({
  markers,
  getSeverityStyles,
  onSelectMarker,
}: ClusterMarkersProps) {
  const map = useMap();

  const clusterer = useRef<MarkerClusterer | null>(
    null,
  );

  const markersRef = useRef<
    Record<string, Marker>
  >({});

  useEffect(() => {
    if (!map) return;

    if (!clusterer.current) {
      clusterer.current =
        new MarkerClusterer({
          map,
        });
    }
  }, [map]);

  const updateClusterer =
    useCallback(() => {
      if (!clusterer.current) return;

      clusterer.current.clearMarkers();

      clusterer.current.addMarkers(
        Object.values(markersRef.current),
      );
    }, []);

  const createMarkerRef = useCallback(
    (id: string) => {
      return (marker: Marker | null) => {
        if (marker) {
          markersRef.current[id] =
            marker;
        } else {
          delete markersRef.current[id];
        }

        updateClusterer();
      };
    },
    [updateClusterer],
  );

  useEffect(() => {
    updateClusterer();
  }, [markers, updateClusterer]);

  return (
    <>
      {markers.map((marker) => {
        const severityStyles =
          getSeverityStyles(
            marker.severity,
          );

        return (
          <AdvancedMarker
            key={marker.id}
            position={{
              lat: marker.lat,
              lng: marker.lng,
            }}
            ref={createMarkerRef(
              String(marker.id),
            )}
            onClick={() =>
              onSelectMarker(marker)
            }
          >
            <div
              className={`
                relative
                flex items-center justify-center
                w-12 h-12
                rounded-full
                border-4 border-white
                shadow-2xl
                ring-4
                transition-all duration-300
                hover:scale-110
                cursor-pointer
                ${severityStyles.bg}
                ${severityStyles.ring}
              `}
            >
              <MaterialIcon
                icon="water_drop"
                size={22}
                filled
                className={severityStyles.text}
              />

              {marker.severity ===
                "critical" && (
                <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
              )}
            </div>
          </AdvancedMarker>
        );
      })}
    </>
  );
}

/* ========================================================== */
/* MAIN COMPONENT */
/* ========================================================== */

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
  const [selectedMarker, setSelectedMarker] =
    useState<MapMarkerData | null>(
      null,
    );

  const calculatedCenter = useMemo(() => {
    if (center) return center;

    if (!markers.length) {
      return {
        lat: 9.0192,
        lng: 38.7525,
      };
    }

    const lat =
      markers.reduce(
        (sum, marker) =>
          sum + marker.lat,
        0,
      ) / markers.length;

    const lng =
      markers.reduce(
        (sum, marker) =>
          sum + marker.lng,
        0,
      ) / markers.length;

    return {
      lat,
      lng,
    };
  }, [center, markers]);

  const getSeverityStyles = (
    severity?: MarkerSeverity,
  ) => {
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

  const handleMarkerClick = (
    marker: MapMarkerData,
  ) => {
    setSelectedMarker(marker);

    onMarkerClick?.(marker);
  };

  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-2xl
        border border-slate-200
        dark:border-slate-800
        ${className}
      `}
      style={{ height }}
    >
      <APIProvider
        apiKey={apiKey}
        libraries={["routes"]}
      >
        <Map
          defaultCenter={
            calculatedCenter
          }
          defaultZoom={defaultZoom}
          mapId={mapId}
          gestureHandling="greedy"
          disableDefaultUI={
            !showControls
          }
        >
          {/* ROUTES */}

          {enableDirections &&
            dispatchRoutes.length >
              0 && (
              <DirectionRoutes
                routes={
                  dispatchRoutes
                }
              />
            )}

          {/* MARKERS */}

          {enableClustering ? (
            <ClusterMarkers
              markers={markers}
              getSeverityStyles={
                getSeverityStyles
              }
              onSelectMarker={
                handleMarkerClick
              }
            />
          ) : (
            markers.map((marker) => {
              const severityStyles =
                getSeverityStyles(
                  marker.severity,
                );

              return (
                <AdvancedMarker
                  key={marker.id}
                  position={{
                    lat: marker.lat,
                    lng: marker.lng,
                  }}
                  onClick={() =>
                    handleMarkerClick(
                      marker,
                    )
                  }
                >
                  <div
                    className={`
                      relative
                      flex items-center justify-center
                      w-12 h-12
                      rounded-full
                      border-4 border-white
                      shadow-2xl
                      ring-4
                      transition-all duration-300
                      hover:scale-110
                      cursor-pointer
                      ${severityStyles.bg}
                      ${severityStyles.ring}
                    `}
                  >
                    <MaterialIcon
                      icon="water_drop"
                      size={22}
                      filled
                      className={`
                        ${severityStyles.text}
                        ${severityStyles.icon}
                      `}
                    />

                    {marker.severity ===
                      "critical" && (
                      <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
                    )}
                  </div>
                </AdvancedMarker>
              );
            })
          )}

          {/* INFO WINDOW */}

          {enableInfoWindow &&
            selectedMarker && (
              <InfoWindow
                position={{
                  lat: selectedMarker.lat,
                  lng: selectedMarker.lng,
                }}
                onCloseClick={() =>
                  setSelectedMarker(
                    null,
                  )
                }
              >
                {renderInfoWindow?.(
                  selectedMarker,
                  () =>
                    setSelectedMarker(
                      null,
                    ),
                )}
              </InfoWindow>
            )}
        </Map>
      </APIProvider>

      {loadingOverlay && (
        <div className="absolute inset-0 z-20">
          {loadingOverlay}
        </div>
      )}
    </div>
  );
}