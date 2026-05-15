import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { StatCard } from "../../components/shared/StatCard";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { AlertFeed } from "../../components/shared/AlertFeed";
import { useNationalDashboard, useAlerts, useRecommendations } from "../../hooks/useApi";

export default function CommandCenterPage() {
  const { data: dashboard, isLoading } = useNationalDashboard();
  const { data: alertsData } = useAlerts({ limit: 5 });
  const { data: recommendations } = useRecommendations({ limit: 3 });

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const alerts = Array.isArray(alertsData?.items || alertsData) ? (alertsData?.items || alertsData) : [];

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
        <div>
          <h2 className="text-display-lg text-m3-on-surface tracking-tight">National Command Center</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Real-time situational awareness across regional blood banks.</p>
        </div>
        <div className="flex items-center gap-2 text-data-mono text-m3-secondary">
          <span className="w-2 h-2 rounded-full bg-m3-primary animate-pulse" />
          <span>LIVE STREAM: SYNCHRONIZED</span>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Inventory"
          value={dashboard?.totalInventory ?? "—"}
          subtitle="Units"
          icon="inventory_2"
          trend={{ value: "+2.4% vs last week", direction: "up" }}
        />
        <StatCard
          title="Active Shortages"
          value={dashboard?.activeShortages ?? "—"}
          subtitle="Hospitals"
          icon="warning"
          iconColor="text-m3-error"
          borderColor="border-m3-error"
          badge={{ text: "CRITICAL: O-", variant: "error" }}
        />
        <StatCard
          title="Emergency Dispatches"
          value={dashboard?.emergencyDispatches ?? "—"}
          subtitle="In Transit"
          icon="local_shipping"
          progress={{ value: dashboard?.dispatchProgress ?? 65, color: "bg-m3-secondary" }}
        />
        <StatCard
          title="7-Day Expiry Risk"
          value={dashboard?.expiryRisk ?? "—"}
          subtitle="Units"
          icon="hourglass_empty"
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Map Area */}
        <div className="lg:col-span-8 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg flex flex-col overflow-hidden min-h-[400px]">
          <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center">
            <h3 className="text-title-sm text-m3-on-surface">Live Logistics Map</h3>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-m3-outline-variant rounded bg-m3-surface text-m3-on-surface text-label-caps hover:bg-m3-surface-variant">HEATMAP</button>
              <button className="px-3 py-1.5 bg-m3-secondary text-m3-on-secondary rounded text-label-caps">TRANSFERS</button>
            </div>
          </div>
          <div className="flex-1 relative bg-m3-surface-container-high flex items-center justify-center">
            <div className="text-center">
              <MaterialIcon icon="map" size={80} className="text-m3-outline/30" />
              <p className="text-body-compact text-m3-on-surface-variant mt-2">Interactive logistics map</p>
              <p className="text-data-mono text-m3-outline">Map integration pending</p>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* AI Recommendations */}
          <div className="bg-[#F5F3FF] border-l-4 border-m3-tertiary rounded-r-lg border-y border-r border-m3-outline-variant p-4 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-4">
              <MaterialIcon icon="psychology" className="text-m3-tertiary" />
              <h3 className="text-title-sm text-m3-on-surface">AI Logistics Intel</h3>
            </div>
            <div className="space-y-3 flex-1 overflow-y-auto">
              {(Array.isArray(recommendations) ? recommendations : []).length > 0 ? (
                (recommendations as any[]).map((rec: any) => (
                  <div key={rec._id} className="bg-m3-surface-container-lowest p-3 rounded border border-m3-outline-variant hover:border-m3-tertiary cursor-pointer transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-label-caps text-m3-tertiary">{rec.type?.replace(/_/g, " ")}</span>
                      <span className="text-data-mono text-m3-on-surface-variant">{rec.confidence}% Match</span>
                    </div>
                    <p className="text-body-compact text-m3-on-surface mb-2">{rec.description}</p>
                    <button className="w-full py-1.5 border border-m3-tertiary text-m3-tertiary text-title-sm rounded hover:bg-m3-tertiary hover:text-m3-on-tertiary transition-colors text-sm">
                      Execute Transfer
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-m3-on-surface-variant/50">
                  <p className="text-body-compact">No recommendations</p>
                </div>
              )}
            </div>
          </div>

          {/* Alert Feed */}
          <AlertFeed alerts={alerts} className="flex-1" />
        </div>
      </div>
    </div>
  );
}
