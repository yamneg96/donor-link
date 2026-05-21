import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useEmergencies, useResolveEmergency } from "../../hooks/useApi";
import { useModal } from "../../hooks/useModal";
import { DeclareEmergencyModal } from "../../components/modals/DeclareEmergencyModal";
import { ConfirmDialog } from "../../components/modals/ConfirmDialog";
import { toast } from "sonner";

export default function EmergencyPage() {
  const { data: emergencies, isLoading } = useEmergencies();
  const resolveEmergency = useResolveEmergency();
  const declareModal = useModal();
  const resolveModal = useModal<string>();
  const items = Array.isArray(emergencies?.items || emergencies) ? (emergencies?.items || emergencies) : [];

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  const handleResolve = async () => {
    if (!resolveModal.data) return;
    try {
      await resolveEmergency.mutateAsync(resolveModal.data);
      toast.success("Emergency resolved");
      resolveModal.close();
    } catch { toast.error("Failed to resolve emergency"); }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">National Emergency Response Center</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Manage critical blood supply emergencies across the network.</p>
        </div>
        <button onClick={() => declareModal.open()} className="bg-m3-error text-m3-on-error text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="emergency" size={18} /> Declare Emergency
        </button>
      </div>
      {items.length > 0 ? (
        <div className="space-y-4">
          {items.map((e: any) => (
            <div key={e._id} className={`bg-m3-surface-container-lowest border rounded-xl p-5 shadow-ambient-md ${e.severity === "critical" ? "border-m3-error" : "border-m3-outline-variant"}`}>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <MaterialIcon icon="emergency" className={e.severity === "critical" ? "text-m3-error" : "text-yellow-600"} filled />
                  <div>
                    <h3 className="text-title-sm text-m3-on-surface">{e.title}</h3>
                    <p className="text-body-compact text-m3-on-surface-variant">{e.description}</p>
                  </div>
                </div>
                <span className={`text-label-caps px-2 py-1 rounded ${e.status === "active" || e.status === "declared" ? "bg-m3-error-container text-m3-on-error-container" : "bg-green-100 text-green-800"}`}>{e.status}</span>
              </div>
              <div className="flex gap-4 mt-3 text-data-mono text-m3-on-surface-variant">
                <span>Regions: {e.affectedRegions?.join(", ")}</span>
                <span>Blood: {e.bloodTypesNeeded?.join(", ")}</span>
              </div>
              {(e.status === "active" || e.status === "declared" || e.status === "responding") && (
                <div className="mt-3">
                  <button onClick={() => resolveModal.open(e._id)} className="px-4 py-2 border border-green-500 text-green-700 rounded text-label-caps hover:bg-green-50 transition-colors">
                    Mark Resolved
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="check_circle" title="No active emergencies" description="All systems operating normally." />
      )}
      <DeclareEmergencyModal open={declareModal.isOpen} onClose={declareModal.close} />
      <ConfirmDialog open={resolveModal.isOpen} onClose={resolveModal.close} onConfirm={handleResolve} title="Resolve Emergency" message="Confirm that this emergency has been fully resolved and response operations are complete." confirmLabel="Resolve" variant="default" isLoading={resolveEmergency.isPending} />
    </div>
  );
}
