import { useState } from "react";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { EmptyState, LoadingSkeleton } from "../../components/shared/EmptyState";
import { useAuditLogs } from "../../hooks/useApi";

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const { data: logs, isLoading } = useAuditLogs({ page, limit: 20 });
  const items = Array.isArray(logs?.items || logs) ? (logs?.items || logs) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={8} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Audit Log</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">Immutable record of all system actions.</p>
      </div>
      {items.length > 0 ? (
        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Timestamp</th><th className="p-3">Action</th><th className="p-3">Resource</th><th className="p-3">Performed By</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {items.map((l: any) => (
                <tr key={l._id} className="hover:bg-m3-surface-container-low">
                  <td className="p-3">{new Date(l.timestamp || l.createdAt).toLocaleString()}</td>
                  <td className="p-3">{l.action}</td>
                  <td className="p-3">{l.resource} #{l.resourceId?.slice(-6)}</td>
                  <td className="p-3">{l.performedBy?.slice(-6)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-3 flex justify-end gap-1 border-t border-m3-outline-variant">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} className="p-1 border border-m3-outline-variant rounded"><MaterialIcon icon="chevron_left" size={18} /></button>
            <button onClick={() => setPage((p) => p + 1)} className="p-1 border border-m3-outline-variant rounded"><MaterialIcon icon="chevron_right" size={18} /></button>
          </div>
        </div>
      ) : (
        <EmptyState icon="history" title="No audit logs" description="System actions will be recorded here." />
      )}
    </div>
  );
}
