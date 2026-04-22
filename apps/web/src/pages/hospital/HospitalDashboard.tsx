import { useNavigate } from "@tanstack/react-router";
import { Plus, AlertTriangle, Droplets, Users, ClipboardList, CheckCircle2, RefreshCw } from "lucide-react";
import { useMyHospital, useRequests, useFulfillRequest, useRetriggerAlerts, useDashboardStats } from "../../hooks/useApi";
import { StatCard, Card, Badge, BloodTypeBadge, Button, EmptyState, FullPageSpinner } from "../../components/ui";
import { formatDate, timeAgo, cn } from "../../lib/utils";
import { RequestStatus, RequestUrgency } from "@donorlink/types";

export function HospitalDashboard() {
  const navigate = useNavigate();
  const { data: hospital, isLoading } = useMyHospital();
  const { data: requests } = useRequests({ limit: 5, status: `${RequestStatus.PENDING},${RequestStatus.MATCHING}` });
  const { data: stats } = useDashboardStats();
  const fulfill = useFulfillRequest();
  const retrigger = useRetriggerAlerts();

  if (isLoading) return <FullPageSpinner />;

  const criticalInventory = hospital?.bloodInventory?.filter(
    (item: any) => item.units <= item.criticalThreshold
  ) ?? [];

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">{hospital?.name ?? "Hospital Dashboard"}</h1>
          <p className="text-stone-500 text-sm mt-1">{hospital?.address?.city}, {hospital?.address?.region}</p>
        </div>
        <Button onClick={() => navigate({ to: "/hospital/requests/new" })}>
          <Plus className="w-4 h-4" /> New blood request
        </Button>
      </div>

      {/* Critical inventory warning */}
      {criticalInventory.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <p className="text-sm font-semibold text-red-800">Critical blood inventory</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {criticalInventory.map((item: any) => (
              <span key={item.bloodType} className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-bold">
                {item.bloodType}: {item.units} units
              </span>
            ))}
          </div>
          <Button variant="secondary" size="sm" className="mt-3" onClick={() => navigate({ to: "/hospital/inventory" })}>
            Update inventory
          </Button>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active requests" value={requests?.total ?? 0} icon={<ClipboardList className="w-4 h-4" />} />
        <StatCard label="Total donors alerted" value={stats?.totalDonors ?? "—"} icon={<Users className="w-4 h-4" />} />
        <StatCard label="Fulfilled today" value={stats?.fulfilledRequests ?? 0} icon={<CheckCircle2 className="w-4 h-4" />} />
        <StatCard label="Fulfillment rate" value={stats ? `${Math.round((stats.fulfilledRequests / Math.max(stats.totalRequests, 1)) * 100)}%` : "—"} icon={<Droplets className="w-4 h-4" />} />
      </div>

      {/* Blood inventory grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Blood inventory</h2>
          <Button variant="secondary" size="sm" onClick={() => navigate({ to: "/hospital/inventory" })}>
            Update
          </Button>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
          {hospital?.bloodInventory?.map((item: any) => {
            const isLow = item.units <= item.criticalThreshold;
            return (
              <div key={item.bloodType} className={cn(
                "card p-3 flex flex-col items-center gap-1",
                isLow && "border-red-200 bg-red-50"
              )}>
                <BloodTypeBadge type={item.bloodType} />
                <p className={cn("text-lg font-bold", isLow ? "text-red-600" : "text-stone-900")}>
                  {item.units}
                </p>
                <p className="text-xs text-stone-400">units</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active requests */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Active requests</h2>
          <Button variant="ghost" size="sm" onClick={() => navigate({ to: "/hospital/requests" })}>
            View all →
          </Button>
        </div>

        {requests?.items?.length === 0 ? (
          <Card>
            <EmptyState
              icon={<ClipboardList className="w-10 h-10" />}
              title="No active requests"
              description="Create a blood request to start alerting eligible donors."
              action={
                <Button onClick={() => navigate({ to: "/hospital/requests/new" })}>
                  <Plus className="w-4 h-4" /> New request
                </Button>
              }
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {requests?.items?.map((req: any) => (
              <Card key={req._id}>
                <div className="flex items-start gap-4">
                  <BloodTypeBadge type={req.bloodType} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={req.urgency as any}>{req.urgency}</Badge>
                      <Badge variant={req.status === RequestStatus.FULFILLED ? "fulfilled" : "pending"}>
                        {req.status}
                      </Badge>
                      <span className="text-xs text-stone-400">{timeAgo(req.createdAt)}</span>
                    </div>
                    <p className="text-sm text-stone-700 mt-1">
                      {req.unitsMatched}/{req.unitsNeeded} units matched · {req.alertsSentCount} donors alerted
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      Expires {formatDate(req.expiresAt)}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      loading={retrigger.isPending}
                      onClick={() => retrigger.mutate(req._id)}
                      title="Re-alert more donors"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => fulfill.mutate(req._id)}
                      loading={fulfill.isPending}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" /> Fulfill
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}