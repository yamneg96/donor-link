import { useNavigate } from "@tanstack/react-router";
import { Plus, AlertTriangle, Droplets, Heart, CheckCircle2, RefreshCw, Activity, Search, ArrowRight, Expand } from "lucide-react";
import { useMyHospital, useRequests, useFulfillRequest, useRetriggerAlerts, useDashboardStats } from "../../hooks/useApi";
import { FullPageSpinner, BloodTypeBadge } from "../../components/ui";
import { formatDate, timeAgo, cn } from "../../lib/utils";
import { RequestStatus } from "@donorlink/types";

export function HospitalDashboard() {
  const navigate = useNavigate();
  const { data: hospital, isLoading: hospitalLoading } = useMyHospital();
  const { data: requests, isLoading: requestsLoading } = useRequests({ limit: 10, status: `${RequestStatus.PENDING},${RequestStatus.MATCHING}` });
  const { data: stats } = useDashboardStats();
  const fulfill = useFulfillRequest();
  const retrigger = useRetriggerAlerts();

  if (hospitalLoading || requestsLoading) return <FullPageSpinner />;

  const criticalInventory = hospital?.bloodInventory?.filter(
    (item: any) => item.units <= item.criticalThreshold
  ) ?? [];

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto space-y-10 animate-fade-in pb-10">
      
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-2">
        <div>
          <h1 className="font-headline text-4xl md:text-[3.5rem] leading-tight font-extrabold text-on-surface tracking-tight mb-2">
            Hospital Command Center
          </h1>
          <p className="text-lg font-body text-on-surface-variant max-w-2xl">
            Real-time overview of incoming donor matches, pending patient queues, and critical blood inventory levels for {hospital?.name || "your facility"}.
          </p>
        </div>
        <div className="flex items-center space-x-3 text-sm font-medium text-secondary">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse" />
          <span>Live Sync Active</span>
          <span className="text-on-surface-variant mx-1">•</span>
          <span>Updated just now</span>
        </div>
      </div>

      {/* ── Action Bar ───────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <button 
          onClick={() => navigate({ to: "/hospital/requests/new" })}
          className="py-3 px-6 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold shadow-[0px_8px_16px_rgba(183,0,17,0.2)] hover:shadow-[0px_12px_20px_rgba(183,0,17,0.3)] transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Plus className="size-5" />
          New Blood Request
        </button>
        <button 
          onClick={() => navigate({ to: "/hospital/inventory" })}
          className="py-3 px-6 rounded-xl bg-surface-container-high text-on-surface font-semibold hover:bg-surface-dim transition-all duration-200 flex items-center justify-center gap-2"
        >
          <Droplets className="size-5" />
          Manage Inventory
        </button>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* 1. Incoming Donor Matches (Active Requests) - 8 cols */}
        <div className="col-span-12 xl:col-span-8 bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10 flex flex-col h-full min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
              <Heart className="size-6 text-primary" />
              <span>Incoming Donor Matches</span>
            </h2>
            <button 
              onClick={() => navigate({ to: "/hospital/requests" })}
              className="text-sm font-semibold text-tertiary hover:text-primary transition-colors"
            >
              View All
            </button>
          </div>

          <div className="space-y-4 flex-grow overflow-y-auto pr-2 scrollbar-hide">
            {requests?.items?.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full opacity-60 text-center">
                <Heart className="size-10 mb-3 text-secondary" />
                <p className="text-sm">No active requests matching donors right now.</p>
              </div>
            ) : (
              requests?.items?.slice(0, 4).map((req: any) => {
                const isCritical = req.urgency === "CRITICAL" || req.urgency === "HIGH";
                return (
                  <div key={req._id} className="bg-surface-container-low rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group hover:bg-surface-container transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={cn(
                        "w-14 h-14 rounded-full flex items-center justify-center font-headline font-bold text-lg border",
                        isCritical 
                          ? "bg-error-container/20 text-error border-error-container/50" 
                          : "bg-tertiary/10 text-tertiary border-tertiary/20"
                      )}>
                        {req.bloodType}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-headline font-bold text-on-surface">Request #{req._id.slice(-4).toUpperCase()}</span>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                            isCritical ? "bg-error-container text-error" : "bg-surface-dim text-on-surface"
                          )}>
                            {req.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-on-surface-variant flex items-center gap-1.5">
                          <Activity className="size-3.5" />
                          {req.alertsSentCount} donors alerted • {timeAgo(req.createdAt)}
                        </p>
                      </div>
                    </div>
                    
                    <div className="text-left sm:text-right w-full sm:w-auto flex flex-col sm:items-end">
                      <p className="text-sm font-medium text-on-surface mb-2">
                        Matched: <span className="font-bold text-primary">{req.unitsMatched}/{req.unitsNeeded} Units</span>
                      </p>
                      <button 
                        onClick={() => fulfill.mutate(req._id)}
                        disabled={req.unitsMatched < req.unitsNeeded || fulfill.isPending}
                        className={cn(
                          "text-sm font-semibold flex items-center justify-center sm:justify-end gap-1 w-full sm:w-auto transition-colors",
                          req.unitsMatched >= req.unitsNeeded 
                            ? "text-primary hover:text-on-surface" 
                            : "text-secondary opacity-50 cursor-not-allowed"
                        )}
                      >
                        <span>Approve Reception</span>
                        <ArrowRight className="size-4" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Blood Inventory Overview - 4 cols */}
        <div className="col-span-12 xl:col-span-4 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden border border-outline-variant/10 min-h-[400px]">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-2xl" />
          
          <div className="flex justify-between items-center mb-6 relative z-10">
            <h2 className="font-headline text-2xl font-bold text-on-surface flex items-center gap-3">
              <Droplets className="size-6 text-on-surface" />
              <span>Inventory</span>
            </h2>
            {criticalInventory.length > 0 && (
              <span className="flex items-center gap-1 text-xs font-bold text-error bg-error-container/50 px-2 py-1 rounded">
                <AlertTriangle className="size-3" />
                CRITICAL
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 relative z-10">
            {hospital?.bloodInventory?.map((item: any) => {
              const isCritical = item.units <= item.criticalThreshold;
              const isAdequate = item.units > item.criticalThreshold * 2;
              
              return (
                <div key={item.bloodType} className="bg-white rounded-xl p-4 ambient-shadow border border-surface-variant/50 flex flex-col justify-between">
                  <div className="flex justify-between items-start mb-2">
                    <span className={cn("font-bold text-lg font-headline", isCritical ? "text-primary" : "text-tertiary")}>
                      {item.bloodType}
                    </span>
                    {isCritical && <AlertTriangle className="size-4 text-error" />}
                  </div>
                  <div className="text-3xl font-headline font-extrabold text-on-surface mb-1">
                    {item.units} <span className="text-sm font-normal text-on-surface-variant">units</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mb-2">
                    <div 
                      className={cn("h-full rounded-full", isCritical ? "bg-primary" : "bg-tertiary")}
                      style={{ width: `${Math.min(100, (item.units / (item.criticalThreshold * 3)) * 100)}%` }}
                    />
                  </div>
                  <p className={cn("text-[10px] font-bold uppercase tracking-wider", 
                    isCritical ? "text-error" : (isAdequate ? "text-tertiary" : "text-on-surface-variant")
                  )}>
                    {isCritical ? "Critical Low" : (isAdequate ? "Stable" : "Restock Needed")}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Patient Queue - 12 cols */}
        <div className="col-span-12 bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
              <h2 className="font-headline text-2xl font-bold text-on-surface">Patient Verification Queue</h2>
              <p className="text-sm text-on-surface-variant mt-1">Review and approve pending donor-to-patient allocations.</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-2">
                Filter
              </button>
              <button className="px-4 py-2 bg-surface-container-low text-on-surface rounded-lg text-sm font-medium hover:bg-surface-container transition-colors flex items-center gap-2">
                Sort by Urgency
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {requests?.items?.length === 0 ? (
              <div className="text-center py-10 opacity-60">
                <CheckCircle2 className="size-12 mx-auto mb-3 text-secondary" />
                <p>No patients currently in queue.</p>
              </div>
            ) : (
              requests?.items?.slice(0, 3).map((req: any) => (
                <div key={req._id} className="grid grid-cols-12 gap-6 items-center p-6 rounded-xl border border-surface-container bg-surface-bright hover:shadow-md transition-shadow group">
                  
                  {/* Left: Patient Info (Mocked since we don't store patient names natively yet) */}
                  <div className="col-span-12 md:col-span-4 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                      <Activity className="size-6" />
                    </div>
                    <div>
                      <h3 className="font-headline font-bold text-on-surface text-lg">Patient #{req._id.slice(-4).toUpperCase()}</h3>
                      <p className="text-xs text-on-surface-variant">Req: {formatDate(req.createdAt)} • {req.urgency}</p>
                    </div>
                  </div>

                  {/* Middle: Match Status */}
                  <div className="col-span-12 md:col-span-4 flex justify-center items-center gap-6 sm:gap-8">
                    <div className="text-center">
                      <p className="text-[10px] text-on-surface-variant uppercase tracking-wider font-bold mb-1">Required</p>
                      <p className="font-headline font-bold text-primary text-xl">
                        {req.bloodType} <span className="text-sm font-normal text-on-surface-variant">x{req.unitsNeeded} Units</span>
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-surface-dim">
                      <RefreshCw className="size-6" />
                    </div>
                    <div className="text-center">
                      <p className={cn("text-[10px] uppercase tracking-wider font-bold mb-1", req.unitsMatched >= req.unitsNeeded ? "text-tertiary" : "text-error")}>
                        {req.unitsMatched >= req.unitsNeeded ? "Matched Donor" : "Pending Tests"}
                      </p>
                      <p className={cn("font-headline font-bold text-xl", req.unitsMatched >= req.unitsNeeded ? "text-tertiary" : "text-on-surface-variant")}>
                        {req.bloodType} <span className="text-sm font-normal">{req.unitsMatched}/{req.unitsNeeded} Ready</span>
                      </p>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="col-span-12 md:col-span-4 flex justify-end gap-3 mt-4 md:mt-0">
                    <button 
                      onClick={() => retrigger.mutate(req._id)}
                      disabled={retrigger.isPending}
                      className="px-4 sm:px-6 py-2.5 rounded-xl border border-surface-container text-on-surface font-semibold text-sm hover:bg-surface-container transition-colors disabled:opacity-50"
                    >
                      Re-Alert Donors
                    </button>
                    <button 
                      onClick={() => fulfill.mutate(req._id)}
                      disabled={req.unitsMatched < req.unitsNeeded || fulfill.isPending}
                      className="px-4 sm:px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-semibold text-sm shadow-[0px_4px_10px_rgba(183,0,17,0.2)] hover:shadow-[0px_8px_15px_rgba(183,0,17,0.3)] transition-all disabled:opacity-50 disabled:grayscale"
                    >
                      Approve Allocation
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}