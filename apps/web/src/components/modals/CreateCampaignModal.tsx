import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { useCreateCampaign } from "../../hooks/useApi";
import { CampaignType, BloodType, RegionEthiopia } from "../../types";

const schema = z.object({
  title: z.string().min(3, "Title is required"),
  description: z.string().min(5, "Description is required"),
  type: z.nativeEnum(CampaignType),
  targetBloodTypes: z.array(z.string()).default([]),
  targetRegions: z.array(z.string()).default([]),
  startDate: z.string().min(1, "Start date required"),
  endDate: z.string().min(1, "End date required"),
  goalUnits: z.coerce.number().min(1, "Goal must be at least 1"),
});
type FormValues = z.infer<typeof schema>;
interface Props { open: boolean; onClose: () => void; }

export function CreateCampaignModal({ open, onClose }: Props) {
  const create = useCreateCampaign();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { type: CampaignType.GENERAL, targetBloodTypes: [], targetRegions: [], goalUnits: 100 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create.mutateAsync(data);
      toast.success("Campaign created successfully");
      reset(); onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create campaign");
    }
  };

  const ic = "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const lc = "block text-label-caps text-m3-on-surface-variant mb-1.5";
  const ec = "text-xs text-m3-error mt-0.5";

  return (
    <FormModal open={open} onClose={onClose} title="New Campaign" description="Launch a targeted blood donation campaign." width="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className={lc}>Title</label><input {...register("title")} className={ic} placeholder="e.g. World Blood Donor Day 2026" />{errors.title && <p className={ec}>{errors.title.message}</p>}</div>
        <div><label className={lc}>Description</label><textarea {...register("description")} rows={2} className={ic} placeholder="Campaign objective…" />{errors.description && <p className={ec}>{errors.description.message}</p>}</div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>Type</label><select {...register("type")} className={ic}>{Object.values(CampaignType).map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}</select></div>
          <div><label className={lc}>Goal (Units)</label><input {...register("goalUnits")} type="number" className={ic} />{errors.goalUnits && <p className={ec}>{errors.goalUnits.message}</p>}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>Start Date</label><input {...register("startDate")} type="date" className={ic} />{errors.startDate && <p className={ec}>{errors.startDate.message}</p>}</div>
          <div><label className={lc}>End Date</label><input {...register("endDate")} type="date" className={ic} />{errors.endDate && <p className={ec}>{errors.endDate.message}</p>}</div>
        </div>
        <div><label className={lc}>Target Blood Types</label><div className="flex flex-wrap gap-2 mt-1">{Object.values(BloodType).map((bt) => <label key={bt} className="flex items-center gap-1.5 px-3 py-1.5 border border-m3-outline-variant rounded-full text-body-compact cursor-pointer hover:bg-m3-surface-variant"><input type="checkbox" value={bt} {...register("targetBloodTypes")} className="accent-m3-primary" />{bt}</label>)}</div></div>
        <div><label className={lc}>Target Regions</label><div className="grid grid-cols-3 gap-2 mt-1">{Object.values(RegionEthiopia).map((r) => <label key={r} className="flex items-center gap-2 text-body-compact cursor-pointer"><input type="checkbox" value={r} {...register("targetRegions")} className="accent-m3-primary" />{r}</label>)}</div></div>
        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 disabled:opacity-50">{isSubmitting ? "Creating…" : "Launch Campaign"}</button>
        </div>
      </form>
    </FormModal>
  );
}
