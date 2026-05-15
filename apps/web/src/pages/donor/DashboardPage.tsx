import { Heart, Droplets, CalendarCheck, Bell, MapPin, Clock, Verified, ArrowRight, Activity, Calendar as CalendarIcon, CheckCircle2, History, AlertTriangle } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { useDonorProfile, useMyAlerts, useMyDonations, useRespondToRequest, useRequests } from "../../hooks/useApi";
import { FullPageSpinner, Badge, BloodTypeBadge } from "../../components/ui";
import { formatDate, timeAgo, cn, URGENCY_BADGE } from "../../lib/utils";
import { authStore } from "../../store/authStore";

export function DashboardPage() {
  const { user } = authStore.getState();
  const { data: donor, isLoading: donorLoading } = useDonorProfile();
  const { data: alerts } = useMyAlerts();
  const { data: donations } = useMyDonations({ limit: 5 });
  // For the map / urgent requests view, we pull active nearby requests
  const { data: nearbyRequests } = useRequests({ status: "active", limit: 5 });
  
  const navigate = useNavigate();

  if (donorLoading) return <FullPageSpinner />;

  const isEligible = !donor?.nextEligibleDate || new Date(donor.nextEligibleDate) <= new Date();
  
  const upcomingDonations = donations?.items?.filter((d: any) => d.status === "scheduled") || [];
  const pastDonations = donations?.items?.filter((d: any) => d.status === "completed") || [];

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in">
      
      {/* ── Header & CTA ─────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h2 className="text-4xl md:text-[3.5rem] leading-tight font-headline font-extrabold text-on-surface tracking-tight">
            Welcome back, {user?.firstName}.
          </h2>
          <p className="text-lg font-body text-on-surface-variant mt-2 max-w-2xl">
            Your clinical sanctuary is ready. You have full eligibility to coordinate urgent requests today.
          </p>
        </div>
        <button 
          onClick={() => navigate({ to: "/donations" })}
          className="flex items-center gap-2 px-8 py-4 bg-gradient-to-br from-primary to-primary-container text-white rounded-xl font-headline font-bold text-lg shadow-[0px_10px_20px_rgba(183,0,17,0.2)] hover:shadow-[0px_15px_30px_rgba(183,0,17,0.3)] transition-all duration-300 hover:-translate-y-1 whitespace-nowrap"
        >
          <CalendarIcon className="size-6" />
          Schedule Donation
        </button>
      </div>

      {/* ── Bento Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* 1. Eligibility Card */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col justify-between ambient-shadow border border-outline-variant/10">
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                isEligible ? "bg-surface-container-high text-tertiary" : "bg-amber-100 text-amber-600"
              )}>
                {isEligible ? <Verified className="size-6" /> : <Clock className="size-6" />}
              </div>
              <div>
                <p className="font-body text-xs text-on-surface-variant uppercase tracking-wider font-semibold">Status</p>
                <h3 className="font-headline text-2xl font-bold text-on-surface">
                  {isEligible ? "Eligible to Donate" : "Cooldown Active"}
                </h3>
              </div>
            </div>
            <p className="font-body text-on-secondary-fixed-variant leading-relaxed text-sm">
              {isEligible 
                ? "Your biological markers and timeline requirements have cleared the minimum sanctuary thresholds."
                : `You are in the mandatory 84-day recovery period to protect your health. You can donate again on ${formatDate(donor?.nextEligibleDate)}.`}
            </p>
          </div>
          
          <div className="mt-8 pt-6 border-t border-surface-container border-dashed">
            <div className="flex justify-between text-sm font-body mb-2">
              <span className="text-on-surface-variant">Next Eligible Date</span>
              <span className="font-bold text-tertiary">{isEligible ? "Today" : formatDate(donor?.nextEligibleDate)}</span>
            </div>
            <div className="h-2 w-full bg-surface-container-high rounded-full overflow-hidden">
              <div className={cn("h-full rounded-full transition-all duration-1000", isEligible ? "bg-tertiary w-full" : "bg-amber-500 w-1/3")} />
            </div>
          </div>
        </div>

        {/* 2. Upcoming Reminders */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col ambient-shadow border border-outline-variant/10 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 text-surface-container-high/50 transform rotate-12 pointer-events-none">
            <CalendarIcon className="size-48" />
          </div>
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6 relative z-10">Upcoming Reminders</h3>
          
          <div className="flex-grow flex flex-col gap-4 relative z-10">
            {upcomingDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center opacity-70">
                <CalendarIcon className="size-10 text-secondary mb-3" />
                <p className="text-sm font-body text-on-surface-variant">No upcoming appointments.</p>
              </div>
            ) : (
              upcomingDonations.map((d: any) => {
                const date = new Date(d.scheduledAt);
                return (
                  <div key={d._id} className="bg-surface p-5 rounded-xl border border-surface-container-low/50 transition-all hover:bg-surface-container-low">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-lg bg-surface-container flex flex-col items-center justify-center text-on-surface flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-headline font-bold leading-none">{date.getDate()}</span>
                      </div>
                      <div>
                        <h4 className="font-bold font-headline text-on-surface text-base">Blood Donation</h4>
                        <p className="text-sm font-body text-on-surface-variant mt-1 flex items-center gap-1.5">
                          <MapPin className="size-4 text-tertiary" />
                          {d.hospitalId?.name || "Hospital"}
                        </p>
                        <p className="text-sm font-body text-on-surface-variant mt-1 flex items-center gap-1.5">
                          <Clock className="size-4 text-tertiary" />
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <button 
            onClick={() => navigate({ to: "/donations" })}
            className="mt-6 text-primary font-bold font-body text-sm flex items-center gap-1 hover:gap-2 transition-all relative z-10 w-max"
          >
            Manage Appointments <ArrowRight className="size-4" />
          </button>
        </div>

        {/* 3. Impact Stats */}
        <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col ambient-shadow border border-outline-variant/10">
          <h3 className="font-headline text-xl font-bold text-on-surface mb-6">Clinical Impact</h3>
          <div className="grid grid-cols-2 gap-4 flex-grow">
            <div className="bg-surface-bright p-5 rounded-xl flex flex-col justify-center">
              <Activity className="size-6 text-tertiary mb-3" />
              <span className="text-4xl font-headline font-black text-on-surface">{donor?.totalDonations ? donor.totalDonations * 3 : 0}</span>
              <span className="text-xs font-body text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Lives Saved</span>
            </div>
            <div className="bg-surface-bright p-5 rounded-xl flex flex-col justify-center">
              <Droplets className="size-6 text-tertiary mb-3" />
              <span className="text-4xl font-headline font-black text-on-surface">{donor?.totalDonations || 0}</span>
              <span className="text-xs font-body text-on-surface-variant uppercase tracking-wider font-semibold mt-1">Total Donations</span>
            </div>
            
            <div className="col-span-2 bg-surface-container p-5 rounded-xl flex items-center justify-between mt-2">
              <div>
                <span className="text-xs font-body text-on-surface-variant uppercase tracking-wider font-semibold">Registered Type</span>
                <div className="text-2xl font-headline font-bold text-on-surface mt-1">{donor?.bloodType || "Pending"}</div>
              </div>
              <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center shadow-sm">
                <Heart className="size-7 text-primary" />
              </div>
            </div>
          </div>
        </div>

        {/* 4. Urgent Local Requests (Map & List) */}
        <div className="col-span-12 lg:col-span-8 bg-white rounded-2xl overflow-hidden ambient-shadow border border-outline-variant/10 flex flex-col lg:flex-row relative h-[500px]">
          {/* Map Area (Placeholder image matching design) */}
          <div className="w-full lg:w-3/5 h-64 lg:h-full relative bg-surface-container-low flex items-center justify-center overflow-hidden">
            <img 
              alt="Map of nearby requests" 
              className="w-full h-full object-cover opacity-80 mix-blend-multiply" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBCjLDBVbh0PzbiBCSkZailBViaeGwXE4uzG7Dg_YsykCKAVcRRQM-REDMxIQD7D4CvxcERoTl5__dRU7SvMkfVQ1UeU4aGFQ1Q6Ak1Qsz0lJWsFNLdQkhx27yP5LLWiKMOxWcm-yMYHSUv48YIvdhqvCIIwsPScRvddAd-qBCEELHneqq_tj6kaHgb9unp5k_RmaDdOY3tImN_Sc-pq1oY393C0Ad0CUYuMUDCV8Cp9Ow217M4hfV2Ulby7CoBapRZekWXS_I295o"
            />
            {/* Map Markers */}
            <div className="absolute top-1/4 left-1/3">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-12 h-12 bg-primary/20 rounded-full animate-ping" />
                <div className="w-6 h-6 bg-primary rounded-full border-4 border-white shadow-md z-10" />
              </div>
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <div className="relative flex items-center justify-center">
                <div className="w-5 h-5 bg-tertiary rounded-full border-4 border-white shadow-md z-10" />
              </div>
            </div>
          </div>
          
          {/* List Area */}
          <div className="w-full lg:w-2/5 bg-white/95 backdrop-blur-md p-6 lg:p-8 flex flex-col border-l border-surface-container-low h-full z-10">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline text-xl font-bold text-on-surface">Nearby Requests</h3>
            </div>
            
            <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-4 scrollbar-hide">
              {nearbyRequests?.items?.length > 0 ? (
                nearbyRequests.items.map((req: any) => {
                  const isUrgent = req.urgency === "CRITICAL" || req.urgency === "HIGH";
                  return (
                    <div 
                      key={req._id} 
                      className={cn(
                        "rounded-xl p-4 transition-all cursor-pointer border",
                        isUrgent 
                          ? "bg-error-container/30 border-error-container hover:bg-error-container/50" 
                          : "bg-surface border-surface-container-low hover:bg-surface-container-low"
                      )}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={cn(
                          "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-bold uppercase tracking-wider rounded",
                          isUrgent ? "bg-primary text-white" : "bg-surface-container-high text-on-surface"
                        )}>
                          {isUrgent && <AlertTriangle className="size-3" />} 
                          {req.urgency}
                        </span>
                        <span className="text-xs font-body text-on-surface-variant flex items-center gap-1">
                          <BloodTypeBadge type={req.bloodType} />
                        </span>
                      </div>
                      <h4 className="font-headline font-bold text-on-surface text-base">{req.hospitalId?.name}</h4>
                      <p className="text-sm font-body text-on-surface-variant mt-1 line-clamp-2">{req.notes || "Blood needed for patient."}</p>
                    </div>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center py-10 opacity-60">
                  <Heart className="size-10 mb-3 text-tertiary" />
                  <p className="text-sm">No active requests nearby.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 5. Donation History */}
        <div className="col-span-12 lg:col-span-4 bg-white rounded-2xl p-8 flex flex-col ambient-shadow border border-outline-variant/10">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-headline text-xl font-bold text-on-surface">Recent History</h3>
            <button 
              onClick={() => navigate({ to: "/donations" })}
              className="text-tertiary font-bold font-body text-sm hover:underline"
            >
              View Log
            </button>
          </div>
          
          <div className="flex flex-col gap-6">
            {pastDonations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 opacity-60 text-center">
                <History className="size-10 mb-3 text-secondary" />
                <p className="text-sm">Your completed donations will appear here.</p>
              </div>
            ) : (
              pastDonations.slice(0, 4).map((d: any) => (
                <div key={d._id} className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-tertiary flex-shrink-0 mt-1">
                    <CheckCircle2 className="size-5" />
                  </div>
                  <div>
                    <h4 className="font-headline font-bold text-on-surface">Whole Blood Donation</h4>
                    <p className="text-sm font-body text-on-surface-variant">{d.hospitalId?.name}</p>
                    <p className="text-xs font-body text-secondary mt-1">{formatDate(d.scheduledAt)} • 450ml</p>
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