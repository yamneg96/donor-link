import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { onboardDonorSchema, type OnboardDonorInput } from "../../types";
import { useOnboardDonor } from "../../hooks/useApi";
import { authStore } from "../../store/authStore";
import { Button, Input, Select, AlertBanner } from "../../components/ui";
import { getApiError } from "../../lib/utils";
import { useState } from "react";
import { BloodType, RegionEthiopia } from "../../types";
import { MaterialIcon } from "../../components/shared/MaterialIcon";

export default function OnboardingPage() {
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
    <div className="min-h-screen flex items-center justify-center py-12 px-6 relative bg-m3-surface">
      {/* Decorative Gradient */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-m3-primary/5 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />

      <main className="w-full max-w-2xl bg-m3-surface-container-lowest rounded-3xl shadow-ambient-lg p-8 sm:p-12 relative z-10 border border-m3-outline-variant/30">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 rounded-full bg-m3-primary-container flex items-center justify-center shadow-sm">
            <MaterialIcon icon="person_add" filled className="text-m3-on-primary-container" size={28} />
          </div>
          <div>
            <h1 className="text-display-sm text-m3-on-surface tracking-tight">Complete Your Profile</h1>
            <p className="text-body-main text-m3-on-surface-variant mt-1">
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
            <h2 className="flex items-center gap-2 text-label-caps text-m3-secondary mb-4 border-b border-m3-outline-variant pb-2">
              <MaterialIcon icon="health_and_safety" size={18} />
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
            <h2 className="flex items-center gap-2 text-label-caps text-m3-secondary mb-4 border-b border-m3-outline-variant pb-2">
              <MaterialIcon icon="location_on" size={18} />
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
          <section className="bg-m3-surface-container-low p-6 rounded-2xl border border-m3-outline-variant">
            <label className="flex items-start gap-4 cursor-pointer group">
              <div className="flex items-center h-6">
                <input
                  type="checkbox"
                  {...register("availableForEmergency")}
                  className="w-5 h-5 rounded border-m3-outline text-m3-primary focus:ring-m3-primary transition-colors cursor-pointer"
                />
              </div>
              <div className="flex-1">
                <p className="text-title-sm text-m3-on-surface">Emergency Ready</p>
                <p className="text-body-compact text-m3-on-surface-variant mt-1 leading-relaxed">
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
              className="bg-m3-primary text-m3-on-primary hover:opacity-90 shadow-md px-10 rounded-full h-14"
            >
              <MaterialIcon icon="favorite" className="mr-2" filled />
              Complete Profile
              <MaterialIcon icon="arrow_forward" className="ml-2" />
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
