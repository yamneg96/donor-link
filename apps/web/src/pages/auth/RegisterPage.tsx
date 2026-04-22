import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, Link } from "@tanstack/react-router";
import { Droplets, ChevronRight, ChevronLeft, Check } from "lucide-react";
import { registerDonorSchema, type RegisterDonorInput } from "@donorlink/validators";
import { useRegisterDonor } from "../../hooks/useApi";
import { Button, Input, Select, AlertBanner, HipaaTag } from "../../components/ui";
import { getApiError, cn } from "../../lib/utils";
import { BloodType, IdDocumentType, RegionEthiopia } from "@donorlink/types";

const STEPS = ["Personal", "Identity", "Health", "Review"];

const BT_OPTIONS  = Object.values(BloodType).map(v => ({ value: v, label: v }));
const IDT_OPTIONS = [
  { value: IdDocumentType.NATIONAL_ID,     label: "National ID (Fayda)" },
  { value: IdDocumentType.PASSPORT,        label: "Passport" },
  { value: IdDocumentType.DRIVER_LICENSE,  label: "Driver's License" },
];
const REGION_OPTIONS = Object.values(RegionEthiopia).map(v => ({ value: v, label: v }));

export function RegisterPage() {
  const navigate = useNavigate();
  const reg = useRegisterDonor();
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");

  const { register, handleSubmit, watch, trigger, formState: { errors } } = useForm<RegisterDonorInput>({
    resolver: zodResolver(registerDonorSchema),
    defaultValues: { availableForEmergency: true, idDocument: { type: IdDocumentType.NATIONAL_ID } as any },
  });

  const STEP_FIELDS: (keyof RegisterDonorInput)[][] = [
    ["firstName","lastName","phone","email","password"],
    ["idDocument","address"],
    ["bloodType","dateOfBirth","weight"],
    [],
  ];

  const next = async () => { const ok = await trigger(STEP_FIELDS[step] as any); if (ok) setStep(s => s+1); };
  const w = watch();

  const onSubmit = async (data: RegisterDonorInput) => {
    setError("");
    try { await reg.mutateAsync(data); navigate({ to: "/dashboard" }); }
    catch (err) { setError(getApiError(err)); setStep(0); }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left panel - Brand & Step Guide */}
      <div className="hidden lg:flex flex-col justify-between w-5/12 bg-sidebar p-12 border-r border-border">
        <div className="flex items-center gap-3">
          <div className="size-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
            <Droplets className="size-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-sidebar-foreground">DonorLink Ethiopia</span>
        </div>
        <div>
          <p className="font-bold text-4xl text-sidebar-foreground leading-tight mb-4">
            Join 120,000+<br />life-savers.
          </p>
          <p className="text-muted-foreground leading-relaxed max-w-xs mb-10">
            Register as a donor and receive alerts when your blood type is urgently needed nearby.
          </p>
          
          <div className="space-y-4">
            {STEPS.map((label, i) => (
              <div key={i} className={cn("flex items-center gap-3 transition-opacity", i > step && "opacity-30")}>
                <div className={cn("size-8 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-colors",
                  i < step ? "bg-emerald-500 text-white" : i === step ? "bg-primary text-primary-foreground" : "bg-sidebar-accent text-muted-foreground")}>
                  {i < step ? <Check className="size-4" /> : i + 1}
                </div>
                <span className={cn("font-semibold text-sm", i === step ? "text-sidebar-foreground" : "text-muted-foreground")}>{label}</span>
              </div>
            ))}
          </div>
        </div>
        <HipaaTag />
      </div>

      {/* Right panel - Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          {/* Mobile step bar */}
          <div className="flex gap-1.5 mb-8 lg:hidden">
            {STEPS.map((_, i) => (
              <div key={i} className={cn("flex-1 h-1 rounded-full transition-colors", i <= step ? "bg-primary" : "bg-muted")} />
            ))}
          </div>

          <h2 className="font-bold text-2xl text-foreground mb-1">{STEPS[step]}</h2>
          <p className="text-sm text-muted-foreground mb-6">Step {step + 1} of {STEPS.length}</p>

          {error && <div className="mb-5"><AlertBanner message={error} onDismiss={() => setError("")} /></div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            {step === 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="grid grid-cols-2 gap-3">
                  <Input {...register("firstName")} label="First name" placeholder="Abebe" error={errors.firstName?.message} />
                  <Input {...register("lastName")} label="Last name" placeholder="Kebede" error={errors.lastName?.message} />
                </div>
                <Input {...register("amharicName")} label="Amharic name (optional)" placeholder="አበበ ከበደ" className="font-amharic" />
                <Input {...register("phone")} label="Phone" placeholder="+251 9__ ___ ___" type="tel" error={errors.phone?.message} />
                <Input {...register("email")} label="Email (optional)" placeholder="abebe@example.com" type="email" error={errors.email?.message} />
                <Input {...register("password")} label="Password" type="password" placeholder="Min. 8 characters"
                  error={errors.password?.message} hint="Uppercase letter + number required" />
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl mb-2">
                  <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">ID Verification</p>
                  <p className="text-sm text-muted-foreground">Your identity is verified against national records. Data is encrypted.</p>
                </div>
                <Select {...register("idDocument.type")} label="Document type" options={IDT_OPTIONS} error={errors.idDocument?.type?.message} />
                <Input {...register("idDocument.number")} label="Document number" placeholder="ETH-XXXXXXXXX" error={errors.idDocument?.number?.message} />
                <Select {...register("address.region")} label="Region" options={REGION_OPTIONS} placeholder="Select your region" error={errors.address?.region?.message} />
                <div className="grid grid-cols-2 gap-3">
                  <Input {...register("address.city")} label="City / Town" placeholder="Addis Ababa" error={errors.address?.city?.message} />
                  <Input {...register("address.subcity")} label="Subcity" placeholder="Bole" />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <Select {...register("bloodType")} label="Blood type" options={BT_OPTIONS} placeholder="Select blood type" error={errors.bloodType?.message} />
                <Input {...register("dateOfBirth")} label="Date of birth" type="date" error={errors.dateOfBirth?.message} />
                <Input {...register("weight", { valueAsNumber: true })} label="Weight (kg)" type="number" placeholder="65" min="45"
                  hint="Minimum 45 kg to donate" error={errors.weight?.message} />
                <label className="flex items-start gap-3 cursor-pointer bg-muted/50 p-4 rounded-2xl border border-border">
                  <input type="checkbox" {...register("availableForEmergency")} className="mt-1 rounded border-border text-primary focus:ring-primary" />
                  <span className="text-sm text-foreground">
                    <span className="font-semibold">Available for emergency requests.</span>{" "}
                    <span className="text-muted-foreground">You'll receive high-priority alerts when critical blood is needed nearby.</span>
                  </span>
                </label>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-muted/30 border border-border rounded-2xl p-4 space-y-2">
                  {[
                    ["Full name",   `${w.firstName ?? ""} ${w.lastName ?? ""}`],
                    ["Phone",       w.phone ?? ""],
                    ["ID type",     w.idDocument?.type?.replace(/_/g," ") ?? ""],
                    ["ID number",   w.idDocument?.number ?? ""],
                    ["Region",       w.address?.region ?? ""],
                    ["Blood type",   w.bloodType ?? ""],
                    ["Weight",       w.weight ? `${w.weight} kg` : ""],
                    ["Emergency",    w.availableForEmergency ? "Yes" : "No"],
                  ].map(([l, v]) => (
                    <div key={l} className="flex justify-between items-center py-1.5 border-b border-border last:border-0">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{l}</span>
                      <span className="text-sm font-semibold text-foreground capitalize">{v}</span>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  By registering you agree to DonorLink's terms of service and consent to be contacted for blood donation requests.
                </p>
              </div>
            )}

            <div className="flex justify-between mt-6 pt-4 border-t border-border">
              {step > 0
                ? <Button variant="secondary" type="button" onClick={() => setStep(s=>s-1)}><ChevronLeft className="size-4" /> Back</Button>
                : <div />}
              {step < STEPS.length - 1
                ? <Button type="button" onClick={next}>Continue <ChevronRight className="size-4" /></Button>
                : <Button type="submit" loading={reg.isPending}><Check className="size-4" /> Create account</Button>}
            </div>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-5">
            Already registered?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}