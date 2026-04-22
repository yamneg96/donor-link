import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useDashboardStats, useRequestsTrend, useDonorsByRegion, useInventoryOverview } from "../../hooks/useApi";
import { StatCard, FullPageSpinner, Card } from "../../components/ui";
import { Droplets, Users, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react";
import { BloodType } from "@donorlink/types";

const BT_COLORS: Record<string, string> = {
  "A+": "#e51414", "A-": "#f83434", "B+": "#d97706", "B-": "#fbbf24",
  "AB+": "#7c3aed", "AB-": "#a78bfa", "O+": "#059669", "O-": "#34d399",
};

export function AnalyticsPage() {
  const { data: stats, isLoading } = useDashboardStats();
  const { data: trend } = useRequestsTrend(30);
  const { data: regions } = useDonorsByRegion();
  const { data: inventory } = useInventoryOverview();

  if (isLoading) return <FullPageSpinner />;

  // Flatten donations by blood type for chart
  const donationData = stats?.donationsByBloodType
    ? Object.entries(stats.donationsByBloodType).map(([bt, count]) => ({
        bloodType: bt,
        donations: count,
        fill: BT_COLORS[bt] ?? "#e51414",
      }))
    : [];

  // Critical inventory summary
  const criticalTypes = inventory
    ? Object.entries(inventory).filter(([, v]: any) => (v as any).criticalHospitals?.length > 0)
    : [];

  return (
    <div className="page-container space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-stone-900">Analytics dashboard</h1>
        <p className="text-stone-500 text-sm mt-1">Ministry of Health — DonorLink national overview</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total registered donors" value={stats?.totalDonors?.toLocaleString() ?? "—"} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Active donors" value={stats?.activeDonors?.toLocaleString() ?? "—"} icon={<Droplets className="w-4 h-4" />} />
        <StatCard label="Total requests" value={stats?.totalRequests?.toLocaleString() ?? "—"} icon={<ClipboardList className="w-4 h-4" />} />
        <StatCard
          label="Fulfillment rate"
          value={stats ? `${Math.round((stats.fulfilledRequests / Math.max(stats.totalRequests, 1)) * 100)}%` : "—"}
          icon={<TrendingUp className="w-4 h-4" />}
        />
      </div>

      {/* Critical inventory alert */}
      {criticalTypes.length > 0 && (
        <Card className="p-5 border-red-100 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <h2 className="text-sm font-semibold text-red-800">
              Critical national blood shortage — {criticalTypes.length} blood type{criticalTypes.length > 1 ? "s" : ""}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {criticalTypes.map(([bt, data]: any) => (
              <div key={bt} className="p-3 bg-white rounded-xl border border-red-100">
                <p className="text-lg font-bold text-red-700">{bt}</p>
                <p className="text-xs text-stone-500 mt-0.5">{data.criticalHospitals.length} hospitals critical</p>
                <p className="text-xs font-medium text-stone-700">{data.totalUnits} units total</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Charts row */}
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Requests trend */}
        <Card className="p-5">
          <h2 className="section-title text-base mb-4">Requests — last 30 days</h2>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trend ?? []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="_id" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(5)} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }}
              />
              <Line type="monotone" dataKey="total" stroke="#e51414" strokeWidth={2} dot={false} name="Total" />
              <Line type="monotone" dataKey="fulfilled" stroke="#059669" strokeWidth={2} dot={false} name="Fulfilled" />
              <Line type="monotone" dataKey="critical" stroke="#d97706" strokeWidth={1.5} dot={false} strokeDasharray="4 2" name="Critical" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Donations by blood type */}
        <Card className="p-5">
          <h2 className="section-title text-base mb-4">Donations by blood type</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={donationData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="bloodType" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e7e5e4", fontSize: 12 }} />
              <Bar dataKey="donations" name="Donations" radius={[6, 6, 0, 0]}>
                {donationData.map((entry) => (
                  <Cell key={entry.bloodType} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Donors by region */}
      <Card className="p-5">
        <h2 className="section-title text-base mb-4">Donors by region</h2>
        <div className="space-y-2">
          {(regions ?? []).map((r: any) => {
            const pct = r.total > 0 ? Math.round((r.active / r.total) * 100) : 0;
            return (
              <div key={r._id} className="flex items-center gap-4">
                <p className="text-sm text-stone-700 w-40 flex-shrink-0 truncate">{r._id}</p>
                <div className="flex-1 bg-stone-100 rounded-full h-2">
                  <div
                    className="bg-brand-500 h-2 rounded-full transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <p className="text-xs text-stone-500 w-24 text-right flex-shrink-0">
                  {r.active}/{r.total} active
                </p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}