import { useState } from "react";
import { useForm } from "react-hook-form";
import { 
  Download, Edit, MapPin, Droplets, Activity, HandHeart, 
  CheckCircle, Clock, Save, X, ActivitySquare, AlertCircle, Verified
} from "lucide-react";
import { authStore } from "../../store/authStore";
import { useDonorProfile, useUpdateDonorProfile, useMyDonations } from "../../hooks/useApi";
import { FullPageSpinner, Badge, AlertBanner, Input } from "../../components/ui";
import { formatDate, timeAgo, cn } from "../../lib/utils";

export default function ProfilePage() {
  const { user } = authStore.getState();
  const { data: donor, isLoading } = useDonorProfile();
  const { data: donations } = useMyDonations();
  const updateProfile = useUpdateDonorProfile();
  
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      weight: donor?.weight || 0,
      availableForEmergency: donor?.availableForEmergency ?? true,
    }
  });

  const onSubmit = async (data: any) => {
    setError("");
    try {
      await updateProfile.mutateAsync(data);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message);
    }
  };

  if (isLoading) return <FullPageSpinner />;

  const isEligible = !donor?.nextEligibleDate || new Date(donor.nextEligibleDate) <= new Date();
  const dob = donor?.dateOfBirth ? new Date(donor.dateOfBirth) : null;
  const age = dob ? new Date().getFullYear() - dob.getFullYear() : "N/A";
  const pastDonations = donations?.items?.filter((d: any) => d.status === "completed") || [];

  return (
    <div className="flex-1 w-full max-w-[1600px] mx-auto space-y-8 animate-fade-in pb-10">
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-10">
        <div>
          <p className="text-sm font-body text-secondary mb-1 flex items-center gap-2 uppercase tracking-wider font-semibold">
            Donor Profile
          </p>
          <h1 className="font-headline text-4xl font-bold text-on-surface">
            {user?.firstName} {user?.lastName}
          </h1>
        </div>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl bg-surface-container-high text-on-surface font-body font-semibold text-sm hover:bg-surface-dim transition-colors flex items-center gap-2">
            <Download className="size-4" />
            Export Record
          </button>
          <button 
            onClick={() => setIsEditing(!isEditing)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 ambient-shadow"
          >
            {isEditing ? <X className="size-4" /> : <Edit className="size-4" />}
            {isEditing ? "Cancel Edit" : "Edit Profile"}
          </button>
        </div>
      </div>

      {error && <AlertBanner message={error} onDismiss={() => setError("")} />}

      {/* ── Bento Grid ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-12 gap-8">
        
        {/* Column 1: Core Identity & Vitals (4 cols) */}
        <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
          
          {/* Profile Card */}
          <div className="bg-white rounded-2xl p-8 ambient-shadow relative overflow-hidden border border-outline-variant/10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
            
            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 mb-8 text-center sm:text-left">
              <div className="w-24 h-24 rounded-2xl bg-surface-container-high flex items-center justify-center flex-shrink-0 ghost-border text-4xl font-headline font-bold text-primary">
                {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
              </div>
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container-low text-tertiary text-xs font-semibold font-body mb-3">
                  <Verified className="size-4" />
                  Active Donor
                </div>
                <p className="text-sm font-body text-secondary mb-1">
                  Registered: {formatDate(user?.createdAt!)}
                </p>
                {user?.address?.city && (
                  <p className="text-sm font-body text-on-surface-variant flex items-center justify-center sm:justify-start gap-1">
                    <MapPin className="size-4 text-secondary" />
                    {user.address.city}, {user.address.region}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6 pt-6 border-t border-surface-container-low">
              <div>
                <label className="block text-xs font-body font-bold text-on-surface-variant mb-1 uppercase tracking-wider">Blood Type</label>
                <div className="text-2xl font-headline font-bold text-primary flex items-center gap-3">
                  {donor?.bloodType || "Pending"}
                  {donor?.bloodType === "O-" && (
                    <span className="px-2 py-0.5 rounded text-[10px] bg-primary/10 text-primary uppercase tracking-widest font-bold">Universal</span>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-body font-bold text-on-surface-variant mb-1">DOB / Age</label>
                  <p className="text-sm font-body text-on-surface font-semibold">{formatDate(donor?.dateOfBirth)} ({age})</p>
                </div>
                <div>
                  <label className="block text-xs font-body font-bold text-on-surface-variant mb-1">Weight</label>
                  <p className="text-sm font-body text-on-surface font-semibold">{donor?.weight || "—"} kg</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-body font-bold text-on-surface-variant mb-1">Phone Number</label>
                  <p className="text-sm font-body text-on-surface font-semibold">{user?.phone || "—"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Eligibility Indicator */}
          <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
            <h3 className="font-headline text-lg font-bold text-on-surface mb-6 flex items-center gap-2">
              <HandHeart className="size-5 text-tertiary" />
              Clinical Eligibility
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl bg-surface-container-low">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center text-tertiary">
                    <Droplets className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-headline font-bold text-on-surface">Whole Blood</p>
                    <p className={cn("text-xs font-body font-medium mt-0.5", isEligible ? "text-secondary" : "text-amber-600")}>
                      {isEligible ? "Eligible to donate" : "Cooldown Active"}
                    </p>
                  </div>
                </div>
                {isEligible ? (
                  <CheckCircle className="size-5 text-tertiary" />
                ) : (
                  <span className="text-xs font-bold text-amber-600 bg-amber-100 px-2 py-1 rounded">
                    Until {new Date(donor?.nextEligibleDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                  </span>
                )}
              </div>
            </div>
          </div>
          
        </div>

        {/* Column 2: Medical Form & History (8 cols) */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          
          {/* Editable Medical Info Form */}
          <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-headline text-2xl font-bold text-on-surface">Medical Intake & Vitals</h2>
              <span className="text-xs font-body text-secondary bg-surface-container px-3 py-1 rounded-full font-semibold">
                {isEditing ? "Editing Mode" : "Read Only"}
              </span>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Section: Vital Stats */}
              <div>
                <h4 className="text-sm font-headline font-bold text-on-surface mb-4 border-b border-surface-container-high pb-3 flex items-center gap-2">
                  <ActivitySquare className="size-4 text-tertiary" />
                  Self-Reported Vitals
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {isEditing ? (
                    <Input
                      {...register("weight", { valueAsNumber: true })}
                      label="Weight (kg)"
                      type="number"
                      error={errors.weight?.message as string}
                    />
                  ) : (
                    <div>
                      <label className="block text-xs font-body font-bold text-on-surface-variant mb-2">Weight</label>
                      <div className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-sm font-body font-semibold text-on-surface">
                        {donor?.weight || "—"} kg
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-xs font-body font-bold text-on-surface-variant mb-2">Available for Emergency</label>
                    <div className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-sm font-body font-semibold text-on-surface flex items-center justify-between">
                      <span>{donor?.availableForEmergency ? "Yes, contact me anytime" : "Standard hours only"}</span>
                      {isEditing && (
                        <input type="checkbox" {...register("availableForEmergency")} className="rounded text-primary focus:ring-primary w-5 h-5" />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Section: Clinical Settings */}
              <div>
                <h4 className="text-sm font-headline font-bold text-on-surface mb-4 border-b border-surface-container-high pb-3 flex items-center gap-2">
                  <AlertCircle className="size-4 text-tertiary" />
                  Clinical Notifications
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-body font-bold text-on-surface-variant mb-2">Emergency Only Mode</label>
                    <div className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-sm font-body font-semibold text-on-surface">
                      {donor?.notificationPreferences?.emergencyOnly ? "Enabled" : "Disabled (Receive all alerts)"}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-body font-bold text-on-surface-variant mb-2">Max Alerts Per Day</label>
                    <div className="w-full bg-surface-container-low rounded-lg py-3 px-4 text-sm font-body font-semibold text-on-surface">
                      {donor?.notificationPreferences?.maxAlertsPerDay || 3} alerts
                    </div>
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-3 pt-6 border-t border-surface-container-low">
                  <button 
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2.5 rounded-xl text-on-surface-variant font-body font-semibold text-sm hover:bg-surface-container transition-colors" 
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={updateProfile.isPending}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-body font-semibold text-sm hover:opacity-90 transition-opacity flex items-center gap-2 btn-glow"
                  >
                    {updateProfile.isPending ? <Clock className="size-4 animate-spin" /> : <Save className="size-4" />}
                    Save Changes
                  </button>
                </div>
              )}
            </form>
          </div>

          {/* Donation Timeline */}
          <div className="bg-white rounded-2xl p-8 ambient-shadow border border-outline-variant/10">
            <h2 className="font-headline text-2xl font-bold text-on-surface mb-8">Donation History</h2>
            
            {pastDonations.length === 0 ? (
              <div className="text-center py-10 opacity-70">
                <Clock className="size-12 mx-auto text-secondary mb-3" />
                <p className="text-sm font-body">No completed donations on record yet.</p>
              </div>
            ) : (
              <div className="relative border-l-2 border-surface-container-high ml-4 space-y-10 pb-4">
                {pastDonations.map((d: any, i: number) => (
                  <div key={d._id} className="relative pl-8">
                    {/* Timeline dot */}
                    <div className={cn(
                      "absolute -left-[9px] top-1 w-4 h-4 rounded-full ring-4 ring-white",
                      i === 0 ? "bg-tertiary" : "bg-surface-container-high"
                    )} />
                    
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-2">
                      <div>
                        <h4 className="text-base font-headline font-bold text-on-surface">Whole Blood Donation</h4>
                        <p className="text-sm font-body text-secondary mt-0.5">{d.hospitalId?.name || "Hospital Clinic"}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <span className="inline-block px-2.5 py-1 rounded bg-surface-container-low text-tertiary text-xs font-bold mb-1.5 uppercase tracking-wider">
                          Successful
                        </span>
                        <p className="text-xs font-body text-on-surface-variant font-semibold">{formatDate(d.scheduledAt)}</p>
                      </div>
                    </div>
                    <p className="text-sm font-body text-on-surface-variant leading-relaxed">
                      Standard draw. Vitals normal. Processed into component inventory.
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}