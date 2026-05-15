import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useDashboardStats, useRequestsTrend, useDonorsByRegion, useInventoryOverview } from "../../hooks/useApi";
import { FullPageSpinner } from "../../components/ui";
import { Droplets, Users, ClipboardList, TrendingUp, AlertTriangle } from "lucide-react";
import { cn } from "../../lib/utils";

const BT_COLORS: Record<string, string> = {
  "A+": "var(--color-primary)", "A-": "var(--color-pulse-deep)", "B+": "var(--color-tertiary)", "B-": "var(--color-tertiary-container)",
  "AB+": "var(--color-secondary)", "AB-": "var(--color-secondary-foreground)", "O+": "var(--color-muted-foreground)", "O-": "var(--color-on-surface-variant)",
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
        fill: BT_COLORS[bt] ?? "#b70011",
      }))
    : [];

  // Critical inventory summary
  const criticalTypes = inventory
    ? Object.entries(inventory).filter(([, v]: any) => (v as any).criticalHospitals?.length > 0)
    : [];

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h1 className="font-headline text-4xl md:text-[3.5rem] leading-tight font-extrabold text-on-surface tracking-tight mb-2">
            System Overview
          </h1>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl">
            Ministry of Health — DonorLink national analytics and live logistical metrics.
          </p>
        </div>
      </div>

      {/* ── KPIs Bento Grid ───────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        
        {/* KPI 1 */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-between h-40 transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">Active Donors</p>
              <h4 className="font-headline text-4xl font-extrabold text-on-surface">{stats?.activeDonors?.toLocaleString() ?? "—"}</h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary">
              <Users className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm mt-4">
            <span className="text-tertiary font-bold flex items-center"><TrendingUp className="size-4 mr-1" />+{(stats?.totalDonors ? ((stats.activeDonors / stats.totalDonors) * 100).toFixed(1) : "0")}%</span>
            <span className="text-secondary font-medium">of {stats?.totalDonors?.toLocaleString()} total</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-between h-40 transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">Total Requests</p>
              <h4 className="font-headline text-4xl font-extrabold text-on-surface">{stats?.totalRequests?.toLocaleString() ?? "—"}</h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
              <ClipboardList className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm mt-4">
            <span className="text-primary font-bold flex items-center"><TrendingUp className="size-4 mr-1" /></span>
            <span className="text-secondary font-medium">All time</span>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-between h-40 transition-transform hover:-translate-y-1 duration-300">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-wider text-on-surface-variant mb-1">Fulfillment Rate</p>
              <h4 className="font-headline text-4xl font-extrabold text-on-surface">
                {stats ? `${Math.round((stats.fulfilledRequests / Math.max(stats.totalRequests, 1)) * 100)}%` : "—"}
              </h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center text-tertiary">
              <Droplets className="size-6" />
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm mt-4">
            <span className="text-secondary font-medium">{stats?.fulfilledRequests?.toLocaleString()} fulfilled requests</span>
          </div>
        </div>

        {/* KPI 4: Critical Alerts */}
        <div className="bg-error-container/10 rounded-2xl p-6 border border-error/20 flex flex-col justify-between h-40 relative overflow-hidden transition-transform hover:-translate-y-1 duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error opacity-5 rounded-bl-full pointer-events-none" />
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="font-body font-bold text-xs uppercase tracking-wider text-error mb-1">Flagged Logistics</p>
              <h4 className="font-headline text-4xl font-extrabold text-error">{criticalTypes.length}</h4>
            </div>
            <div className="w-12 h-12 rounded-full bg-error/10 flex items-center justify-center text-error">
              <AlertTriangle className="size-6" />
            </div>
          </div>
          <div className="relative z-10 text-sm font-bold text-error mt-4">
            Critical National Shortages
          </div>
        </div>

      </div>

      {/* ── Critical Inventory Details ─────────────────────────────────── */}
      {criticalTypes.length > 0 && (
        <div className="bg-error-container/10 border border-error/20 rounded-2xl p-6 ambient-shadow">
          <h2 className="text-lg font-headline font-bold text-error mb-4 flex items-center gap-2">
            <AlertTriangle className="size-5" /> Detailed Critical Shortages
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {criticalTypes.map(([bt, data]: any) => (
              <div key={bt} className="bg-white rounded-xl p-4 border border-error/10 flex flex-col items-center text-center">
                <span className="font-headline font-extrabold text-2xl text-error mb-1">{bt}</span>
                <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{data.criticalHospitals.length} Hosp. Critical</span>
                <span className="text-xs font-medium text-on-surface mt-1">{data.totalUnits} total units</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Charts Grid ──────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* Requests trend */}
        <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-6">30-Day Request Volume</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trend ?? []} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="_id" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} tickFormatter={(v) => v.slice(5)} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontSize: 12, fontWeight: 600 }}
                  itemStyle={{ color: '#0f172a' }}
                />
                <Line type="monotone" dataKey="total" stroke="#b70011" strokeWidth={3} dot={false} name="Total Requests" />
                <Line type="monotone" dataKey="fulfilled" stroke="#005e8d" strokeWidth={3} dot={false} name="Fulfilled" />
                <Line type="monotone" dataKey="critical" stroke="#dc2626" strokeWidth={2} dot={false} strokeDasharray="4 4" name="Critical" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donations by blood type */}
        <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
          <h2 className="font-headline text-xl font-bold text-on-surface mb-6">Donations by Blood Type</h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={donationData} margin={{ top: 5, right: 5, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="bloodType" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: 12, border: "none", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)", fontSize: 12, fontWeight: 600 }} 
                />
                <Bar dataKey="donations" name="Donations" radius={[6, 6, 0, 0]} maxBarSize={40}>
                  {donationData.map((entry) => (
                    <Cell key={entry.bloodType} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* ── Geographic Overview ──────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
        <h2 className="font-headline text-xl font-bold text-on-surface mb-6">Regional Donor Distribution</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(regions ?? []).map((r: any) => {
            const pct = r.total > 0 ? Math.round((r.active / r.total) * 100) : 0;
            return (
              <div key={r._id} className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant/50">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-bold text-on-surface truncate pr-2">{r._id}</p>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider">{r.active}/{r.total} Active</p>
                </div>
                <div className="w-full bg-surface-container-high rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-tertiary h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}