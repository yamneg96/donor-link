import { useParams, Link } from "@tanstack/react-router";
import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { useOrganization, useHospitalInventory, useHospitalDashboard } from "../../hooks/useApi";
import { BloodTypeCard } from "../../components/shared/BloodTypeCard";
import { DataTable } from "../../components/shared/DataTable";
import { cn } from "../../lib/utils";

export default function HospitalDetailPage() {
  const { id } = useParams({ from: '/organizations/$id' });
  
  const { data: org, isLoading: orgLoading } = useOrganization(id);
  const { data: inventory, isLoading: invLoading } = useHospitalInventory(id);
  const { data: stats, isLoading: statsLoading } = useHospitalDashboard(id);

  if (orgLoading || statsLoading) return <div className="p-6"><LoadingSkeleton rows={10} /></div>;

  return (
    <div className="space-y-6">
      {/* Breadcrumbs & Header */}
      <div className="flex flex-col gap-2">
        <Link to="/organizations" className="flex items-center gap-1 text-m3-secondary hover:text-m3-primary transition-colors text-sm font-medium">
          <MaterialIcon icon="arrow_back" size={16} /> Back to Organizations
        </Link>
        <div className="flex justify-between items-end">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-display-lg text-m3-on-surface">{org?.name}</h2>
              <span className={`text-label-caps px-3 py-1 rounded-full ${org?.status === "active" ? "bg-green-100 text-green-800" : "bg-m3-surface-variant font-bold"}`}>
                {org?.status?.toUpperCase()}
              </span>
            </div>
            <p className="text-body-main text-m3-on-surface-variant mt-1">
              Code: <span className="font-mono font-bold">{org?.code}</span> • Region: {org?.region} • Type: {org?.type}
            </p>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Summary and Stock */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-m3-surface-container-low border border-m3-outline-variant p-4 rounded-xl">
              <p className="text-label-caps text-m3-secondary">Available Stock</p>
              <p className="text-display-sm font-bold text-m3-on-surface">{stats?.availableUnits || 0}</p>
            </div>
            <div className="bg-m3-surface-container-low border border-m3-outline-variant p-4 rounded-xl">
              <p className="text-label-caps text-m3-secondary">Near Expiry</p>
              <p className="text-display-sm font-bold text-m3-error">{stats?.expiringUnits || 0}</p>
            </div>
            <div className="bg-m3-surface-container-low border border-m3-outline-variant p-4 rounded-xl">
              <p className="text-label-caps text-m3-secondary">Transfusions (30d)</p>
              <p className="text-display-sm font-bold text-m3-tertiary">{stats?.transfusionsLastMonth || 0}</p>
            </div>
            <div className="bg-m3-surface-container-low border border-m3-outline-variant p-4 rounded-xl">
              <p className="text-label-caps text-m3-secondary">Pending Inbound</p>
              <p className="text-display-sm font-bold text-m3-secondary">{stats?.pendingTransfersIn || 0}</p>
            </div>
          </div>

          {/* Blood Type Breakdown */}
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant p-6 rounded-xl shadow-ambient-md">
            <h3 className="text-headline-sm text-m3-on-surface mb-6 flex items-center gap-2">
              <MaterialIcon icon="bloodtype" /> Blood Type Stock Breakdown
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {["O-", "O+", "A+", "B+", "A-", "B-", "AB+", "AB-"].map((bt) => {
                const stock = stats?.stockByBloodType?.find((s: any) => s._id === bt);
                return <BloodTypeCard key={bt} bloodType={bt} available={stock?.count || 0} />;
              })}
            </div>
          </div>

          {/* Detailed Inventory Table */}
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
            <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center">
              <h3 className="text-title-md text-m3-on-surface">Unit Register</h3>
            </div>
            <DataTable
              isLoading={invLoading}
              data={inventory?.items || []}
              columns={[
                { header: "Barcode", accessorKey: "barcode" },
                { header: "Type", accessorKey: "bloodType", cell: (info: any) => <span className="font-bold">{info.getValue()}</span> },
                { header: "Component", accessorKey: "componentType" },
                { header: "Expiry", accessorFn: (u: any) => new Date(u.expiryDate).toLocaleDateString() },
                { 
                  header: "Status", 
                  accessorKey: "status",
                  cell: (info: any) => {
                    const s = info.getValue();
                    return (
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase",
                        s === "available" ? "bg-green-100 text-green-700" : 
                        s === "reserved" ? "bg-blue-100 text-blue-700" :
                        "bg-m3-surface-variant text-m3-on-surface-variant"
                      )}>
                        {s}
                      </span>
                    );
                  }
                }
              ]}
            />
          </div>
        </div>

        {/* Right: Actions and Contact */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Action Center */}
          <div className="bg-m3-surface-container-high p-6 rounded-xl shadow-sm">
            <h4 className="text-title-sm text-m3-on-surface mb-4">Command Actions</h4>
            <div className="grid grid-cols-1 gap-3">
              <button className="bg-m3-primary text-m3-on-primary py-2.5 px-4 rounded flex items-center justify-center gap-2 font-medium hover:opacity-90">
                <MaterialIcon icon="local_shipping" size={20} /> Create New Dispatch
              </button>
              <button className="border border-m3-outline text-m3-on-surface py-2.5 px-4 rounded flex items-center justify-center gap-2 font-medium hover:bg-m3-surface-container">
                <MaterialIcon icon="mark_chat_unread" size={20} /> Send Alert
              </button>
              <button className="border border-m3-outline text-m3-error py-2.5 px-4 rounded flex items-center justify-center gap-2 font-medium hover:bg-m3-error-container/10">
                <MaterialIcon icon="block" size={20} /> Suspend Operations
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-m3-surface-container-lowest border border-m3-outline-variant p-6 rounded-xl">
            <h4 className="text-title-sm text-m3-on-surface mb-4">Facility Information</h4>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MaterialIcon icon="location_on" className="text-m3-secondary mt-1" size={20} />
                <div>
                  <p className="text-body-compact text-m3-on-surface">{org?.address?.street}</p>
                  <p className="text-body-compact text-m3-on-surface-variant text-sm">{org?.address?.city}, {org?.address?.state}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon icon="phone" className="text-m3-secondary" size={20} />
                <p className="text-body-compact text-m3-on-surface">{org?.contact?.phone || "No phone listed"}</p>
              </div>
              <div className="flex items-center gap-3">
                <MaterialIcon icon="email" className="text-m3-secondary" size={20} />
                <p className="text-body-compact text-m3-on-surface underline">{org?.contact?.email || "No email listed"}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
