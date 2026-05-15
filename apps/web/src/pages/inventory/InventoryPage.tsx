import { useState } from "react";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useStockLevels, useInventoryAll } from "../../hooks/useApi";
import { BloodTypeCard } from "../../components/shared/BloodTypeCard";
import { DataTable } from "../../components/shared/DataTable";
import { cn } from "../../lib/utils";

export default function InventoryPage() {
  const { data: stockLevels, isLoading: stockLoading } = useStockLevels();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { data: units, isLoading: unitsLoading } = useInventoryAll({ page, limit: 10, search: search || undefined });

  if (stockLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const stockData = Array.isArray(stockLevels) ? stockLevels : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <span className="text-label-caps text-m3-secondary">LIVE SYNC: ACTIVE</span>
          </div>
          <h2 className="text-display-lg text-m3-on-surface">Hospital Inventory</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-1">Real-time inventory management and local orchestration.</p>
        </div>
        <div className="flex gap-3">
          <button className="border border-m3-outline text-m3-secondary text-title-sm py-2.5 px-5 rounded hover:bg-m3-surface-container transition-colors text-sm">Scan Unit In</button>
          <button className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-1 hover:opacity-90 transition-opacity text-sm">
            <MaterialIcon icon="add" filled size={18} /> Manual Entry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Main: Stock Levels + Table */}
        <div className="lg:col-span-8 space-y-4">
          <h3 className="text-headline-md text-m3-on-surface flex items-center gap-2">
            <MaterialIcon icon="bloodtype" />Current Stock Levels
          </h3>

          {/* Blood Type Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stockData.length > 0 ? stockData.map((s: any) => (
              <BloodTypeCard
                key={s.bloodType}
                bloodType={s.bloodType}
                available={s.available}
                target={s.target}
              />
            )) : (
              ["O-", "O+", "A+", "B+", "A-", "B-", "AB+", "AB-"].map((bt) => (
                <BloodTypeCard key={bt} bloodType={bt} available={0} />
              ))
            )}
          </div>

          {/* Unit Register Table */}
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden mt-6 shadow-ambient-md">
            <div className="p-4 bg-m3-surface border-b border-m3-outline-variant flex justify-between items-center">
              <h4 className="text-title-sm">Unit Register</h4>
              <div className="relative">
                <MaterialIcon icon="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 border border-m3-outline-variant rounded bg-m3-surface-container-lowest text-body-compact focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary w-64"
                  placeholder="Search Unit ID..."
                />
              </div>
            </div>
            
            <DataTable
              isLoading={unitsLoading}
              data={Array.isArray(units?.items || units) ? (units?.items || units) : []}
              columns={[
                { header: "Unit ID", accessor: (u: any) => `#${u.barcode || u._id?.slice(-6)}` },
                { 
                  header: "Type", 
                  accessor: (u: any) => (
                    <span className="bg-m3-surface-variant px-2 py-1 rounded font-bold">{u.bloodType}</span>
                  ) 
                },
                { header: "Component", accessor: (u: any) => u.componentType?.replace(/_/g, " ") },
                { header: "Collection", accessor: (u: any) => u.collectionDate ? new Date(u.collectionDate).toLocaleDateString() : "—" },
                { 
                  header: "Days to Expiry", 
                  align: "right",
                  accessor: (u: any) => {
                    const days = u.expiryDate ? Math.ceil((new Date(u.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;
                    return (
                      <span className={cn(days !== null && days < 5 ? "text-m3-error font-bold" : days !== null && days < 10 ? "text-yellow-600 font-bold" : "")}>
                        {days !== null ? `${days} Days` : "—"}
                      </span>
                    );
                  }
                },
                { 
                  header: "Status", 
                  align: "center",
                  accessor: (u: any) => (
                    <span className={cn("inline-block w-2 h-2 rounded-full", 
                      u.status === "available" ? "bg-green-500" : u.status === "reserved" ? "bg-yellow-500" : u.status === "expired" ? "bg-m3-error" : "bg-m3-secondary"
                    )} />
                  ) 
                },
              ]}
            />

            <div className="p-3 bg-m3-surface flex justify-between items-center border-t border-m3-outline-variant text-body-compact text-m3-secondary">
              <span>Page {page}</span>
              <div className="flex gap-1">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1 border border-m3-outline-variant rounded hover:bg-m3-surface-container">
                  <MaterialIcon icon="chevron_left" size={18} />
                </button>
                <button onClick={() => setPage((p) => p + 1)} className="p-1 border border-m3-outline-variant rounded hover:bg-m3-surface-container">
                  <MaterialIcon icon="chevron_right" size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          {/* AI Insights */}
          <div className="bg-[#F5F3FF] border-l-4 border-m3-tertiary rounded-r-lg p-4 shadow-sm">
            <div className="flex items-start gap-2 mb-3">
              <MaterialIcon icon="smart_toy" filled className="text-m3-tertiary" />
              <h4 className="text-title-sm text-m3-on-surface">System Insights</h4>
            </div>
            <div className="space-y-3">
              <div className="bg-m3-surface-container-lowest p-3 rounded border border-m3-tertiary-fixed">
                <p className="text-body-compact text-m3-on-surface">
                  <strong className="text-m3-tertiary">Surplus Detected:</strong> B+ inventory above target. Consider redistributing units.
                </p>
                <button className="mt-1 text-m3-tertiary text-label-caps hover:underline">Initiate Transfer →</button>
              </div>
              <div className="bg-m3-error-container p-3 rounded border border-m3-error">
                <p className="text-body-compact text-m3-on-error-container">
                  <strong className="text-m3-error">Critical Low:</strong> O- stock is critically low. Forecasted usage exceeds supply within 48 hours.
                </p>
                <button className="mt-1 text-m3-error text-label-caps hover:underline">Request Emergency Stock →</button>
              </div>
            </div>
          </div>

          {/* Active Transfers */}
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-4 shadow-ambient-md">
            <h4 className="text-title-sm text-m3-on-surface mb-4 flex items-center justify-between">
              Active Transfers
              <MaterialIcon icon="local_shipping" className="text-m3-secondary" size={18} />
            </h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-m3-surface rounded border border-m3-outline-variant">
                <div className="w-8 h-8 rounded bg-m3-secondary-container text-m3-on-secondary-container flex items-center justify-center">
                  <MaterialIcon icon="download" size={16} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-baseline">
                    <p className="text-data-mono font-bold">20x O+</p>
                    <span className="text-label-caps text-m3-secondary">ETA: 2h 15m</span>
                  </div>
                  <p className="text-body-compact text-m3-on-surface-variant text-xs">From: Regional Hub Adama</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
