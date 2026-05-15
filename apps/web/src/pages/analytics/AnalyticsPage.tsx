import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useNationalAnalytics, useWastageAnalytics, useDonorAnalytics, useTransferAnalytics } from "../../hooks/useApi";

export default function AnalyticsPage() {
  const { data: national, isLoading } = useNationalAnalytics();
  const { data: wastage } = useWastageAnalytics();
  const { data: donorStats } = useDonorAnalytics();
  const { data: transferStats } = useTransferAnalytics();
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Analytics & Forecasting</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">National analytics dashboard with trends and forecasts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Donations", value: national?.totalDonations ?? "—", icon: "favorite" },
          { label: "Active Donors", value: donorStats?.activeDonors ?? "—", icon: "group" },
          { label: "Units Wasted", value: wastage?.totalWasted ?? "—", icon: "delete" },
          { label: "Transfers", value: transferStats?.totalTransfers ?? "—", icon: "swap_horiz" },
        ].map((s) => (
          <div key={s.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg p-5 shadow-ambient-md">
            <div className="flex justify-between items-start mb-3">
              <span className="text-title-sm text-m3-on-surface text-sm">{s.label}</span>
              <MaterialIcon icon={s.icon} className="text-m3-secondary" />
            </div>
            <div className="text-display-lg text-m3-on-surface">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <MaterialIcon icon="bar_chart" size={64} className="text-m3-outline/30" />
            <p className="text-body-compact text-m3-on-surface-variant mt-2">Supply & Demand Trends</p>
            <p className="text-data-mono text-m3-outline">Chart integration pending</p>
          </div>
        </div>
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md min-h-[300px] flex items-center justify-center">
          <div className="text-center">
            <MaterialIcon icon="pie_chart" size={64} className="text-m3-outline/30" />
            <p className="text-body-compact text-m3-on-surface-variant mt-2">Regional Distribution</p>
            <p className="text-data-mono text-m3-outline">Chart integration pending</p>
          </div>
        </div>
      </div>
    </div>
  );
}
