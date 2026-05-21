import { useMemo, useState } from "react";

import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { StatCard } from "../../components/shared/StatCard";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { AlertFeed } from "../../components/shared/AlertFeed";

import {
  GoogleMapMaster,
  type MapMarkerData,
  type DispatchRoute,
} from "@/components/shared/map";

import {
  useNationalDashboard,
  useAlerts,
  useRecommendations,
} from "../../hooks/useApi";

import { useTheme } from "@/components/theme-provider";

export default function CommandCenterPage() {
  const { theme } = useTheme();

  const { data: dashboard, isLoading } =
    useNationalDashboard();

  const { data: alertsData } = useAlerts({
    limit: 5,
  });

  const { data: recommendations } =
    useRecommendations({
      limit: 3,
    });

  /**
   * ==================================================
   * STATE
   * ==================================================
   */

  const [
    activeDispatches,
    setActiveDispatches,
  ] = useState<DispatchRoute[]>(
    [],
  );

  const [
    selectedDestination,
    setSelectedDestination,
  ] = useState<MapMarkerData | null>(
    null,
  );

  /**
   * ==================================================
   * ALERTS
   * ==================================================
   */

  const alerts = Array.isArray(
    alertsData?.items || alertsData,
  )
    ? alertsData?.items || alertsData
    : [];

  /**
   * ==================================================
   * ETHIOPIAN BLOOD NETWORK NODES
   * ==================================================
   */

  const logisticsNodes: MapMarkerData[] =
    useMemo(
      () => [
        {
          id: 1,

          name:
            "Ethiopian National Blood Bank",

          lat: 9.0192,
          lng: 38.7525,

          type: "National Center",

          severity: "low",

          status:
            "Stable National Reserve",

          inventory: 1240,

          metadata: {
            region: "Addis Ababa",
            transfers: 18,
            utilization: "71%",
          },
        },

        {
          id: 2,

          name:
            "Tikur Anbessa Specialized Hospital",

          lat: 9.035,
          lng: 38.7619,

          type: "Referral Hospital",

          severity: "critical",

          status:
            "Critical O- Shortage",

          inventory: 82,

          metadata: {
            emergencyCases: 14,
            transfersNeeded: 3,
            utilization: "96%",
          },
        },

        {
          id: 3,

          name: "St. Paul Hospital",

          lat: 9.0579,
          lng: 38.7636,

          type: "Regional Hospital",

          severity: "medium",

          status:
            "Moderate Inventory",

          inventory: 214,

          metadata: {
            transfersAvailable: 2,
            utilization: "63%",
          },
        },

        {
          id: 4,

          name: "Yekatit 12 Hospital",

          lat: 9.03,
          lng: 38.74,

          type: "Hospital",

          severity: "low",

          status:
            "Surplus Available",

          inventory: 388,

          metadata: {
            surplusUnits: 120,
            expiryRisk: "Low",
          },
        },
      ],
      [],
    );

  /**
   * ==================================================
   * DISPATCH LOGIC
   * ==================================================
   */

  const initiateDispatch = (
    sourceMarker: MapMarkerData,
  ) => {
    if (!selectedDestination) {
      alert(
        "Please select a destination hospital first.",
      );

      return;
    }

    if (
      sourceMarker.id ===
      selectedDestination.id
    ) {
      alert(
        "Source and destination cannot be the same.",
      );

      return;
    }

    const dispatchId = `${sourceMarker.id}-${selectedDestination.id}`;

    const alreadyExists =
      activeDispatches.some(
        (route) => route.id === dispatchId,
      );

    if (alreadyExists) {
      alert(
        "Dispatch route already exists.",
      );

      return;
    }

    setActiveDispatches((prev) => [
      ...prev,
      {
        id: dispatchId,

        origin: {
          lat: sourceMarker.lat,
          lng: sourceMarker.lng,
        },

        destination: {
          lat: selectedDestination.lat,
          lng: selectedDestination.lng,
        },

        color:
          selectedDestination.severity ===
          "critical"
            ? "#DC2626"
            : "#2563EB",

        sourceName:
          sourceMarker.name,

        destinationName:
          selectedDestination.name,
      },
    ]);
  };

  /**
   * ==================================================
   * REMOVE DISPATCH
   * ==================================================
   */

  const clearDispatch = (id: string) => {
    setActiveDispatches((prev) =>
      prev.filter(
        (dispatch) => dispatch.id !== id,
      ),
    );
  };

  /**
   * ==================================================
   * LOADING
   * ==================================================
   */

  if (isLoading) {
    return (
      <div className="p-6">
        <LoadingSkeleton rows={6} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-display-lg text-m3-on-surface tracking-tight">
            National Command Center
          </h2>

          <p className="text-body-main text-m3-on-surface-variant mt-2">
            Real-time situational awareness
            across regional blood banks.
          </p>
        </div>

        <div className="flex items-center gap-2 text-data-mono text-m3-secondary">
          <span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />

          <span>
            LIVE STREAM: SYNCHRONIZED
          </span>
        </div>
      </div>

      {/* KPI */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory"
          value={
            dashboard?.totalInventory ?? "—"
          }
          subtitle="Units"
          icon="inventory_2"
          trend={{
            value: "+2.4% vs last week",
            direction: "up",
          }}
        />

        <StatCard
          title="Active Shortages"
          value={
            dashboard?.activeShortages ?? "—"
          }
          subtitle="Hospitals"
          icon="warning"
          iconColor="text-m3-error"
          borderColor="border-m3-error"
          badge={{
            text: "CRITICAL: O-",
            variant: "error",
          }}
        />

        <StatCard
          title="Emergency Dispatches"
          value={
            activeDispatches.length ||
            dashboard?.emergencyDispatches ||
            "—"
          }
          subtitle="In Transit"
          icon="local_shipping"
        />

        <StatCard
          title="7-Day Expiry Risk"
          value={
            dashboard?.expiryRisk ?? "—"
          }
          subtitle="Units"
          icon="hourglass_empty"
        />

        <StatCard
          title="AI Strategic Insight"
          value="Shortage Risk"
          subtitle="Tier: Critical"
          icon="psychology"
          badge={{
            text: "ML ACTIVE",
            variant: "info",
          }}
          className="cursor-pointer hover:border-primary/50 transition-colors"
          onClick={() => window.location.href = '/intelligence/redistribution'}
        />
      </div>

      {/* MAIN */}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* MAP */}

        <div className="lg:col-span-8 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg flex flex-col overflow-hidden min-h-[400px]">
          {/* MAP HEADER */}

          <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center">
            <div>
              <h3 className="text-title-sm text-m3-on-surface">
                Live Logistics Map
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Select a destination
                hospital first, then open
                another node and dispatch.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-m3-outline-variant rounded bg-m3-surface text-m3-on-surface text-label-caps hover:bg-m3-surface-variant transition-colors">
                HEATMAP
              </button>

              <button className="px-3 py-1.5 bg-m3-secondary text-m3-on-secondary rounded text-label-caps hover:opacity-90 transition-opacity">
                TRANSFERS
              </button>
            </div>
          </div>

          {/* DESTINATION BAR */}

          <div className="px-4 py-3 border-b border-m3-outline-variant bg-slate-50">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">
                  Selected Destination
                </p>

                {selectedDestination ? (
                  <div>
                    <p className="font-semibold text-sm text-slate-900">
                      {
                        selectedDestination.name
                      }
                    </p>

                    <p className="text-xs text-slate-500">
                      {
                        selectedDestination.status
                      }
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    No destination selected
                  </p>
                )}
              </div>

              {selectedDestination && (
                <button
                  onClick={() =>
                    setSelectedDestination(
                      null,
                    )
                  }
                  className="px-3 py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                >
                  Clear Selection
                </button>
              )}
            </div>
          </div>

          {/* MAP */}

          <div className="flex-1 relative overflow-hidden">
            <GoogleMapMaster
              apiKey={
                import.meta.env
                  .VITE_GOOGLE_MAPS_API_KEY
              }
              mapId={
                theme === 'light' ? (
                  import.meta.env.VITE_GOOGLE_LIGHT_MAPS_MAP_ID
                ) : (import.meta.env.VITE_GOOGLE_DARK_MAPS_MAP_ID)
              }
              markers={logisticsNodes}
              defaultZoom={12}
              height="calc(100vh - 64px)"
              className="rounded-none border-none"
              enableClustering
              enableDirections
              center={{
                lat: 9.0192,
                lng: 38.7525,
              }}
              dispatchRoutes={
                activeDispatches
              }
              renderInfoWindow={(
                marker,
              ) => (
                <div className="min-w-[260px] text-black">
                  {/* HEADER */}

                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="font-semibold text-sm leading-tight">
                        {marker.name}
                      </h4>

                      <p className="text-[11px] text-slate-500 mt-1">
                        {marker.type}
                      </p>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                        marker.severity ===
                        "critical"
                          ? "bg-red-100 text-red-700"
                          : marker.severity ===
                            "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {marker.severity}
                    </span>
                  </div>

                  {/* BODY */}

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Inventory
                      </span>

                      <span className="font-semibold">
                        {marker.inventory} Units
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">
                        Status
                      </span>

                      <span className="font-medium text-right">
                        {marker.status}
                      </span>
                    </div>

                    {marker.metadata &&
                      Object.entries(
                        marker.metadata,
                      ).map(
                        ([key, value]) => (
                          <div
                            key={key}
                            className="flex justify-between gap-4"
                          >
                            <span className="text-slate-500 capitalize">
                              {key.replace(
                                /([A-Z])/g,
                                " $1",
                              )}
                            </span>

                            <span className="font-medium text-right">
                              {String(
                                value,
                              )}
                            </span>
                          </div>
                        ),
                      )}
                  </div>

                  {/* ACTIONS */}

                  <div className="grid grid-cols-2 gap-2 mt-4">
                    <button
                      onClick={() =>
                        setSelectedDestination(
                          marker,
                        )
                      }
                      className="py-2 rounded-lg bg-blue-600 text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                      Select Destination
                    </button>

                    <button
                      onClick={() =>
                        initiateDispatch(
                          marker,
                        )
                      }
                      className="py-2 rounded-lg border border-red-200 bg-red-50 text-red-700 text-xs font-semibold hover:bg-red-100 transition-colors"
                    >
                      Dispatch
                    </button>
                  </div>
                </div>
              )}
            />

            {/* ACTIVE DISPATCHES */}

            {activeDispatches.length >
              0 && (
              <div className="absolute top-14 right-4 z-20 bg-white/90 backdrop-blur-xl border border-white/30 shadow-2xl rounded-2xl p-4 w-[320px]">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />

                  <h4 className="text-sm font-semibold text-slate-900">
                    Active Blood Transfers
                  </h4>
                </div>

                <div className="space-y-3 max-h-[260px] overflow-auto">
                  {activeDispatches.map(
                    (
                      dispatch,
                      index,
                    ) => (
                      <div
                        key={dispatch.id}
                        className="rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-xs font-semibold text-slate-900">
                            Transfer #
                            {index + 1}
                          </span>

                          <button
                            onClick={() =>
                              clearDispatch(
                                String(
                                  dispatch.id,
                                ),
                              )
                            }
                            className="text-red-600 hover:text-red-700"
                          >
                            <MaterialIcon
                              icon="close"
                              size={16}
                            />
                          </button>
                        </div>

                        <div className="space-y-2 text-[11px]">
                          <div className="flex items-center gap-2 text-slate-700">
                            <MaterialIcon
                              icon="south_east"
                              size={14}
                              className="text-blue-600"
                            />

                            <span className="font-medium">
                              {
                                dispatch.sourceName
                              }
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-slate-700">
                            <MaterialIcon
                              icon="location_on"
                              size={14}
                              className="text-red-600"
                            />

                            <span className="font-medium">
                              {
                                dispatch.destinationName
                              }
                            </span>
                          </div>

                          <div className="pt-2 border-t border-slate-100 flex items-center gap-2 text-slate-500">
                            <MaterialIcon
                              icon="route"
                              size={14}
                            />

                            <span>
                              Real-time GPS route
                              active
                            </span>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* FLOATING STATUS */}

            <div className="absolute left-4 bottom-4 bg-black/75 backdrop-blur-md text-white rounded-xl px-4 py-3 shadow-2xl border border-white/10 z-10">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                <p className="text-[11px] tracking-widest font-medium uppercase">
                  National Monitoring Active
                </p>
              </div>

              <div className="space-y-1 text-xs text-white/80">
                <p>
                  •{" "}
                  {
                    activeDispatches.length
                  }{" "}
                  Active Transfer Routes
                </p>

                <p>
                  • 2 Critical Shortage Zones
                </p>

                <p>
                  • 18 Regional Centers
                  Connected
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN */}

        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* AI RECOMMENDATIONS */}

          <div className="bg-background border-l-4 border-m3-tertiary rounded-r-lg border-y border-r border-m3-outline-variant p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon
                icon="psychology"
                className="text-m3-tertiary"
              />

              <h3 className="text-title-sm text-m3-on-surface">
                AI Logistics Intel
              </h3>
              
              <div className="flex-1" />
              
              <button 
                onClick={() => window.location.href = '/intelligence/forecast'}
                className="text-[10px] font-bold text-m3-tertiary uppercase hover:underline"
              >
                Full Forecast
              </button>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {(Array.isArray(
                recommendations,
              )
                ? recommendations
                : []
              ).length > 0 ? (
                (
                  recommendations as any[]
                ).map((rec: any) => (
                  <div
                    key={rec._id}
                    className="bg-m3-surface-container-lowest p-3 rounded border border-m3-outline-variant hover:border-m3-tertiary cursor-pointer transition-colors"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-label-caps text-m3-tertiary">
                        {rec.type?.replace(
                          /_/g,
                          " ",
                        )}
                      </span>

                      <span className="text-data-mono text-m3-on-surface-variant">
                        {rec.confidence}% Match
                      </span>
                    </div>

                    <p className="text-body-compact text-m3-on-surface mb-2">
                      {rec.description}
                    </p>

                    <button className="w-full py-1.5 border border-m3-tertiary text-m3-tertiary text-title-sm rounded hover:bg-m3-tertiary hover:text-m3-on-tertiary transition-colors text-sm">
                      Execute Transfer
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-m3-on-surface-variant/50">
                  <p className="text-body-compact">
                    No recommendations
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ALERT FEED */}

          <AlertFeed
            alerts={alerts}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  );
}