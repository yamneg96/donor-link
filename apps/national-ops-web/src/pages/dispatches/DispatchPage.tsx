import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useTransfers, useHospitals } from "../../hooks/useApi";
import { DataTable } from "../../components/shared/DataTable";
import { Link } from "@tanstack/react-router";
import { cn } from "../../lib/utils";

export default function DispatchPage() {
  const { data: transfers, isLoading } = useTransfers({ type: 'dispatch' });
  const { data: hospitals } = useHospitals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">National Dispatches</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">Track movement of blood units from central/regional hubs to hospitals.</p>
        </div>
        <button className="bg-m3-primary text-m3-on-primary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
          <MaterialIcon icon="add" size={18} /> New Dispatch
        </button>
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <DataTable
          isLoading={isLoading}
          data={transfers?.items || []}
          columns={[
            { header: "Dispatch ID", accessorKey: "_id", cell: (info: any) => <span className="font-mono text-xs">#{info.getValue().slice(-6).toUpperCase()}</span> },
            { header: "Destination", accessorFn: (t: any) => hospitals?.find((h: any) => h._id === t.toOrgId)?.name || "Unknown Hospital" },
            { header: "Units", accessorFn: (t: any) => t.units?.length || 0 },
            { 
              header: "Status", 
              accessorKey: "status",
              cell: (info: any) => {
                const s = info.getValue()?.toLowerCase();
                return (
                  <span className={cn(
                    "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                    s === "dispatched" ? "bg-blue-100 text-blue-700" : 
                    s === "received" ? "bg-green-100 text-green-700" :
                    "bg-m3-surface-variant text-m3-on-surface-variant"
                  )}>
                    {s}
                  </span>
                );
              }
            },
            { header: "Date", accessorFn: (t: any) => new Date(t.createdAt).toLocaleDateString() },
            { 
              header: "Actions", 
              cell: (info: any) => (
                <Link to="/transfers/operations" className="text-m3-primary hover:underline text-xs font-bold">Track</Link>
              )
            }
          ]}
        />
      </div>
    </div>
  );
}
