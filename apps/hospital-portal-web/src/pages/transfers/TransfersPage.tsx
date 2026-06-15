import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useReceiveDispatch, useHospitalDashboard } from "../../hooks/useApi";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "../../api/client";
import { toast } from "sonner";
import { cn } from "../../lib/utils";

export default function TransfersPage() {
  const { data: dashboard } = useHospitalDashboard();
  const hospitalId = dashboard?.hospital?._id;

  const { data: transfers, isLoading } = useQuery({
    queryKey: ["transfers", "inbound", hospitalId],
    queryFn: () => apiClient.get(`/transfers/inbound/${hospitalId}`).then(r => r.data.data),
    enabled: !!hospitalId,
  });

  const receiveDispatch = useReceiveDispatch();

  const handleReceive = async (id: string) => {
    try {
      await receiveDispatch.mutateAsync(id);
      toast.success("Dispatch received and inventory updated");
    } catch {
      toast.error("Failed to receive dispatch");
    }
  };

  const activeItems = transfers?.items?.filter((t: any) => t.status === 'dispatched') || [];

  return (
    <div className="flex-1 p-container-padding-desktop flex flex-col gap-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface tracking-tight">Logistics & Transfers</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Manage incoming blood shipments and coordinate urgent redistributions.</p>
        </div>
        <button className="bg-m3-secondary text-m3-on-secondary px-6 py-2.5 rounded-lg font-bold hover:opacity-90 flex items-center gap-2">
          <MaterialIcon icon="local_shipping" size={20} /> Request Shipment
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl overflow-hidden shadow-ambient-md">
            <div className="px-6 py-4 border-b border-m3-outline-variant flex justify-between items-center bg-m3-surface-container-low/30">
              <h3 className="text-title-medium font-bold text-m3-on-surface">Inbound Shipments</h3>
              <span className="bg-blue-100 text-blue-800 text-[10px] px-2 py-0.5 rounded-full font-bold">{activeItems.length} En Route</span>
            </div>
            
            {isLoading ? (
              <div className="p-6"><LoadingSkeleton rows={5} /></div>
            ) : activeItems.length > 0 ? (
              <table className="w-full text-left">
                <thead className="bg-m3-surface-container-low text-m3-on-surface-variant text-label-caps border-b border-m3-outline-variant">
                  <tr>
                    <th className="px-6 py-4">Transfer ID</th>
                    <th className="px-6 py-4">From</th>
                    <th className="px-6 py-4">Units</th>
                    <th className="px-6 py-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-m3-outline-variant">
                  {activeItems.map((item: any) => (
                    <tr key={item._id} className="hover:bg-m3-surface-container-low transition-colors">
                      <td className="px-6 py-4 font-mono font-bold text-m3-on-surface">#{item._id.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4 text-m3-on-surface">National/Regional Bank</td>
                      <td className="px-6 py-4 text-m3-on-surface font-semibold">{item.units?.length} units</td>
                      <td className="px-6 py-4 text-center">
                        <button 
                          onClick={() => handleReceive(item._id)}
                          disabled={receiveDispatch.isPending}
                          className="bg-green-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          Confirm Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <EmptyState icon="local_shipping" title="No incoming dispatches" description="New shipments will appear here once they leave the bank." />
            )}
          </div>
        </div>

        <div className="lg:col-span-4 space-y-4">
          <div className="bg-m3-surface-container-high p-6 rounded-2xl shadow-sm border border-m3-outline-variant">
            <h4 className="text-title-small font-bold text-m3-on-surface mb-3 flex items-center gap-2">
              <MaterialIcon icon="emergency_home" className="text-m3-error" /> Cold Chain Alert
            </h4>
            <p className="text-body-small text-m3-on-surface-variant">All ongoing shipments are currently within compliant temperature ranges (2°C - 6°C).</p>
          </div>
        </div>
      </div>
    </div>
  );
}
