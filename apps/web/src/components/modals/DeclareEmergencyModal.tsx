/* ================================================================== */
/* DECLARE EMERGENCY MODAL                                             */
/* ================================================================== */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { useDeclareEmergency } from "../../hooks/useApi";
import { BloodType, EmergencySeverity, RegionEthiopia } from "../../types";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  severity: z.nativeEnum(EmergencySeverity),
  affectedRegions: z.array(z.string()).min(1, "Select at least one region"),
  bloodTypesNeeded: z.array(z.string()).min(1, "Select at least one blood type"),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DeclareEmergencyModal({ open, onClose }: Props) {
  const declare = useDeclareEmergency();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      severity: EmergencySeverity.HIGH,
      affectedRegions: [],
      bloodTypesNeeded: [],
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await declare.mutateAsync(data);
      toast.success("Emergency declared successfully — response teams notified");
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to declare emergency";
      toast.error(message);
    }
  };

  const inputClass =
    "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const labelClass = "block text-label-caps text-m3-on-surface-variant mb-1.5";
  const errorClass = "text-xs text-m3-error mt-0.5";

  return (
    <FormModal
      open={open}
      onClose={onClose}
      title="🚨 Declare National Emergency"
      description="This will trigger alerts to all regional response centers."
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="p-3 bg-m3-error-container rounded-lg border border-m3-error">
          <p className="text-body-compact text-m3-on-error-container font-semibold">
            This action will initiate an emergency protocol across the national blood network.
          </p>
        </div>

        <div>
          <label className={labelClass}>Emergency Title</label>
          <input {...register("title")} className={inputClass} placeholder="e.g. Critical O- Shortage — Addis Ababa" />
          {errors.title && <p className={errorClass}>{errors.title.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Description</label>
          <textarea {...register("description")} rows={3} className={inputClass} placeholder="Describe the emergency situation…" />
          {errors.description && <p className={errorClass}>{errors.description.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Severity</label>
          <select {...register("severity")} className={inputClass}>
            {Object.values(EmergencySeverity).map((s) => (
              <option key={s} value={s}>{s.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div>
          <label className={labelClass}>Affected Regions</label>
          <div className="grid grid-cols-3 gap-2 mt-1">
            {Object.values(RegionEthiopia).map((r) => (
              <label key={r} className="flex items-center gap-2 text-body-compact text-m3-on-surface cursor-pointer">
                <input type="checkbox" value={r} {...register("affectedRegions")} className="accent-m3-primary" />
                {r}
              </label>
            ))}
          </div>
          {errors.affectedRegions && <p className={errorClass}>{errors.affectedRegions.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Blood Types Needed</label>
          <div className="flex flex-wrap gap-2 mt-1">
            {Object.values(BloodType).map((bt) => (
              <label key={bt} className="flex items-center gap-1.5 px-3 py-1.5 border border-m3-outline-variant rounded-full text-body-compact cursor-pointer hover:bg-m3-surface-variant transition-colors">
                <input type="checkbox" value={bt} {...register("bloodTypesNeeded")} className="accent-m3-primary" />
                {bt}
              </label>
            ))}
          </div>
          {errors.bloodTypesNeeded && <p className={errorClass}>{errors.bloodTypesNeeded.message}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-m3-error text-m3-on-error rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50 font-bold">
            {isSubmitting ? "Declaring…" : "🚨 Declare Emergency"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
