import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useAlerts, useAcknowledgeAlert, useResolveAlert } from "../../hooks/useApi";
import { EmptyState } from "../../components/shared/EmptyState";

export default function AlertCenterPage() {
  const { data: alerts, isLoading } = useAlerts();
  const ack = useAcknowledgeAlert();
  const resolve = useResolveAlert();
  const items = Array.isArray(alerts?.items || alerts) ? (alerts?.items || alerts) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">System Alert Center</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Monitor and respond to system-wide alerts.</p>
      </div>
      {items.length > 0 ? (
        <div className="space-y-3">
          {items.map((a: any) => (
            <div key={a._id} className={`bg-m3-surface-container-lowest border rounded-xl p-4 shadow-ambient-md flex items-start gap-4 ${a.severity === "critical" ? "border-m3-error" : a.severity === "warning" ? "border-yellow-500" : "border-m3-outline-variant"}`}>
              <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${a.severity === "critical" ? "bg-m3-error" : a.severity === "warning" ? "bg-yellow-500" : "bg-m3-secondary"}`} />
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-title-sm text-m3-on-surface text-sm">{a.title}</h3>
                    <p className="text-body-compact text-m3-on-surface-variant">{a.message}</p>
                  </div>
                  <span className="text-label-caps px-2 py-1 rounded bg-m3-surface-variant text-m3-on-surface-variant">{a.status}</span>
                </div>
                <div className="flex gap-2 mt-3">
                  {a.status === "active" && (
                    <>
                      <button onClick={() => ack.mutate(a._id)} className="px-3 py-1.5 border border-m3-outline-variant rounded text-label-caps hover:bg-m3-surface-variant">Acknowledge</button>
                      <button onClick={() => resolve.mutate(a._id)} className="px-3 py-1.5 bg-m3-primary text-m3-on-primary rounded text-label-caps hover:opacity-90">Resolve</button>
                    </>
                  )}
                </div>
              </div>
              <span className="text-data-mono text-m3-on-surface-variant shrink-0">{new Date(a.createdAt).toLocaleTimeString()}</span>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="notifications_off" title="No alerts" description="System alerts will appear here." />
      )}
    </div>
  );
}
