import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useExpiringUnits } from "../../hooks/useApi";

export default function ExpiryRiskPage() {
  const { data: expiring7, isLoading: loading7 } = useExpiringUnits({ days: 7 });
  const { data: expiring14 } = useExpiringUnits({ days: 14 });
  const { data: expiring30 } = useExpiringUnits({ days: 30 });
  const count = (d: any) => (Array.isArray(d?.items || d) ? (d?.items || d).length : 0);

  if (loading7) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Expiry Risk Management</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Monitor and prevent blood unit wastage before expiry.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { days: 7, count: count(expiring7), color: "border-m3-error", textColor: "text-m3-error", icon: "warning" },
          { days: 14, count: count(expiring14), color: "border-yellow-500", textColor: "text-yellow-600", icon: "schedule" },
          { days: 30, count: count(expiring30), color: "border-m3-outline-variant", textColor: "text-m3-on-surface", icon: "hourglass_empty" },
        ].map((t) => (
          <div key={t.days} className={`bg-m3-surface-container-lowest border-2 ${t.color} rounded-xl p-6 shadow-ambient-md`}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-title-sm text-m3-on-surface">{t.days}-Day Window</span>
              <MaterialIcon icon={t.icon} className={t.textColor} />
            </div>
            <div className={`text-display-lg ${t.textColor} mb-1`}>{t.count}</div>
            <p className="text-body-compact text-m3-on-surface-variant">Units at risk</p>
          </div>
        ))}
      </div>

      {/* Expiring Units Table */}
      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center">
          <h3 className="text-title-sm text-m3-on-surface">Units Expiring Within 7 Days</h3>
          <MaterialIcon icon="filter_list" className="text-m3-on-surface-variant" size={20} />
        </div>
        {Array.isArray(expiring7?.items || expiring7) && (expiring7?.items || expiring7).length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr>
                <th className="p-3">Unit ID</th><th className="p-3">Blood Type</th><th className="p-3">Component</th><th className="p-3 text-right">Expiry Date</th><th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {(expiring7?.items || expiring7).map((u: any) => (
                <tr key={u._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3">#{u.barcode || u._id?.slice(-6)}</td>
                  <td className="p-3"><span className="bg-m3-error-container text-m3-on-error-container px-2 py-0.5 rounded font-bold">{u.bloodType}</span></td>
                  <td className="p-3">{u.componentType?.replace(/_/g, " ")}</td>
                  <td className="p-3 text-right text-m3-error font-bold">{new Date(u.expiryDate).toLocaleDateString()}</td>
                  <td className="p-3 text-center">
                    <button className="text-label-caps text-m3-primary hover:underline">Redistribute</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="check_circle" title="No immediate expiry risks" description="All units are within safe expiry windows." />
        )}
      </div>
    </div>
  );
}
