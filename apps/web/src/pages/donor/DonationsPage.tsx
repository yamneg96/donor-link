import { useState } from "react";
import { Heart, Calendar as CalendarIcon, Clock, CheckCircle2, MapPin, Search, ArrowRight, XCircle } from "lucide-react";
import { useMyDonations, useCheckEligibility, useScheduleDonation, useDonorProfile } from "../../hooks/useApi";
import { FullPageSpinner, Badge, Button, Input } from "../../components/ui";
import { formatDate, cn } from "../../lib/utils";
import { useForm } from "react-hook-form";

export default function DonationsPage() {
  const { data: donations, isLoading } = useMyDonations();
  const { data: donor } = useDonorProfile();
  const schedule = useScheduleDonation();
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      hospitalId: "",
      scheduledAt: "",
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await schedule.mutateAsync({
        hospitalId: data.hospitalId,
        scheduledAt: new Date(data.scheduledAt).toISOString(),
      });
      setShowScheduleModal(false);
    } catch (error) {
      console.error(error);
    }
  };

  if (isLoading) return <FullPageSpinner />;

  const items = donations?.items || [];
  const upcoming = items.filter((d: any) => d.status === "scheduled");
  const past = items.filter((d: any) => d.status !== "scheduled");

  return (
    <div className="flex-1 w-full max-w-[1200px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <h1 className="font-headline text-4xl font-bold text-on-surface">Donations Log</h1>
          <p className="text-sm font-body text-secondary mt-2 max-w-2xl">
            Track your life-saving contributions and manage upcoming appointments.
          </p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="px-6 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-body font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 ambient-shadow btn-glow"
        >
          <CalendarIcon className="size-5" />
          Schedule Donation
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* ── Left Column: Upcoming ────────────────────────────────────── */}
        <div className="md:col-span-1 space-y-6">
          <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
            <Clock className="size-5 text-tertiary" /> Upcoming
          </h3>

          {upcoming.length === 0 ? (
            <div className="bg-surface-container-lowest border border-outline-variant/10 rounded-2xl p-8 text-center ambient-shadow flex flex-col items-center">
              <CalendarIcon className="size-12 text-secondary mb-3 opacity-50" />
              <p className="text-sm font-body text-on-surface-variant mb-4">No upcoming appointments.</p>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="text-primary font-bold font-body text-sm hover:underline"
              >
                Schedule one now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.map((d: any) => {
                const date = new Date(d.scheduledAt);
                return (
                  <div key={d._id} className="bg-white rounded-2xl p-5 ambient-shadow border border-outline-variant/10 transition-all hover:border-primary/20">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex flex-col items-center justify-center text-on-surface flex-shrink-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider">{date.toLocaleString('en-US', { month: 'short' })}</span>
                        <span className="text-xl font-headline font-bold leading-none">{date.getDate()}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold font-headline text-on-surface text-base">Blood Donation</h4>
                        <p className="text-sm font-body text-on-surface-variant mt-1 flex items-center gap-1.5">
                          <MapPin className="size-4 text-tertiary" />
                          {d.hospitalId?.name || "Hospital"}
                        </p>
                        <p className="text-xs font-body text-secondary mt-1 flex items-center gap-1.5">
                          <Clock className="size-3.5" />
                          {date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-surface-container-low flex justify-end">
                      <button className="text-xs font-bold text-error hover:text-error-container transition-colors flex items-center gap-1">
                        <XCircle className="size-3.5" /> Cancel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Right Column: History ────────────────────────────────────── */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-headline text-xl font-bold text-on-surface flex items-center gap-2">
              <Heart className="size-5 text-tertiary" /> Past Donations
            </h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-secondary" />
              <input 
                type="text" 
                placeholder="Search history..." 
                className="pl-9 pr-4 py-2 bg-white border border-outline-variant/20 rounded-lg text-sm font-body focus:ring-2 focus:ring-primary/20 outline-none"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl ambient-shadow border border-outline-variant/10 overflow-hidden">
            {past.length === 0 ? (
              <div className="p-10 text-center">
                <Heart className="size-12 text-secondary mx-auto mb-3 opacity-50" />
                <p className="text-sm font-body text-on-surface-variant">Your completed donations will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-surface-container-low">
                {past.map((d: any) => (
                  <div key={d._id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-surface-container-lowest transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0",
                        d.status === "completed" ? "bg-surface-container-high text-tertiary" : "bg-error-container/50 text-error"
                      )}>
                        {d.status === "completed" ? <CheckCircle2 className="size-5" /> : <XCircle className="size-5" />}
                      </div>
                      <div>
                        <h4 className="font-headline font-bold text-on-surface">Whole Blood</h4>
                        <p className="text-sm font-body text-secondary mt-0.5">{d.hospitalId?.name || "Hospital"}</p>
                      </div>
                    </div>
                    <div className="flex items-center sm:flex-col sm:items-end gap-3 sm:gap-1 pl-14 sm:pl-0">
                      <span className={cn(
                        "inline-block px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider",
                        d.status === "completed" ? "bg-surface-container-low text-tertiary" : "bg-error-container text-error"
                      )}>
                        {d.status}
                      </span>
                      <p className="text-xs font-body text-on-surface-variant font-semibold">{formatDate(d.scheduledAt)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Basic Scheduling Modal (Mocked for now since we don't have hospital search UI built in this component) */}
      {showScheduleModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full ambient-shadow animate-fade-in border border-outline-variant/10">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-2">Schedule Donation</h2>
            <p className="text-sm font-body text-on-surface-variant mb-6">Select a hospital and time.</p>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-xs font-body font-bold text-on-surface-variant mb-1">Hospital ID (Test)</label>
                <Input {...register("hospitalId")} placeholder="Paste hospital ID here" />
              </div>
              <div>
                <label className="block text-xs font-body font-bold text-on-surface-variant mb-1">Date & Time</label>
                <Input {...register("scheduledAt")} type="datetime-local" />
              </div>
              
              <div className="flex justify-end gap-3 mt-8">
                <button 
                  type="button" 
                  onClick={() => setShowScheduleModal(false)}
                  className="px-5 py-2.5 rounded-xl font-body text-sm font-semibold text-secondary hover:bg-surface-container transition-colors"
                >
                  Cancel
                </button>
                <Button type="submit" loading={schedule.isPending} className="px-6 rounded-xl">
                  Confirm
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}