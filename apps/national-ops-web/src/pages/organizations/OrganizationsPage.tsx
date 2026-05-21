import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useOrganizations, useDeleteOrganization } from "../../hooks/useApi";
import { useModal } from "../../hooks/useModal";
import { CreateOrganizationModal } from "../../components/modals/CreateOrganizationModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";
import { toast } from "sonner";

export default function OrganizationsPage() {
  const { data: orgs, isLoading } = useOrganizations();
  const deleteOrg = useDeleteOrganization();
  const createModal = useModal();
  const deleteModal = useModal<string>();

  const items = Array.isArray(orgs?.items || orgs) ? (orgs?.items || orgs) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const handleDelete = async () => {
    if (!deleteModal.data) return;
    try {
      await deleteOrg.mutateAsync(deleteModal.data);
      toast.success("Organization deleted");
      deleteModal.close();
    } catch { toast.error("Failed to delete organization"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Organizations</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Manage hospitals, blood banks, and regional centers.</p>
        </div>
        <button onClick={() => createModal.open()} className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="add" size={18} /> Add Organization
        </button>
      </div>
      {items.length > 0 ? (
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Name</th><th className="p-3">Type</th><th className="p-3">Region</th><th className="p-3">Status</th><th className="p-3 text-center">Actions</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((o: any) => (
                <tr key={o._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3 text-body-compact font-semibold text-m3-on-surface">{o.name}</td>
                  <td className="p-3">{o.type?.replace(/_/g, " ")}</td>
                  <td className="p-3">{o.region}</td>
                  <td className="p-3"><span className={`text-label-caps px-2 py-0.5 rounded ${o.status === "active" ? "bg-green-100 text-green-800" : "bg-m3-surface-variant"}`}>{o.status}</span></td>
                  <td className="p-3 text-center">
                    <button onClick={() => deleteModal.open(o._id)} className="text-m3-error hover:text-m3-on-error-container text-label-caps">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyState icon="account_balance" title="No organizations" description="Organizations will appear here." />
      )}
      <CreateOrganizationModal open={createModal.isOpen} onClose={createModal.close} />
      <ConfirmDialog open={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Delete Organization" message="This action cannot be undone. All related data may be affected." confirmLabel="Delete" isLoading={deleteOrg.isPending} />
    </div>
  );
}
