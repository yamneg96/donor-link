import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useOrganizations } from "../../hooks/useApi";

export default function OrganizationsPage() {
  const { data: orgs, isLoading } = useOrganizations();
  const items = Array.isArray(orgs?.items || orgs) ? (orgs?.items || orgs) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Organizations</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Manage hospitals, blood banks, and regional centers.</p>
        </div>
        <button className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="add" size={18} /> Add Organization
        </button>
      </div>
      {items.length > 0 ? (
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Region</th><th className="p-3">Status</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((o: any) => (
                <tr key={o._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3 text-body-compact font-semibold text-m3-on-surface">{o.name}</td>
                  <td className="p-3">{o.type?.replace(/_/g, " ")}</td>
                  <td className="p-3">{o.region}</td>
                  <td className="p-3"><span className={`text-label-caps px-2 py-0.5 rounded ${o.status === "active" ? "bg-green-100 text-green-800" : "bg-m3-surface-variant"}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="account_balance" title="No organizations" description="Organizations will appear here." />
      )}
    </div>
  );
}
