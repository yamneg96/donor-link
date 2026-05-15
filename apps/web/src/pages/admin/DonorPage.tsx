import { useState } from "react";
import { useAllDonors } from "../../hooks/useApi";
import { FullPageSpinner, BloodTypeBadge } from "../../components/ui";
import { formatDate, timeAgo, cn } from "../../lib/utils";
import { Search, User, Droplets, MapPin, Activity, Heart, Clock, ShieldCheck } from "lucide-react";

export default function DonorPage() {
  const [search, setSearch] = useState("");
  const { data: donorsData, isLoading } = useAllDonors({ search, limit: 20 });
  const donors = donorsData?.items ?? [];

  if (isLoading && !donors.length) return <FullPageSpinner />;

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-[2.5rem] font-headline font-bold text-on-surface leading-tight tracking-tight">
            Donor Registry
          </h1>
          <p className="text-on-surface-variant font-body mt-2 max-w-2xl">
            National directory of registered donors in the Clinical Sanctuary network.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-low rounded-xl text-sm font-semibold text-secondary border border-surface-variant/50">
          <ShieldCheck className="size-4 text-tertiary" />
          <span>Verified Network</span>
        </div>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 ambient-shadow border border-outline-variant/10">
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary size-5" />
          <input 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm font-body text-on-surface placeholder:text-secondary outline-none" 
            placeholder="Search donors by name, blood type, or region..." 
            type="text"
          />
        </div>
      </div>

      {/* ── Donor List (Bento Grid) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {donors.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-60 bg-white rounded-2xl border border-outline-variant/10">
            <User className="size-12 mx-auto mb-3 text-secondary" />
            <p>No donors found matching your search.</p>
          </div>
        ) : (
          donors.map((donor: any) => (
            <div key={donor._id} className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-between hover:shadow-lg transition-shadow">
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container flex items-center justify-center text-secondary">
                    <User className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl text-on-surface">
                      {donor.firstName} {donor.lastName}
                    </h3>
                    <p className="text-sm font-body text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                      <MapPin className="size-3.5" />
                      {donor.address?.city || "Unknown City"}, {donor.address?.region || "Unknown Region"}
                    </p>
                  </div>
                </div>
                {donor.bloodType && (
                  <BloodTypeBadge type={donor.bloodType} className="scale-110 origin-top-right" />
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 border-t border-surface-container-low pt-4">
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Droplets className="size-3" /> Donations
                  </p>
                  <p className="font-headline font-bold text-lg text-on-surface">{donor.donationCount ?? 0}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Activity className="size-3" /> Status
                  </p>
                  <p className="font-headline font-bold text-sm text-tertiary">
                    {donor.eligibilityStatus === "eligible" ? "Eligible" : "Pending"}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Clock className="size-3" /> Joined
                  </p>
                  <p className="font-headline font-bold text-sm text-on-surface">
                    {formatDate(donor.createdAt)}
                  </p>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
}