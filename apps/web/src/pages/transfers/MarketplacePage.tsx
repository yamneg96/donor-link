import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useTransfers } from "../../hooks/useApi";

export default function MarketplacePage() {
  const { data: transfers, isLoading } = useTransfers();
  const items = Array.isArray(transfers?.items || transfers) ? (transfers?.items || transfers) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Transfer Marketplace</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Surplus-deficit matching and redistribution hub.</p>
        </div>
        <button className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 transition-opacity text-sm">
          <MaterialIcon icon="add" size={18} /> New Transfer Request
        </button>
      </div>

      {items.length > 0 ? (
        <div className="grid gap-4">
          {items.map((t: any) => (
            <div key={t._id} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md hover:border-m3-secondary transition-colors">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-m3-secondary-container flex items-center justify-center">
                    <MaterialIcon icon="swap_horiz" className="text-m3-on-secondary-container" size={20} />
                  </div>
                  <div>
                    <p className="text-title-sm text-m3-on-surface">{t.bloodType} • {t.quantity} units</p>
                    <p className="text-body-compact text-m3-on-surface-variant">{t.urgency} priority</p>
                  </div>
                </div>
                <span className={`text-label-caps px-3 py-1 rounded-full ${
                  t.status === "pending" ? "bg-yellow-100 text-yellow-800" : t.status === "approved" ? "bg-green-100 text-green-800" : t.status === "dispatched" ? "bg-blue-100 text-blue-800" : "bg-m3-surface-variant text-m3-on-surface-variant"
                }`}>{t.status}</span>
              </div>
              <div className="flex gap-2 mt-3">
                {t.status === "pending" && (
                  <>
                    <button className="px-4 py-2 bg-m3-primary text-m3-on-primary rounded text-label-caps hover:opacity-90 transition-opacity">Approve</button>
                    <button className="px-4 py-2 border border-m3-outline-variant text-m3-on-surface rounded text-label-caps hover:bg-m3-surface-variant transition-colors">Reject</button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="swap_horiz" title="No transfer requests" description="Transfer marketplace entries will appear here." />
      )}
    </div>
  );
}
