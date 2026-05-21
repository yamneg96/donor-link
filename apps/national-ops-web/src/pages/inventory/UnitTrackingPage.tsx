import { useState } from "react";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useInventoryAll } from "../../hooks/useApi";

export default function UnitTrackingPage() {
  const [barcode, setBarcode] = useState("");
  const { data: units, isLoading } = useInventoryAll({ limit: 20 });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Blood Unit Lifecycle Tracking</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Track every blood unit from collection to transfusion.</p>
      </div>

      {/* Barcode Search */}
      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
        <h3 className="text-title-sm text-m3-on-surface mb-4 flex items-center gap-2">
          <MaterialIcon icon="qr_code_scanner" className="text-m3-primary" />
          Unit Lookup
        </h3>
        <div className="flex gap-3">
          <div className="relative flex-1">
            <MaterialIcon icon="search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
            <input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="Enter barcode or unit ID..." className="w-full pl-10 pr-4 py-3 bg-m3-surface-container-lowest border border-m3-outline-variant rounded focus:border-m3-primary focus:ring-1 focus:ring-m3-primary text-body-main" />
          </div>
          <button className="bg-m3-primary text-m3-on-primary px-6 py-3 rounded text-title-sm hover:opacity-90 transition-opacity text-sm">Search</button>
        </div>
      </div>

      {/* Recent Units */}
      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="p-4 border-b border-m3-outline-variant">
          <h3 className="text-title-sm text-m3-on-surface">Recent Unit Activity</h3>
        </div>
        {isLoading ? (
          <div className="p-6"><LoadingSkeleton rows={5} /></div>
        ) : Array.isArray(units?.items || units) && (units?.items || units).length > 0 ? (
          <div className="divide-y divide-m3-outline-variant">
            {(units?.items || units).map((unit: any) => (
              <div key={unit._id} className="p-4 flex items-center gap-4 hover:bg-m3-surface-container-low transition-colors">
                <div className="w-10 h-10 rounded-lg bg-m3-primary-fixed flex items-center justify-center">
                  <MaterialIcon icon="water_drop" className="text-m3-primary" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-data-mono font-bold">#{unit.barcode || unit._id?.slice(-6)}</span>
                    <span className="text-label-caps px-2 py-0.5 rounded bg-m3-surface-variant">{unit.bloodType}</span>
                  </div>
                  <p className="text-body-compact text-m3-on-surface-variant truncate">{unit.componentType?.replace(/_/g, " ")} • Status: {unit.status}</p>
                </div>
                <span className={`text-label-caps px-2 py-1 rounded ${unit.status === "available" ? "bg-green-100 text-green-800" : unit.status === "expired" ? "bg-m3-error-container text-m3-on-error-container" : "bg-m3-secondary-container text-m3-on-secondary-container"}`}>
                  {unit.status}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState icon="qr_code_scanner" title="No units tracked" description="Blood unit data will appear here." />
        )}
      </div>
    </div>
  );
}
