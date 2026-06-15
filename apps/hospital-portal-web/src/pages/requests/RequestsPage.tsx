import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useHospitalRequests } from "../../hooks/useApi";
import { useState } from "react";
import { CreateRequestModal } from "../../components/modals/CreateRequestModal";
import { cn } from "../../lib/utils";

export default function RequestsPage() {
  const { data: requests, isLoading } = useHospitalRequests();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const items = requests?.items || [];

  return (
    <div className="flex-1 p-container-padding-desktop flex flex-col gap-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface tracking-tight">Facility Requests</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Track the status of your blood supply requests from ENBB.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-m3-primary text-m3-on-primary px-6 py-2.5 rounded-lg font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <MaterialIcon icon="add_card" size={20} /> New Request
        </button>
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl overflow-hidden shadow-ambient-md">
        <div className="px-6 py-4 border-b border-m3-outline-variant bg-m3-surface-container-low/30 backdrop-blur-sm flex justify-between items-center">
          <h3 className="text-title-medium font-bold text-m3-on-surface">Request Registry</h3>
        </div>

        {isLoading ? (
          <div className="p-6"><LoadingSkeleton rows={6} /></div>
        ) : items.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-m3-on-surface-variant text-label-caps border-b border-m3-outline-variant">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4 text-center">Type</th>
                <th className="px-6 py-4 text-right">Units</th>
                <th className="px-6 py-4 text-center">Urgency</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Date Requested</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-m3-outline-variant text-data-mono">
              {items.map((req: any) => (
                <tr key={req._id} className="hover:bg-m3-surface-container-low transition-colors group">
                  <td className="px-6 py-4">
                    <span className="font-mono text-xs font-bold text-m3-on-surface">#{req._id.slice(-6).toUpperCase()}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="bg-m3-primary-fixed text-m3-on-surface px-2 py-0.5 rounded font-bold text-xs">{req.bloodType}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-m3-on-surface">{req.units}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      req.urgency === 'CRITICAL' ? 'bg-red-100 text-red-700' :
                      req.urgency === 'URGENT' ? 'bg-orange-100 text-orange-700' :
                      'bg-m3-surface-variant text-m3-on-surface-variant'
                    )}>
                      {req.urgency}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      req.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                      req.status === 'ASSIGNED' ? 'bg-blue-100 text-blue-700' :
                      req.status === 'FULFILLED' ? 'bg-green-100 text-green-700' :
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                      'bg-m3-surface-variant text-m3-on-surface-variant'
                    )}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-m3-on-surface-variant">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState 
            icon="post_add" 
            title="No Active Requests" 
            description="Your blood request history will appear here. Submit a new request to coordinate with the National Blood Bank." 
          />
        )}
      </div>

      <CreateRequestModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
