import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { Heart, FileText, ArrowRight, Activity, MapPin } from "lucide-react";
import { onboardDonorSchema, type OnboardDonorInput } from "@donorlink/validators";
import { useOnboardDonor } from "../../hooks/useApi";
import { authStore } from "../../store/authStore";
import { Button, Input, Select, AlertBanner } from "../../components/ui";
import { getApiError } from "../../lib/utils";
import { useState } from "react";
import { BloodType, RegionEthiopia } from "@donorlink/types";

export function OnboardingPage() {
  const navigate = useNavigate();
  const onboard = useOnboardDonor();
  const [error, setError] = useState("");
  
  const user = authStore.getState().user;

  const { register, handleSubmit, formState: { errors } } = useForm<OnboardDonorInput>({
    resolver: zodResolver(onboardDonorSchema),
    defaultValues: {
      phone: user?.phone || "",
      address: {
        region: (user as any)?.faydaProfile?.address?.region || RegionEthiopia.ADDIS_ABABA,
        city: (user as any)?.faydaProfile?.address?.city || "",
        subcity: "",
        woreda: "",
      },
      availableForEmergency: true,
    }
  });

  const onSubmit = async (data: OnboardDonorInput) => {
    setError("");
    try {
      await onboard.mutateAsync(data);
      navigate({ to: "/dashboard" });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-6 relative bg-background">
      {/* Decorative Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-tertiary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <main className="w-full max-w-2xl bg-white rounded-3xl ambient-shadow-lg p-8 sm:p-12 relative z-10 border border-outline-variant/20">
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-full primary-gradient flex items-center justify-center shadow-md">
            <FileText className="size-6 text-white" />
          </div>
          <div>
            <h1 className="font-headline text-2xl font-bold text-midnight tracking-tight">Complete Your Profile</h1>
            <p className="text-sm font-body text-on-surface-variant">
              Just a few medical details needed to start saving lives.
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-6">
            <AlertBanner message={error} onDismiss={() => setError("")} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          
          {/* Medical Information */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold font-headline uppercase tracking-wider text-secondary mb-4 border-b border-surface-container pb-2">
              <Activity className="size-4" />
              Medical Vitals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Select
                {...register("bloodType")}
                label="Blood Type"
                placeholder="Select Blood Type"
                options={Object.values(BloodType).map((v) => ({ label: v, value: v }))}
                error={errors.bloodType?.message}
              />
              <Input
                {...register("dateOfBirth")}
                label="Date of Birth"
                type="date"
                error={errors.dateOfBirth?.message}
                max={new Date().toISOString().split("T")[0]}
              />
              <Input
                {...register("weight", { valueAsNumber: true })}
                label="Weight (kg)"
                type="number"
                min={40}
                max={200}
                placeholder="e.g. 65"
                error={errors.weight?.message}
              />
            </div>
          </section>

          {/* Contact & Location */}
          <section>
            <h2 className="flex items-center gap-2 text-sm font-bold font-headline uppercase tracking-wider text-secondary mb-4 border-b border-surface-container pb-2">
              <MapPin className="size-4" />
              Contact & Location
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
              <Input
                {...register("phone")}
                label="Phone Number"
                placeholder="+251912345678"
                error={errors.phone?.message}
              />
              <Select
                {...register("address.region")}
                label="Region"
                options={Object.values(RegionEthiopia).map((r) => ({ label: r, value: r }))}
                error={errors.address?.region?.message}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                {...register("address.city")}
                label="City"
                placeholder="e.g. Addis Ababa"
                error={errors.address?.city?.message}
              />
              <Input
                {...register("address.subcity")}
                label="Subcity (Optional)"
                placeholder="e.g. Bole"
                error={errors.address?.subcity?.message}
              />
              <Input
                {...register("address.woreda")}
                label="Woreda (Optional)"
                placeholder="e.g. 03"
                error={errors.address?.woreda?.message}
              />
            </div>
          </section>

          {/* Preferences */}
          <section className="bg-surface-container-low p-5 rounded-2xl border border-surface-container">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  {...register("availableForEmergency")}
                  className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-colors cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="font-headline font-bold text-midnight text-sm">Emergency Ready</p>
                <p className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                  I am willing to be contacted outside normal hours for critical, life-threatening blood shortages in my immediate area.
                </p>
              </div>
            </label>
          </section>

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              size="lg"
              loading={onboard.isPending}
              className="primary-gradient text-white btn-glow px-8"
            >
              <Heart className="size-5 mr-2" />
              Complete Profile
              <ArrowRight className="size-5 ml-2" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
