import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useCampaigns } from "../../hooks/useApi";

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useCampaigns();
  const items = Array.isArray(campaigns?.items || campaigns) ? (campaigns?.items || campaigns) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Donor Recruitment Campaigns</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Create and manage targeted blood donation campaigns.</p>
        </div>
        <button className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
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
                <div className="w-full bg-m3-surface-variant rounded-full h-2 mt-3">
                  <div className="bg-m3-primary h-2 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <p className="text-data-mono text-m3-on-surface-variant mt-1">{pct}% complete</p>
              </div>
            );
          })}
        </div>
      ) : (
        <EmptyState icon="campaign" title="No campaigns" description="Create your first campaign." />
      )}
    </div>
  );
}
