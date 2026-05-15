import { useState } from "react";
import { Bell, MapPin, Clock, AlertTriangle, CheckCircle2, XCircle, ChevronRight, Activity } from "lucide-react";
import { useMyAlerts, useRespondToRequest } from "../../hooks/useApi";
import { FullPageSpinner, BloodTypeBadge, Badge } from "../../components/ui";
import { formatDate, timeAgo, cn, URGENCY_BADGE } from "../../lib/utils";

export default function AlertsPage() {
  const { data: alerts, isLoading } = useMyAlerts();
  const respond = useRespondToRequest();
  const [filter, setFilter] = useState<"all" | "pending" | "responded">("all");

  if (isLoading) return <FullPageSpinner />;

  const items = alerts || [];
  
  const filteredAlerts = items.filter((a: any) => {
    if (filter === "pending") return !a.donorResponse || a.donorResponse === "no_response";
    if (filter === "responded") return a.donorResponse && a.donorResponse !== "no_response";
    return true;
  });

  return (
    <div className="flex-1 w-full max-w-[1000px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-4xl font-bold text-on-surface flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-surface-container-high flex items-center justify-center text-primary ghost-border">
              <Bell className="size-6" />
            </div>
            Emergency Alerts
          </h1>
          <p className="text-sm font-body text-secondary mt-2 max-w-xl">
            Respond to local blood shortages and emergency requests tailored to your blood type and eligibility.
          </p>
        </div>
      </div>

      {/* ── Filter Tabs ──────────────────────────────────────────────── */}
      <div className="flex bg-white rounded-xl p-1.5 ambient-shadow w-max border border-outline-variant/10">
        {[
          { id: "all", label: "All Alerts" },
          { id: "pending", label: "Pending Response" },
          { id: "responded", label: "Responded" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id as any)}
            className={cn(
              "px-5 py-2.5 rounded-lg text-sm font-bold font-headline transition-all",
              filter === tab.id 
                ? "bg-surface-container-low text-midnight shadow-sm" 
                : "text-secondary hover:text-midnight hover:bg-surface-container-lowest"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Alerts List ──────────────────────────────────────────────── */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center ambient-shadow border border-outline-variant/10">
            <Bell className="size-12 text-secondary/30 mx-auto mb-4" />
            <h3 className="text-lg font-headline font-bold text-on-surface mb-1">No alerts found</h3>
            <p className="text-sm font-body text-on-surface-variant">
              You're all caught up. We'll notify you when someone nearby needs your specific blood type.
            </p>
          </div>
        ) : (
          filteredAlerts.map((alert: any) => {
            const req = alert.requestId;
            const isPending = !alert.donorResponse || alert.donorResponse === "no_response";
            const isCritical = req?.urgency === "CRITICAL" || req?.urgency === "HIGH";

            return (
              <div 
                key={alert._id} 
                className={cn(
                  "bg-white rounded-2xl p-6 ambient-shadow border transition-all overflow-hidden relative",
                  isPending ? (isCritical ? "border-error-container bg-error-container/10" : "border-primary/20") : "border-outline-variant/10 opacity-75"
                )}
              >
                {/* Decorative side accent */}
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-1.5",
                  isPending ? (isCritical ? "bg-error" : "bg-primary") : "bg-surface-container-high"
                )} />

                <div className="flex flex-col md:flex-row gap-6 ml-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-3">
                      <BloodTypeBadge type={req?.bloodType || "?"} />
                      {req?.urgency && (
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded",
                          isCritical ? "bg-error text-white" : "bg-surface-container-high text-on-surface"
                        )}>
                          {isCritical && <AlertTriangle className="size-3" />}
                          {req.urgency} Priority
                        </span>
                      )}
                      <span className="text-xs font-body text-secondary flex items-center gap-1 ml-auto md:ml-0">
                        <Clock className="size-3.5" />
                        {timeAgo(alert.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-lg font-headline font-bold text-on-surface mb-1">
                      {req?.hospitalId?.name || "Local Hospital"} Needs Blood
                    </h3>
                    <p className="text-sm font-body text-on-surface-variant mb-4">
                      {req?.notes || "We are experiencing a critical shortage of your blood type. Your donation could save a life today."}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center text-xs font-body text-secondary">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-4" />
                        {req?.hospitalId?.address?.city || "Unknown City"}
                      </div>
                      <div className="hidden sm:block w-1 h-1 rounded-full bg-outline-variant" />
                      <div className="flex items-center gap-1.5">
                        <Activity className="size-4" />
                        Requested: {formatDate(req?.createdAt)}
                      </div>
                    </div>
                  </div>

                  {/* Actions Area */}
                  <div className="flex flex-col justify-center min-w-[200px] border-t md:border-t-0 md:border-l border-surface-container-low pt-4 md:pt-0 md:pl-6">
                    {isPending ? (
                      <div className="flex flex-col gap-3 w-full">
                        <button
                          disabled={respond.isPending}
                          onClick={() => respond.mutate({ requestId: req?._id, response: "accepted" })}
                          className="w-full px-4 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-body text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2 ambient-shadow btn-glow disabled:opacity-50"
                        >
                          <CheckCircle2 className="size-4" />
                          I Can Donate
                        </button>
                        <button
                          disabled={respond.isPending}
                          onClick={() => respond.mutate({ requestId: req?._id, response: "declined" })}
                          className="w-full px-4 py-2.5 rounded-xl bg-surface-container-low text-on-surface font-body text-sm font-semibold hover:bg-surface-container transition-colors disabled:opacity-50"
                        >
                          Not Available
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center h-full">
                        <div className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center mb-2",
                          alert.donorResponse === "accepted" ? "bg-surface-container-high text-tertiary" : "bg-surface-container text-secondary"
                        )}>
                          {alert.donorResponse === "accepted" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
                        </div>
                        <p className="text-sm font-headline font-bold text-on-surface">
                          {alert.donorResponse === "accepted" ? "Accepted" : "Declined"}
                        </p>
                        <p className="text-xs font-body text-secondary mt-1">
                          Thank you for responding.
                        </p>
                      </div>
                    )}
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