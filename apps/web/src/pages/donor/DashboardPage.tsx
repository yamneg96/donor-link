import { Heart, Droplets, CalendarCheck, Bell, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useDonorProfile, useMyAlerts, useMyDonations, useRespondToRequest } from "../../hooks/useApi";
import { StatCard, Card, Badge, BloodTypeBadge, FullPageSpinner, Button, EmptyState } from "../../components/ui";
import { formatDate, timeAgo, URGENCY_BADGE, cn } from "../../lib/utils";
import { authStore } from "../../store/authStore";
import { RequestUrgency, DonorStatus } from "@donorlink/types";

export function DashboardPage() {
  const { user } = authStore.getState();
  const { data: donor, isLoading: donorLoading } = useDonorProfile();
  const { data: alerts } = useMyAlerts();
  const { data: donations } = useMyDonations({ limit: 3 });
  const respond = useRespondToRequest();
  const navigate = useNavigate();

  if (donorLoading) return <FullPageSpinner />;

  const pendingAlerts = (alerts ?? []).filter(
    (a: any) => !a.donorResponse || a.donorResponse === "no_response"
  );
  const isEligible =
    !donor?.nextEligibleDate ||
    new Date(donor.nextEligibleDate) <= new Date();

  return (
    <div className="page-container space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">
            Welcome back, {user?.firstName} 👋
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {donor?.status === DonorStatus.ACTIVE
              ? isEligible
                ? "You are eligible to donate today."
                : `Next eligible: ${formatDate(donor.nextEligibleDate!)}`
              : `Status: ${donor?.status}`}
          </p>
        </div>
        {donor?.bloodType && <BloodTypeBadge type={donor.bloodType} />}
      </div>

      {/* Eligibility banner */}
      {!isEligible && (
        <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-center gap-3">
          <Clock className="w-5 h-5 text-amber-500 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-amber-800">Donation cooldown active</p>
            <p className="text-xs text-amber-600 mt-0.5">
              You can donate again on {formatDate(donor!.nextEligibleDate!)}. The 84-day interval protects your health.
            </p>
          </div>
        </div>
      )}

      {/* Pending alerts */}
      {pendingAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-brand-600" />
            <h2 className="section-title text-base">
              Pending donation requests ({pendingAlerts.length})
            </h2>
          </div>
          {pendingAlerts.slice(0, 3).map((alert: any) => (
            <AlertCard key={alert._id} alert={alert} onRespond={respond.mutate} />
          ))}
          {pendingAlerts.length > 3 && (
            <button
              onClick={() => navigate({ to: "/alerts" })}
              className="text-sm text-brand-600 font-medium hover:text-brand-700"
            >
              View all {pendingAlerts.length} alerts →
            </button>
          )}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total donations"
          value={donor?.totalDonations ?? 0}
          icon={<Heart className="w-4 h-4" />}
        />
        <StatCard
          label="Blood type"
          value={donor?.bloodType ?? "—"}
          icon={<Droplets className="w-4 h-4" />}
        />
        <StatCard
          label="Last donated"
          value={donor?.lastDonationDate ? timeAgo(donor.lastDonationDate as string) : "Never"}
          icon={<CalendarCheck className="w-4 h-4" />}
        />
        <StatCard
          label="Pending alerts"
          value={pendingAlerts.length}
          icon={<Bell className="w-4 h-4" />}
        />
      </div>

      {/* Recent donations */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="section-title">Recent donations</h2>
          <button
            onClick={() => navigate({ to: "/donations" })}
            className="text-sm text-brand-600 font-medium hover:text-brand-700"
          >
            View all
          </button>
        </div>

        {donations?.items?.length === 0 ? (
          <Card>
            <EmptyState
              icon={<Heart className="w-10 h-10" />}
              title="No donations yet"
              description="When you schedule or complete a donation, it will appear here."
            />
          </Card>
        ) : (
          <div className="space-y-3">
            {donations?.items?.map((d: any) => (
              <Card key={d._id} className="flex items-center gap-4 py-4 px-5">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                  d.status === "completed" ? "bg-green-100" : "bg-stone-100"
                )}>
                  {d.status === "completed"
                    ? <CheckCircle2 className="w-5 h-5 text-green-600" />
                    : <Clock className="w-5 h-5 text-stone-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {d.hospitalId?.name ?? "Hospital"}
                  </p>
                  <p className="text-xs text-stone-400">{formatDate(d.scheduledAt)}</p>
                </div>
                <Badge variant={d.status === "completed" ? "fulfilled" : "pending"}>
                  {d.status}
                </Badge>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Notification preferences shortcut */}
      <Card className="flex items-center gap-4">
        <Bell className="w-5 h-5 text-brand-500 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm font-medium text-stone-900">Notification settings</p>
          <p className="text-xs text-stone-400 mt-0.5">
            Emergency only: {donor?.notificationPreferences?.emergencyOnly ? "On" : "Off"} ·
            Max alerts/day: {donor?.notificationPreferences?.maxAlertsPerDay ?? 3}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate({ to: "/profile" })}>
          Edit
        </Button>
      </Card>
    </div>
  );
}

function AlertCard({ alert, onRespond }: { alert: any; onRespond: (d: any) => void }) {
  const req = alert.requestId;
  return (
    <Card className="border-l-4 border-l-brand-500">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <Droplets className="w-5 h-5 text-brand-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <BloodTypeBadge type={req?.bloodType ?? "?"} />
            {req?.urgency && (
              <Badge variant={req.urgency as keyof typeof URGENCY_BADGE}>
                {req.urgency}
              </Badge>
            )}
            <span className="text-xs text-stone-400">{timeAgo(alert.createdAt)}</span>
          </div>
          <p className="text-sm text-stone-700 mt-1">
            Blood needed at {alert.requestId?.hospitalId?.name ?? "a nearby hospital"}
          </p>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <Button
          size="sm"
          onClick={() => onRespond({ requestId: req?._id, response: "accepted" })}
          className="flex-1"
        >
          <CheckCircle2 className="w-4 h-4" /> I can donate
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onRespond({ requestId: req?._id, response: "declined" })}
          className="flex-1"
        >
          Not available
        </Button>
      </div>
    </Card>
  );
}