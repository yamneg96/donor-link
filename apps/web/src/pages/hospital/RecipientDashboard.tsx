import { useNavigate } from "@tanstack/react-router";
import { Plus, Clock, Activity, Search, Verified, HeartPulse } from "lucide-react";
import { useRequests, useFulfillRequest } from "../../hooks/useApi";
import { FullPageSpinner, BloodTypeBadge } from "../../components/ui";
import { timeAgo, cn } from "../../lib/utils";
import { RequestStatus } from "@donorlink/types";

export function RecipientDashboard() {
  const navigate = useNavigate();
  const { data: requests, isLoading } = useRequests({ limit: 10, status: `${RequestStatus.PENDING},${RequestStatus.MATCHING}` });
  const fulfill = useFulfillRequest();

  if (isLoading) return <FullPageSpinner />;

  return (
    <div className="flex-1 w-full max-w-[1400px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <h1 className="text-4xl md:text-[2.5rem] font-headline font-bold text-on-surface leading-tight tracking-tight">
            Recipient Dashboard
          </h1>
          <p className="text-on-surface-variant font-body mt-2">Manage active patient requests and track matched donor availability.</p>
        </div>
        <button 
          onClick={() => navigate({ to: "/hospital/requests/new" })}
          className="py-3 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-headline font-semibold text-sm shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
        >
          <Plus className="size-5" />
          Create Request
        </button>
      </div>

      {/* ── Search Bar ───────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-4 ambient-shadow border border-outline-variant/10">
        <div className="relative max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary size-5" />
          <input 
            className="w-full pl-12 pr-4 py-3 rounded-xl bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 text-sm font-body text-on-surface placeholder:text-secondary outline-none" 
            placeholder="Search active requests by Patient ID or Blood Type..." 
            type="text"
          />
        </div>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Active Requests (Span 8) */}
        <div className="md:col-span-8 bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10 min-h-[500px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-headline font-bold text-on-surface">Active Patient Requests</h3>
            <span className="text-sm font-body font-medium text-tertiary">Live View</span>
          </div>
          
          <div className="space-y-4">
            {requests?.items?.length === 0 ? (
              <div className="text-center py-12 opacity-60">
                <HeartPulse className="size-12 mx-auto mb-3 text-secondary" />
                <p>No active recipient requests.</p>
              </div>
            ) : (
              requests?.items?.map((req: any) => {
                const isCritical = req.urgency === "CRITICAL" || req.urgency === "HIGH";
                const isMatched = req.unitsMatched >= req.unitsNeeded;
                
                return (
                  <div key={req._id} className={cn(
                    "p-6 rounded-xl border-l-4 transition-colors group cursor-pointer",
                    isCritical ? "bg-surface-container-low border-error hover:bg-surface-container" : "bg-surface-container-low border-tertiary hover:bg-surface-container"
                  )}>
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className={cn(
                            "px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                            isCritical ? "bg-error-container text-error" : "bg-tertiary-container text-tertiary"
                          )}>
                            {req.urgency}
                          </span>
                          <span className="text-xs font-body text-secondary font-semibold">REQ-{req._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <h4 className="text-lg font-headline font-bold text-on-surface flex items-center gap-2">
                          Patient {req.patientName || "Unspecified"} · <BloodTypeBadge type={req.bloodType} className="scale-75 origin-left" />
                        </h4>
                        <p className="text-sm font-body text-on-surface-variant mt-1">Units Needed: {req.unitsNeeded}</p>
                      </div>
                      
                      <div className="sm:text-right">
                        <div className="text-xs font-body text-secondary mb-1">Time Elapsed</div>
                        <div className={cn("text-lg font-headline font-bold", isCritical ? "text-error" : "text-on-surface")}>
                          {timeAgo(req.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-outline-variant/20 flex flex-col sm:flex-row justify-between items-center gap-4">
                      <div className="flex items-center gap-2">
                        {isMatched ? (
                          <>
                            <Verified className="size-5 text-tertiary" />
                            <span className="text-sm font-body text-tertiary font-bold">Matches Found ({req.unitsMatched} ready)</span>
                          </>
                        ) : (
                          <>
                            <Clock className="size-5 text-secondary" />
                            <span className="text-sm font-body text-secondary font-semibold">Awaiting donor responses... ({req.alertsSentCount} alerted)</span>
                          </>
                        )}
                      </div>
                      
                      <button 
                        disabled={!isMatched || fulfill.isPending}
                        onClick={(e) => { e.stopPropagation(); fulfill.mutate(req._id); }}
                        className={cn(
                          "px-6 py-2.5 rounded-xl font-body text-sm font-bold transition-all w-full sm:w-auto",
                          isMatched 
                            ? "bg-gradient-to-br from-primary to-primary-container text-white shadow-md hover:shadow-lg" 
                            : "bg-surface-container-high text-secondary opacity-60 cursor-not-allowed"
                        )}
                      >
                        {isMatched ? "Approve & Fulfill" : "Awaiting Donors"}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Real-time Match Suggestions (Span 4) */}
        <div className="md:col-span-4 bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10 flex flex-col">
          <h3 className="text-xl font-headline font-bold text-on-surface mb-6 flex items-center gap-2">
            <Activity className="size-5 text-tertiary" /> Active Match Pool
          </h3>
          
          <div className="flex-1 space-y-4">
            <div className="text-sm font-body text-secondary mb-4">
              System is currently scanning the network for compatible donors within your geographic radius.
            </div>
            
            <div className="p-5 rounded-xl bg-surface border border-outline-variant/20 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center text-primary font-bold text-lg">
                <span className="animate-pulse">...</span>
              </div>
              <div className="flex-1">
                <h5 className="text-sm font-headline font-bold text-on-surface">Auto-Matching Active</h5>
                <p className="text-xs font-body text-secondary mt-1">Continuously pinging eligible donors.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
