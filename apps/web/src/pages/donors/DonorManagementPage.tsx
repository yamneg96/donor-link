import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useDonors } from "../../hooks/useApi";

export default function DonorManagementPage() {
  const { data: donors, isLoading } = useDonors({ limit: 20 });
  const items = Array.isArray(donors?.items || donors) ? (donors?.items || donors) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Donor Management Intelligence</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">National donor registry and eligibility management.</p>
        </div>
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center">
          <h3 className="text-title-sm">Donor Registry</h3>
          <div className="relative">
            <MaterialIcon icon="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
            <input className="pl-8 pr-3 py-1.5 border border-m3-outline-variant rounded bg-m3-surface-container-lowest text-body-compact focus:border-m3-primary focus:ring-1 focus:ring-m3-primary w-64" placeholder="Search donors..." />
          </div>
        </div>
        {items.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Donor</th><th className="p-3">Blood Type</th><th className="p-3">Total Donations</th><th className="p-3">Last Donation</th><th className="p-3 text-center">Eligible</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((d: any) => (
                <tr key={d._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3">{d.userId?.firstName || "—"} {d.userId?.lastName || ""}</td>
                  <td className="p-3"><span className="bg-m3-primary-fixed text-m3-on-surface px-2 py-0.5 rounded font-bold">{d.bloodType}</span></td>
                  <td className="p-3">{d.totalDonations}</td>
                  <td className="p-3">{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : "Never"}</td>
                  <td className="p-3 text-center"><span className={`inline-block w-2 h-2 rounded-full ${d.isEligible ? "bg-green-500" : "bg-m3-error"}`} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="group" title="No donors found" description="Donor records will appear here once registered." />
        )}
      </div>
    </div>
  );
}
