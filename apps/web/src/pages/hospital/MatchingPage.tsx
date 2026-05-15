import { useState } from "react";
import { useRequests, useFulfillRequest } from "../../hooks/useApi";
import { FullPageSpinner, BloodTypeBadge } from "../../components/ui";
import { formatDate, timeAgo, cn } from "../../lib/utils";
import { RequestStatus } from "@donorlink/types";
import { HeartPulse, CheckCircle2, User, Heart, Activity, AlertTriangle, MapPin, Search, ArrowRight, Clock, ShieldCheck, X } from "lucide-react";

export function MatchingPage() {
  const { data: requests, isLoading } = useRequests({ status: `${RequestStatus.PENDING},${RequestStatus.MATCHING}` });
  const fulfill = useFulfillRequest();
  const [filterType, setFilterType] = useState("Any");

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Header Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
        <div>
          <h1 className="text-4xl md:text-[3.5rem] font-headline font-extrabold text-on-surface leading-tight tracking-tight mb-2">
            Active Matches
          </h1>
          <p className="text-on-surface-variant font-body text-sm max-w-2xl">
            Review potential donor-recipient pairings. Priority is calculated based on clinical urgency, biological compatibility, and logistical feasibility.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-2 text-sm font-semibold text-tertiary bg-tertiary-container/10 px-4 py-2 rounded-xl border border-tertiary/20">
            <CheckCircle2 className="size-4" />
            System Stable
          </span>
          <span className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary-container/10 px-4 py-2 rounded-xl border border-primary/20">
            <Clock className="size-4" />
            Live Sync
          </span>
        </div>
      </div>

      {/* ── Filters (Bento Layout) ─────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Blood Type Filter */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10">
          <label className="block text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Compatibility Filter</label>
          <div className="flex flex-wrap gap-2">
            {["O-", "O+", "A-", "Any"].map(type => (
              <button 
                key={type}
                onClick={() => setFilterType(type)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                  filterType === type 
                    ? "bg-primary-container text-white" 
                    : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Distance/Logistics Filter */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 col-span-1 md:col-span-2">
          <label className="block text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Logistical Radius (Auto-filtered)</label>
          <div className="flex items-center gap-4">
            <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[30%]" />
            </div>
            <span className="text-sm font-bold text-on-surface whitespace-nowrap">&lt; 150 km</span>
          </div>
          <div className="flex justify-between mt-3 text-xs text-on-surface-variant font-medium">
            <span>Local (0km)</span>
            <span>Regional</span>
            <span>National (500km+)</span>
          </div>
        </div>

        {/* Status Toggle */}
        <div className="bg-white rounded-2xl p-6 ambient-shadow border border-outline-variant/10 flex flex-col justify-center">
          <label className="block text-xs font-bold text-on-surface-variant mb-4 uppercase tracking-wider">Donor Status</label>
          <div className="flex items-center gap-3 bg-surface-container-low p-2 rounded-xl w-max">
            <button className="px-4 py-1.5 rounded-lg bg-white shadow-sm text-sm font-bold text-on-surface">Ready Now</button>
            <button className="px-4 py-1.5 rounded-lg text-sm font-bold text-secondary">All Donors</button>
          </div>
        </div>
      </div>

      {/* ── Matches List ───────────────────────────────────────────────── */}
      <div className="space-y-6">
        {requests?.items?.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center ambient-shadow border border-outline-variant/10">
            <ShieldCheck className="size-16 text-secondary/30 mx-auto mb-4" />
            <h3 className="text-xl font-headline font-bold text-on-surface mb-2">No active matches pending review</h3>
            <p className="text-sm font-body text-on-surface-variant max-w-md mx-auto">
              All active requests are currently being broadcasted to the network. Matches will appear here once donors respond.
            </p>
          </div>
        ) : (
          requests?.items?.map((req: any, i: number) => {
            const isCritical = req.urgency === "CRITICAL" || req.urgency === "HIGH";
            const matchScore = isCritical ? 98 : 84 - (i * 2); // Mocking match score for UI
            
            return (
              <div 
                key={req._id} 
                className={cn(
                  "bg-white rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 ambient-shadow border hover:shadow-lg",
                  isCritical ? "border-error-container/50" : "border-outline-variant/10"
                )}
              >
                <div className={cn(
                  "absolute top-0 left-0 w-1.5 h-full",
                  isCritical ? "bg-error" : "bg-tertiary"
                )} />
                
                <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-center justify-between ml-2">
                  
                  {/* Left: Match Info */}
                  <div className="flex items-start gap-6 flex-1 w-full">
                    
                    {/* Score */}
                    <div className="flex-shrink-0 text-center">
                      <div className={cn(
                        "w-16 h-16 rounded-full flex flex-col items-center justify-center font-headline font-bold text-lg mb-1 mx-auto border-2 border-white shadow-sm",
                        isCritical ? "bg-error-container text-on-error-container" : "bg-surface-container-high text-on-surface"
                      )}>
                        {matchScore}%
                      </div>
                      <span className="text-[0.65rem] uppercase tracking-wider font-bold text-on-surface-variant">Match</span>
                    </div>

                    {/* Entities */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
                      {/* Recipient */}
                      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant/50">
                        <div className="flex items-center gap-2 mb-2">
                          <User className="size-4 text-secondary" />
                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Recipient: {req.patientName || `R-${req._id.slice(-4).toUpperCase()}`}</span>
                        </div>
                        <div className="text-lg font-bold font-headline text-on-surface mb-2">Patient Request</div>
                        <div className="text-sm text-on-surface-variant flex items-center gap-2">
                          <BloodTypeBadge type={req.bloodType} className="scale-75 origin-left" />
                          <span className={cn("font-bold", isCritical ? "text-error" : "text-tertiary")}>
                            {req.urgency}
                          </span>
                        </div>
                      </div>

                      {/* Donor */}
                      <div className="bg-surface-container-lowest p-4 rounded-xl border border-surface-variant/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Heart className="size-4 text-secondary" />
                          <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Matched Donor</span>
                        </div>
                        <div className="text-lg font-bold font-headline text-on-surface mb-2">Verified Anonymous</div>
                        <div className="text-sm text-on-surface-variant flex items-center gap-2">
                          <BloodTypeBadge type={req.bloodType} className="scale-75 origin-left" />
                          <span className="font-semibold text-secondary">
                            {req.unitsMatched >= req.unitsNeeded ? "Ready for draw" : "Pending final lab"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Logistics & Actions */}
                  <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-6 items-center w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-surface-container-low pt-4 lg:pt-0 lg:pl-8">
                    
                    <div className="flex flex-col gap-2 w-full sm:w-auto">
                      <div className="flex items-center gap-3 text-sm text-on-surface bg-surface-container-low px-4 py-2 rounded-lg">
                        <MapPin className="size-4 text-tertiary" />
                        <span className="font-bold">45 km</span> <span className="text-on-surface-variant">distance</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-on-surface bg-surface-container-low px-4 py-2 rounded-lg">
                        <Activity className="size-4 text-tertiary" />
                        <span className="font-bold">~40 mins</span> <span className="text-on-surface-variant">transit</span>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 w-full sm:w-auto">
                      <button className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold text-sm hover:bg-surface-dim transition-colors flex items-center justify-center gap-2 flex-1">
                        <X className="size-4" /> Reject
                      </button>
                      <button 
                        onClick={() => fulfill.mutate(req._id)}
                        disabled={req.unitsMatched < req.unitsNeeded || fulfill.isPending}
                        className="px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 flex-1 disabled:opacity-50 disabled:grayscale"
                      >
                        <CheckCircle2 className="size-4" /> Approve
                      </button>
                    </div>
                    
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
}
