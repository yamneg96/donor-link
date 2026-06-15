import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { LoadingSkeleton, EmptyState } from "../../components/shared/EmptyState";
import { useDonors } from "../../hooks/useApi";
import { useState } from "react";
import { cn } from "../../lib/utils";

export default function DonorManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { data: donors, isLoading } = useDonors({ limit: 50 });
  
  const items = Array.isArray(donors?.items || donors) ? (donors?.items || donors) : [];
  
  const filteredItems = items.filter((d: any) => {
    const name = `${d.userId?.firstName} ${d.userId?.lastName}`.toLowerCase();
    return name.includes(searchTerm.toLowerCase()) || d.bloodType?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Donor Registry</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">National donor registry and central communication hub.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-m3-secondary text-m3-on-secondary text-title-sm py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 text-sm">
            <MaterialIcon icon="mail" size={18} /> Bulk Notification
          </button>
        </div>
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="p-4 border-b border-m3-outline-variant flex justify-between items-center bg-m3-surface-container-low/30">
          <h3 className="text-title-sm font-bold text-m3-on-surface">Registered Donors</h3>
          <div className="relative">
            <MaterialIcon icon="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
            <input 
              className="pl-8 pr-3 py-1.5 border border-m3-outline-variant rounded bg-m3-surface-container-lowest text-body-compact focus:border-m3-primary focus:ring-1 focus:ring-m3-primary w-64 outline-none" 
              placeholder="Search by name or type..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {filteredItems.length > 0 ? (
          <table className="w-full text-left">
            <thead className="bg-m3-surface-container-low text-label-caps text-m3-secondary border-b border-m3-outline-variant">
              <tr><th className="p-3">Donor</th><th className="p-3">Blood Type</th><th className="p-3">Total Donations</th><th className="p-3">Last Donation</th><th className="p-3 text-center">Status</th><th className="p-3 text-right">Actions</th></tr>
            </thead>
            <tbody className="text-data-mono divide-y divide-m3-outline-variant">
              {filteredItems.map((d: any) => (
                <tr key={d._id} className="hover:bg-m3-surface-container-low transition-colors">
                  <td className="p-3">
                    <div className="font-bold text-m3-on-surface">{d.userId?.firstName || "—"} {d.userId?.lastName || ""}</div>
                    <div className="text-[10px] text-m3-on-surface-variant font-mono">{d.userId?.phone || "No phone"}</div>
                  </td>
                  <td className="p-3">
                    <span className="bg-m3-error-container text-m3-on-error-container px-2 py-0.5 rounded font-bold">{d.bloodType}</span>
                  </td>
                  <td className="p-3 font-semibold">{d.totalDonations}</td>
                  <td className="p-3 text-xs">{d.lastDonationDate ? new Date(d.lastDonationDate).toLocaleDateString() : "Never"}</td>
                  <td className="p-3 text-center">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                      d.isEligible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    )}>
                      {d.isEligible ? "Eligible" : "Deferred"}
                    </span>
                  </td>
                  <td className="p-3 text-right">
                    <button className="text-m3-primary hover:underline text-xs font-bold">Message</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <EmptyState icon="group" title="No donors found" description="No donors match your current search criteria." />
        )}
      </div>
    </div>
  );
}
