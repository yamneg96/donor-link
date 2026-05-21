import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useTransfers } from "../../hooks/useApi";

export default function OperationsPage() {
  const { data: transfers, isLoading } = useTransfers({ status: "dispatched" });
  const items = Array.isArray(transfers?.items || transfers) ? (transfers?.items || transfers) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Transfer Operations & Logistics</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Active dispatches, tracking, and shipment management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "In Transit", icon: "local_shipping", value: items.filter((t: any) => t.status === "dispatched" || t.status === "in_transit").length },
          { label: "Delivered Today", icon: "check_circle", value: items.filter((t: any) => t.status === "received").length },
          { label: "Pending Dispatch", icon: "schedule", value: items.filter((t: any) => t.status === "approved").length },
        ].map((s) => (
          <div key={s.label} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg p-5 shadow-ambient-md">
            <div className="flex justify-between items-start mb-3">
              <span className="text-title-sm text-m3-on-surface">{s.label}</span>
              <MaterialIcon icon={s.icon} className="text-m3-secondary" />
            </div>
            <div className="text-display-lg text-m3-on-surface">{s.value}</div>
          </div>
        ))}
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="p-4 border-b border-m3-outline-variant">
          <h3 className="text-title-sm text-m3-on-surface">Active Shipments</h3>
        </div>
        {items.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Transfer ID</th><th className="p-3">Blood Type</th><th className="p-3">Qty</th><th className="p-3">Status</th><th className="p-3">Urgency</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((t: any) => (
                <tr key={t._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3">#{t._id?.slice(-6)}</td>
                  <td className="p-3"><span className="bg-m3-surface-variant px-2 py-0.5 rounded font-bold">{t.bloodType}</span></td>
                  <td className="p-3">{t.quantity}</td>
                  <td className="p-3"><span className={`text-label-caps px-2 py-0.5 rounded ${t.status === "dispatched" ? "bg-blue-100 text-blue-800" : "bg-m3-surface-variant"}`}>{t.status}</span></td>
                  <td className="p-3"><span className={`text-label-caps ${t.urgency === "emergency" ? "text-m3-error" : ""}`}>{t.urgency}</span></td>
                  <td className="p-3 text-center">
                    <button className="text-label-caps text-m3-primary hover:underline">Track</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="local_shipping" title="No active shipments" description="Dispatched transfers will appear here." />
        )}
      </div>
    </div>
  );
}
