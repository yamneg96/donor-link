import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle, ArrowRight, HeartPulse, User, CheckCircle2, Search } from "lucide-react";
import { createBloodRequestSchema, type CreateBloodRequestInput } from "@donorlink/validators";
import { useCreateRequest } from "../../hooks/useApi";
import { Button, Input, Select, AlertBanner } from "../../components/ui";
import { getApiError } from "../../lib/utils";
import { BloodType, RequestUrgency } from "@donorlink/types";

const BT_OPTIONS = Object.values(BloodType).map((v) => ({ value: v, label: v }));
const URGENCY_OPTIONS = [
  { value: RequestUrgency.CRITICAL, label: "Critical Priority (Under 2 hours)" },
  { value: RequestUrgency.URGENT,   label: "Urgent Priority (Under 24 hours)" },
  { value: RequestUrgency.STANDARD, label: "Standard Need (Planned)" },
];

export function NewRequestPage() {
  const navigate = useNavigate();
  const create = useCreateRequest();
  const [error, setError] = useState("");
  const [step, setStep] = useState(1);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm<CreateBloodRequestInput>({
    resolver: zodResolver(createBloodRequestSchema),
    defaultValues: { unitsNeeded: 1, radiusKm: 50, expiresInHours: 24, urgency: RequestUrgency.STANDARD, bloodType: BloodType.O_POS },
  });

  const urgency = watch("urgency");
  const bloodType = watch("bloodType");
  const unitsNeeded = watch("unitsNeeded");

  const onSubmit = async (data: CreateBloodRequestInput) => {
    setError("");
    try {
      await create.mutateAsync(data);
      navigate({ to: "/hospital" });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  const nextStep = async () => {
    const valid = await trigger();
    if (valid) setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  return (
    <div className="flex-1 w-full max-w-[1000px] mx-auto space-y-8 animate-fade-in pb-10">
      
      {/* ── Page Header ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-4">
        <div>
          <button
            onClick={() => navigate({ to: "/hospital" })}
            className="flex items-center gap-2 text-sm text-secondary font-body font-semibold hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft className="size-4" /> Return to Command Center
          </button>
          <h1 className="font-headline text-4xl font-bold text-on-surface">New Clinical Request</h1>
          <p className="text-sm font-body text-on-surface-variant mt-2 max-w-2xl">
            Initiate a matched donor search across the sanctuary network.
          </p>
        </div>
      </div>

      {error && <AlertBanner message={error} onDismiss={() => setError("")} />}

      {/* ── Stepper Header ───────────────────────────────────────────── */}
      <div className="flex items-center justify-between bg-white p-6 rounded-2xl ambient-shadow border border-outline-variant/10">
        {[
          { num: 1, label: "Patient Details", icon: <User className="size-5" /> },
          { num: 2, label: "Clinical Requirements", icon: <HeartPulse className="size-5" /> },
          { num: 3, label: "Review & Broadcast", icon: <CheckCircle2 className="size-5" /> },
        ].map((s, i) => (
          <div key={s.num} className="flex items-center flex-1">
            <div className="flex flex-col items-center flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg mb-2 transition-colors ${
                step >= s.num 
                  ? "bg-gradient-to-br from-primary to-primary-container text-white shadow-md" 
                  : "bg-surface-container-low text-secondary"
              }`}>
                {step > s.num ? <CheckCircle2 className="size-6" /> : s.icon}
              </div>
              <span className={`text-xs font-headline font-bold uppercase tracking-wider ${
                step >= s.num ? "text-on-surface" : "text-secondary"
              }`}>
                {s.label}
              </span>
            </div>
            {i < 2 && (
              <div className={`h-1 flex-1 mx-4 rounded-full transition-colors ${
                step > s.num ? "bg-primary" : "bg-surface-container"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* ── Form Content ──────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-8 md:p-10 ambient-shadow border border-outline-variant/10 min-h-[400px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* STEP 1: Patient Details */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Patient Identification</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  {...register("patientName")}
                  label="Patient Identifier (Optional)"
                  placeholder="e.g. PT-2948 or Patient Initials"
                  hint="Kept internal to your hospital. Not shared with donors."
                  error={errors.patientName?.message}
                />
                
                <Select
                  {...register("bloodType")}
                  label="Verified Blood Type"
                  options={BT_OPTIONS}
                  error={errors.bloodType?.message}
                />
              </div>

              <div>
                <label className="block text-xs font-body font-bold text-on-surface-variant mb-2">Clinical Notes & Justification (Optional)</label>
                <textarea
                  {...register("notes")}
                  rows={4}
                  placeholder="Include context for this request if necessary..."
                  className="w-full bg-surface-container-low border border-transparent focus:border-primary/20 focus:ring-1 focus:ring-primary/20 rounded-xl py-3 px-4 text-sm font-body text-on-surface transition-all resize-none"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Clinical Requirements */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Fulfillment Parameters</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <Select
                    {...register("urgency")}
                    label="Triage / Urgency Level"
                    options={URGENCY_OPTIONS}
                    error={errors.urgency?.message}
                  />

                  <Input
                    {...register("unitsNeeded", { valueAsNumber: true })}
                    label="Units Required"
                    type="number"
                    min={1} max={20}
                    error={errors.unitsNeeded?.message}
                  />
                </div>

                <div className="space-y-6">
                  <Input
                    {...register("radiusKm", { valueAsNumber: true })}
                    label="Broadcast Radius (km)"
                    type="number"
                    min={1} max={200}
                    hint="Expands geographic reach for rare types"
                    error={errors.radiusKm?.message}
                  />

                  <Input
                    {...register("expiresInHours", { valueAsNumber: true })}
                    label="Request Lifespan (Hours)"
                    type="number"
                    min={1} max={72}
                    error={errors.expiresInHours?.message}
                  />
                </div>
              </div>

              {urgency === RequestUrgency.CRITICAL && (
                <div className="p-5 bg-error-container/20 border border-error-container rounded-xl flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-error flex items-center justify-center text-white flex-shrink-0 mt-1">
                    <AlertTriangle className="size-5" />
                  </div>
                  <div>
                    <p className="text-base font-headline font-bold text-error">Critical Broadcast Active</p>
                    <p className="text-sm font-body text-on-surface-variant mt-1">
                      This will trigger immediate SMS and push notifications to all eligible donors within {watch("radiusKm")}km, bypassing their standard notification hours. Use strictly for life-threatening shortages.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Review & Broadcast */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <h2 className="font-headline text-2xl font-bold text-on-surface mb-6">Verification Summary</h2>
              
              <div className="bg-surface-container-lowest rounded-xl border border-surface-variant/50 overflow-hidden">
                <div className="bg-surface-container p-4 flex justify-between items-center border-b border-surface-variant/50">
                  <span className="font-headline font-bold text-on-surface flex items-center gap-2">
                    <Search className="size-4" /> Pre-Broadcast Check
                  </span>
                  <span className={`px-3 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${
                    urgency === RequestUrgency.CRITICAL ? "bg-error text-white" : "bg-primary text-white"
                  }`}>
                    {urgency}
                  </span>
                </div>
                
                <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-xs font-body font-bold text-secondary uppercase tracking-wider mb-1">Blood Type</p>
                    <p className="font-headline font-bold text-2xl text-primary">{bloodType}</p>
                  </div>
                  <div>
                    <p className="text-xs font-body font-bold text-secondary uppercase tracking-wider mb-1">Quantity</p>
                    <p className="font-headline font-bold text-2xl text-on-surface">{unitsNeeded} Units</p>
                  </div>
                  <div>
                    <p className="text-xs font-body font-bold text-secondary uppercase tracking-wider mb-1">Search Radius</p>
                    <p className="font-headline font-bold text-lg text-on-surface">{watch("radiusKm")} km</p>
                  </div>
                  <div>
                    <p className="text-xs font-body font-bold text-secondary uppercase tracking-wider mb-1">Expiration</p>
                    <p className="font-headline font-bold text-lg text-on-surface">{watch("expiresInHours")} hrs</p>
                  </div>
                </div>
              </div>

              <p className="text-sm font-body text-secondary text-center mt-6">
                By confirming, DonorLink will algorithmically match and alert eligible donors in the sanctuary network.
              </p>
            </div>
          )}

          {/* ── Navigation ──────────────────────────────────────────────── */}
          <div className="flex justify-between items-center pt-8 border-t border-surface-container-low mt-8">
            {step > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 rounded-xl font-body font-semibold text-secondary hover:bg-surface-container transition-colors"
              >
                Back
              </button>
            ) : <div />}
            
            {step < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 rounded-xl bg-surface-container-high text-on-surface font-body font-semibold hover:bg-surface-dim transition-colors flex items-center gap-2"
              >
                Continue <ArrowRight className="size-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={create.isPending}
                className="px-8 py-3 rounded-xl bg-gradient-to-br from-primary to-primary-container text-white font-body font-semibold hover:opacity-90 transition-opacity flex items-center gap-2 btn-glow"
              >
                {create.isPending ? "Broadcasting..." : "Broadcast Request"}
              </button>
            )}
          </div>
        </form>
      </div>

    </div>
  );
}