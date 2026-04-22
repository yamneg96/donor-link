import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { createBloodRequestSchema, CreateBloodRequestInput } from "@donorlink/validators";
import { useCreateRequest } from "../../hooks/useApi";
import { Button, Input, Select, AlertBanner, Card } from "../../components/ui";
import { getApiError } from "../../lib/utils";
import { BloodType, RequestUrgency } from "@donorlink/types";
import { useState } from "react";

const BT_OPTIONS = Object.values(BloodType).map((v) => ({ value: v, label: v }));
const URGENCY_OPTIONS = [
  { value: RequestUrgency.CRITICAL, label: "Critical — needed within 2 hours" },
  { value: RequestUrgency.URGENT,   label: "Urgent — needed within 24 hours" },
  { value: RequestUrgency.STANDARD, label: "Standard — planned transfusion" },
];

export function NewRequestPage() {
  const navigate = useNavigate();
  const create = useCreateRequest();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateBloodRequestInput>({
    resolver: zodResolver(createBloodRequestSchema),
    defaultValues: { unitsNeeded: 1, radiusKm: 50, expiresInHours: 24 },
  });

  const urgency = watch("urgency");

  const onSubmit = async (data: CreateBloodRequestInput) => {
    setError("");
    try {
      await create.mutateAsync(data);
      navigate({ to: "/hospital/requests" });
    } catch (err) {
      setError(getApiError(err));
    }
  };

  return (
    <div className="page-container max-w-2xl">
      <button
        onClick={() => navigate({ to: "/hospital" })}
        className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back to dashboard
      </button>

      <h1 className="text-2xl font-bold text-stone-900 mb-2">New blood request</h1>
      <p className="text-stone-500 text-sm mb-6">
        Eligible donors within your search radius will be alerted immediately via SMS, push notification, and email.
      </p>

      {error && (
        <div className="mb-5">
          <AlertBanner message={error} onDismiss={() => setError("")} />
        </div>
      )}

      {urgency === RequestUrgency.CRITICAL && (
        <div className="mb-5 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-red-800">Critical request</p>
            <p className="text-sm text-red-700 mt-0.5">
              Donors will receive an emergency SMS and push alert immediately. Make sure your emergency phone is reachable.
            </p>
          </div>
        </div>
      )}

      <Card className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Select
            {...register("bloodType")}
            label="Blood type needed"
            options={BT_OPTIONS}
            placeholder="Select blood type"
            error={errors.bloodType?.message}
          />

          <Select
            {...register("urgency")}
            label="Urgency level"
            options={URGENCY_OPTIONS}
            placeholder="Select urgency"
            error={errors.urgency?.message}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              {...register("unitsNeeded", { valueAsNumber: true })}
              label="Units needed"
              type="number"
              min={1}
              max={20}
              placeholder="1"
              error={errors.unitsNeeded?.message}
            />
            <Input
              {...register("radiusKm", { valueAsNumber: true })}
              label="Search radius (km)"
              type="number"
              min={1}
              max={200}
              placeholder="50"
              hint="Donors within this distance will be alerted"
              error={errors.radiusKm?.message}
            />
          </div>

          <Input
            {...register("expiresInHours", { valueAsNumber: true })}
            label="Request expires in (hours)"
            type="number"
            min={1}
            max={72}
            placeholder="24"
            error={errors.expiresInHours?.message}
          />

          <Input
            {...register("patientName")}
            label="Patient name (optional)"
            placeholder="For internal tracking only"
            error={errors.patientName?.message}
          />

          <div>
            <label className="label">Notes (optional)</label>
            <textarea
              {...register("notes")}
              rows={3}
              placeholder="Any additional details for donors..."
              className="input resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate({ to: "/hospital" })}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" loading={create.isPending} className="flex-1">
              Create request & alert donors
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}