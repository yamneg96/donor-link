import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import {
  useNationalAnalytics,
  useWastageAnalytics,
  useDonorAnalytics,
  useTransferAnalytics,
  useStockByOrg,
} from "../../hooks/useApi";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

const COLOR_MAP: Record<string, string> = {
  "O+": "#DC2626", "A+": "#2563EB", "B+": "#16A34A", "AB+": "#9333EA",
  "O-": "#EA580C", "A-": "#0891B2", "B-": "#65A30D", "AB-": "#C026D3"
};

export default function AnalyticsPage() {
  const { data: national, isLoading: isNationalLoading } = useNationalAnalytics();
  const { data: wastage, isLoading: isWastageLoading } = useWastageAnalytics();
  const { data: donorStats, isLoading: isDonorLoading } = useDonorAnalytics();
  const { data: transferStats, isLoading: isTransferLoading } = useTransferAnalytics();
  const { data: stockByOrg, isLoading: isStockLoading } = useStockByOrg();

  const isLoading = isNationalLoading || isWastageLoading || isDonorLoading || isTransferLoading || isStockLoading;

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  // 1. KPI Calculations
  const totalDonations = donorStats?.donationsTrend?.reduce((acc: number, cur: any) => acc + (cur.count || 0), 0) || national?.totalUnits || 0;
  const activeDonors = donorStats?.totalDonors || 0;
  const totalWasted = (wastage?.expired || 0) + (wastage?.discarded || 0);
  const totalTransfers = transferStats?.byStatus?.reduce((acc: number, cur: any) => acc + (cur.count || 0), 0) || 0;

  // 2. Supply vs. Demand Trend Merger
  const mergeTrendData = () => {
    const donationTrend = donorStats?.donationsTrend || [];
    const transferTrend = transferStats?.trend || [];
    const monthsMap: Record<string, { supply: number; demand: number }> = {};

    donationTrend.forEach((item: any) => {
      const m = item._id; // "YYYY-MM"
      if (m) {
        if (!monthsMap[m]) monthsMap[m] = { supply: 0, demand: 0 };
        monthsMap[m].supply += item.count || 0;
      }
    });

    transferTrend.forEach((item: any) => {
      const m = item._id; // "YYYY-MM"
      if (m) {
        if (!monthsMap[m]) monthsMap[m] = { supply: 0, demand: 0 };
        monthsMap[m].demand += item.count || 0;
      }
    });

    const merged = Object.keys(monthsMap)
      .sort()
      .map((m) => {
        const [year, month] = m.split("-");
        const date = new Date(parseInt(year), parseInt(month) - 1, 1);
        const monthName = date.toLocaleString("default", { month: "short", year: "2-digit" });
        return {
          month: monthName,
          supply: monthsMap[m].supply,
          demand: monthsMap[m].demand,
        };
      });

    // Fallback if no trend data yet
    if (merged.length === 0) {
      return [{ month: "Current", supply: totalDonations, demand: totalTransfers }];
    }
    return merged;
  };

  const supplyDemandData = mergeTrendData();

  // 3. Blood Type Distribution
  const bloodTypeDistribution = (national?.unitsByBloodType || []).map((item: any) => ({
    name: item._id,
    value: item.count || 0,
    color: COLOR_MAP[item._id] || "#6B7280"
  })).sort((a, b) => b.value - a.value);

  // 4. Regional / Hospital Distribution
  const getRegionalStockData = () => {
    const orgStockMap: Record<string, number> = {};
    const stockList = Array.isArray(stockByOrg)
      ? stockByOrg
      : Array.isArray(stockByOrg?.stock)
      ? stockByOrg.stock
      : Array.isArray(stockByOrg?.items)
      ? stockByOrg.items
      : [];

    stockList.forEach((item: any) => {
      const name = item.organizationName || "Unknown Org";
      orgStockMap[name] = (orgStockMap[name] || 0) + (item.count || 0);
    });

    const mapped = Object.keys(orgStockMap).map((name) => ({
      region: name.replace(" Hospital", "").replace(" Blood Bank", ""),
      units: orgStockMap[name],
    })).sort((a, b) => b.units - a.units).slice(0, 8);

    if (mapped.length === 0) {
      return [{ region: "No Stock", units: 0 }];
    }
    return mapped;
  };

  const regionalData = getRegionalStockData();

  // 5. Wastage Analysis
  const wastageByBloodTypeData = (wastage?.wastageByBloodType || []).map((item: any) => ({
    bloodType: item._id,
    units: item.count || 0,
    color: COLOR_MAP[item._id] || "#DC2626"
  })).sort((a, b) => b.units - a.units);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Analytics & Forecasting</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">National analytics dashboard with trends and forecasts.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Donations", value: totalDonations, icon: "favorite", trend: "+12%", color: "text-green-600" },
          { label: "Active Donors", value: activeDonors, icon: "group", trend: "+8%", color: "text-green-600" },
          { label: "Units Wasted", value: totalWasted, icon: "delete", trend: "-23%", color: "text-green-600" },
          { label: "Transfers", value: totalTransfers, icon: "swap_horiz", trend: "+15%", color: "text-green-600" },
        ].map((s) => (
          <div key={s.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md">
            <div className="flex justify-between items-start mb-3">
              <span className="text-title-sm text-m3-on-surface-variant text-sm">{s.label}</span>
              <MaterialIcon icon={s.icon} className="text-m3-secondary" />
            </div>
            <div className="text-display-lg text-m3-on-surface text-3xl font-bold">{s.value.toLocaleString()}</div>
            <p className={`text-label-caps mt-1 ${s.color}`}>Active status from registry</p>
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
              <Line type="monotone" dataKey="supply" stroke="#2563EB" strokeWidth={2.5} dot={{ r: 3 }} name="Supply (Donations)" />
              <Line type="monotone" dataKey="demand" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 3 }} name="Demand (Transfers)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Blood Type Distribution */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="pie_chart" size={20} className="text-m3-primary" /> Blood Type Distribution (Available Units)
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            {bloodTypeDistribution.length > 0 ? (
              <PieChart>
                <Pie
                  data={bloodTypeDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name} (${value})`}
                >
                  {bloodTypeDistribution.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
              </PieChart>
            ) : (
              <div className="flex h-full items-center justify-center text-body-main text-m3-on-surface-variant">
                No inventory units available in stock.
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Regional Distribution */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="bar_chart" size={20} className="text-m3-primary" /> Inventory Stock by Organization
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={regionalData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-m3-outline-variant, #ccc)" />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <YAxis dataKey="region" type="category" width={110} tick={{ fontSize: 10 }} stroke="var(--color-m3-on-surface-variant, #666)" />
              <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
              <Bar dataKey="units" fill="#2563EB" name="Available Units" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Wastage Trends */}
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
            <MaterialIcon icon="trending_down" size={20} className="text-m3-error" /> Wastage Analysis by Blood Type
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            {wastageByBloodTypeData.length > 0 ? (
              <BarChart data={wastageByBloodTypeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-m3-outline-variant, #ccc)" />
                <XAxis dataKey="bloodType" tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
                <YAxis tick={{ fontSize: 11 }} stroke="var(--color-m3-on-surface-variant, #666)" />
                <Tooltip contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: 12 }} />
                <Bar dataKey="units" fill="#DC2626" name="Wasted Units (Expired/Discarded)">
                  {wastageByBloodTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            ) : (
              <div className="flex h-full items-center justify-center text-body-main text-m3-on-surface-variant">
                Zero blood unit wastage recorded in the system.
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
