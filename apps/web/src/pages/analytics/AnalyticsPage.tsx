import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useNationalAnalytics, useWastageAnalytics, useDonorAnalytics, useTransferAnalytics } from "../../hooks/useApi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

// ── Mock chart data (fed from real analytics when available) ──
const supplyDemandData = [
  { month: "Jan", supply: 420, demand: 380 }, { month: "Feb", supply: 390, demand: 410 },
  { month: "Mar", supply: 450, demand: 430 }, { month: "Apr", supply: 470, demand: 460 },
  { month: "May", supply: 500, demand: 480 }, { month: "Jun", supply: 520, demand: 510 },
  { month: "Jul", supply: 480, demand: 530 }, { month: "Aug", supply: 510, demand: 490 },
  { month: "Sep", supply: 540, demand: 520 }, { month: "Oct", supply: 560, demand: 540 },
  { month: "Nov", supply: 530, demand: 550 }, { month: "Dec", supply: 570, demand: 560 },
];

const bloodTypeDistribution = [
  { name: "O+", value: 38, color: "#DC2626" }, { name: "A+", value: 27, color: "#2563EB" },
  { name: "B+", value: 20, color: "#16A34A" }, { name: "AB+", value: 5, color: "#9333EA" },
  { name: "O-", value: 4, color: "#EA580C" }, { name: "A-", value: 3, color: "#0891B2" },
  { name: "B-", value: 2, color: "#65A30D" }, { name: "AB-", value: 1, color: "#C026D3" },
];

const regionalData = [
  { region: "Addis Ababa", units: 1240 }, { region: "Amhara", units: 890 },
  { region: "Oromia", units: 820 }, { region: "Tigray", units: 650 },
  { region: "SNNPR", units: 540 }, { region: "Sidama", units: 380 },
  { region: "Somali", units: 290 }, { region: "Dire Dawa", units: 210 },
];

const wastageData = [
  { month: "Jan", expired: 12, discarded: 5 }, { month: "Feb", expired: 8, discarded: 7 },
  { month: "Mar", expired: 15, discarded: 3 }, { month: "Apr", expired: 10, discarded: 6 },
  { month: "May", expired: 6, discarded: 4 }, { month: "Jun", expired: 9, discarded: 8 },
  { month: "Jul", expired: 11, discarded: 5 }, { month: "Aug", expired: 7, discarded: 3 },
  { month: "Sep", expired: 13, discarded: 6 }, { month: "Oct", expired: 5, discarded: 2 },
  { month: "Nov", expired: 8, discarded: 4 }, { month: "Dec", expired: 10, discarded: 5 },
];

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

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Donations", value: national?.totalDonations ?? "2,847", icon: "favorite", trend: "+12%", color: "text-green-600" },
          { label: "Active Donors", value: donorStats?.activeDonors ?? "1,203", icon: "group", trend: "+8%", color: "text-green-600" },
          { label: "Units Wasted", value: wastage?.totalWasted ?? "142", icon: "delete", trend: "-23%", color: "text-green-600" },
          { label: "Transfers", value: transferStats?.totalTransfers ?? "456", icon: "swap_horiz", trend: "+15%", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md">
            <div className="flex justify-between items-start mb-3">
              <span className="text-title-sm text-m3-on-surface-variant text-sm">{s.label}</span>
              <MaterialIcon icon={s.icon} className="text-m3-secondary" />
            </div>
            <div className="text-display-lg text-m3-on-surface text-3xl font-bold">{s.value}</div>
            <p className={`text-label-caps mt-1 ${s.color}`}>{s.trend} from last month</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Supply vs Demand */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="show_chart" size={20} className="text-m3-primary" /> Supply vs. Demand Trends
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={supplyDemandData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-m3-outline-variant, #ccc)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="supply" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} name="Supply" />
              <Line type="monotone" dataKey="demand" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 3 }} name="Demand" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Type Distribution */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="pie_chart" size={20} className="text-m3-primary" /> Blood Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={bloodTypeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}>
                {bloodTypeDistribution.map((entry) => <Cell key={entry.name} fill={entry.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regional Distribution */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="bar_chart" size={20} className="text-m3-primary" /> Regional Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-m3-outline-variant, #ccc)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <YAxis dataKey="region" type="category" width={80} tick={{ fontSize: 10 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="units" fill="#2563EB" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wastage Trends */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="trending_down" size={20} className="text-m3-error" /> Wastage Analysis
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={wastageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-m3-outline-variant, #ccc)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <YAxis tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Area type="monotone" dataKey="expired" stackId="1" stroke="#DC2626" fill="#FEE2E2" name="Expired" />
              <Area type="monotone" dataKey="discarded" stackId="1" stroke="#F59E0B" fill="#FEF3C7" name="Discarded" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
