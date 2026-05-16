import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useCampaigns, useDeleteCampaign } from "../../hooks/useApi";
import { useModal } from "../../hooks/useModal";
import { CreateCampaignModal } from "../../components/modals/CreateCampaignModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";
import { toast } from "sonner";

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const deleteCampaign = useDeleteCampaign();
  const createModal = useModal();
  const deleteModal = useModal<string>();
  const items = Array.isArray(campaigns?.items || campaigns) ? (campaigns?.items || campaigns) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const handleDelete = async () => {
    if (!deleteModal.data) return;
    try {
      await deleteCampaign.mutateAsync(deleteModal.data);
      toast.success("Campaign deleted");
      deleteModal.close();
    } catch { toast.error("Failed to delete campaign"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Donor Recruitment Campaigns</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Create and manage targeted blood donation campaigns.</p>
        </div>
        <button onClick={() => createModal.open()} className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="add" size={18} /> New Campaign
        </button>
      </div>
      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map((c: any) => {
            const pct = c.goalUnits ? Math.round((c.collectedUnits / c.goalUnits) * 100) : 0;
            return (
              <div key={c._id} className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-5 shadow-ambient-md">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-title-sm text-m3-on-surface">{c.title}</h3>
                  <span className="text-label-caps px-2 py-1 rounded bg-green-100 text-green-800">{c.status}</span>
                </div>
                <p className="text-body-compact text-m3-on-surface-variant mb-3">{c.description}</p>
                <div className="w-full bg-m3-surface-variant rounded-full h-2 mt-3">
                  <div className="bg-m3-primary h-2 rounded-full transition-all duration-500" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-data-mono text-m3-on-surface-variant">{pct}% • {c.collectedUnits || 0}/{c.goalUnits} units</p>
                  <button onClick={() => deleteModal.open(c._id)} className="text-m3-error text-label-caps hover:underline">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="campaign" title="No campaigns" description="Create your first campaign." />
      )}
      <CreateCampaignModal open={createModal.isOpen} onClose={createModal.close} />
      <ConfirmDialog open={deleteModal.isOpen} onClose={deleteModal.close} onConfirm={handleDelete} title="Delete Campaign" message="This will permanently delete this campaign." confirmLabel="Delete" isLoading={deleteCampaign.isPending} />
    </div>
  );
}
