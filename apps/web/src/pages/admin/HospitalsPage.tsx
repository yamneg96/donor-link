import { useState } from "react";
import { useHospitals } from "../../hooks/useApi";
import { FullPageSpinner } from "../../components/ui";
import { Search, Building2, MapPin, Phone, Mail, Activity, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

export default function HospitalsPage() {
  const [search, setSearch] = useState("");
  const { data: hospitalsData, isLoading } = useHospitals({ search, limit: 20 });
  const hospitals = hospitalsData?.items ?? [];

  if (isLoading && !hospitals.length) return <FullPageSpinner />;

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-[2.5rem] font-headline font-bold text-on-surface leading-tight tracking-tight">
            Registered Facilities
          </h1>
          <p className="text-on-surface-variant font-body mt-2 max-w-2xl">
            Directory of approved hospitals and blood banks operating within the Clinical Sanctuary.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-primary-container/10 rounded-xl text-sm font-semibold text-primary border border-primary/20">
          <Activity className="size-4" />
          <span>{hospitalsData?.total ?? 0} Facilities Active</span>
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
            placeholder="Search facilities by name, region, or verification status..." 
            type="text"
          />
        </div>
      </div>

      {/* ── Hospitals List (Bento Grid) ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {hospitals.length === 0 ? (
          <div className="col-span-full py-12 text-center opacity-60 bg-white rounded-2xl border border-outline-variant/10">
            <Building2 className="size-12 mx-auto mb-3 text-secondary" />
            <p>No facilities found matching your search.</p>
          </div>
        ) : (
          hospitals.map((hospital: any) => (
            <div key={hospital._id} className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-between hover:shadow-lg transition-shadow group">
              
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-full bg-surface-container-high flex items-center justify-center text-primary mt-1">
                    <Building2 className="size-6" />
                  </div>
                  <div>
                    <h3 className="font-headline font-bold text-xl text-on-surface">
                      {hospital.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm font-body text-on-surface-variant">
                      <MapPin className="size-3.5" />
                      {hospital.address?.street}, {hospital.address?.city}, {hospital.address?.region}
                    </div>
                    {hospital.isVerified && (
                      <div className="flex items-center gap-1 mt-2 text-xs font-bold text-tertiary bg-tertiary-container/20 px-2 py-0.5 rounded w-max">
                        <ShieldCheck className="size-3" /> MoH Verified
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-surface-container-low pt-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Phone className="size-3" /> Emergency Contact
                  </p>
                  <p className="font-body font-semibold text-sm text-on-surface">{hospital.contactPhone || "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-secondary uppercase tracking-wider mb-1 flex items-center gap-1">
                    <Mail className="size-3" /> Admin Email
                  </p>
                  <p className="font-body font-semibold text-sm text-on-surface truncate">{hospital.contactEmail || "—"}</p>
                </div>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-surface-container-low text-on-surface font-semibold text-sm hover:bg-surface-dim transition-colors flex items-center justify-center gap-2 group-hover:text-primary">
                View Inventory & Requests <ArrowRight className="size-4" />
              </button>

            </div>
          ))
        )}
      </div>

    </div>
  );
}