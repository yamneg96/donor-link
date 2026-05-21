import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { BloodType, ComponentType } from "../../types";
import { api } from "../../api/client";
import { useQueryClient } from "@tanstack/react-query";

const schema = z.object({
  bloodType: z.nativeEnum(BloodType),
  componentType: z.nativeEnum(ComponentType),
  volume: z.coerce.number().min(100, "Min 100ml"),
  collectionDate: z.string().min(1, "Collection date required"),
  expiryDate: z.string().min(1, "Expiry date required"),
  donorId: z.string().default(""),
  barcode: z.string().default(""),
  notes: z.string().default(""),
});
type FormValues = z.infer<typeof schema>;
interface Props { open: boolean; onClose: () => void; }

export function ManualEntryModal({ open, onClose }: Props) {
  const qc = useQueryClient();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { bloodType: BloodType.O_POSITIVE, componentType: ComponentType.WHOLE_BLOOD, volume: 450 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await api.post("/inventory", data);
      qc.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Blood unit registered successfully");
      reset(); onClose();
    } catch {
      toast.error("Failed to register unit");
    }
  };

  const ic = "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const lc = "block text-label-caps text-m3-on-surface-variant mb-1.5";
  const ec = "text-xs text-m3-error mt-0.5";

  return (
    <FormModal open={open} onClose={onClose} title="Manual Blood Unit Entry" description="Register a new blood unit into the inventory system." width="max-w-2xl">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>Blood Type</label><select {...register("bloodType")} className={ic}>{Object.values(BloodType).map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          <div><label className={lc}>Component</label><select {...register("componentType")} className={ic}>{Object.values(ComponentType).map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}</select></div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className={lc}>Volume (ml)</label><input {...register("volume")} type="number" className={ic} />{errors.volume && <p className={ec}>{errors.volume.message}</p>}</div>
          <div><label className={lc}>Collection Date</label><input {...register("collectionDate")} type="date" className={ic} />{errors.collectionDate && <p className={ec}>{errors.collectionDate.message}</p>}</div>
          <div><label className={lc}>Expiry Date</label><input {...register("expiryDate")} type="date" className={ic} />{errors.expiryDate && <p className={ec}>{errors.expiryDate.message}</p>}</div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div><label className={lc}>Donor ID (optional)</label><input {...register("donorId")} className={ic} placeholder="DID-XXXX" /></div>
          <div><label className={lc}>Barcode (optional)</label><input {...register("barcode")} className={ic} placeholder="Scan or enter" /></div>
        </div>
        <div><label className={lc}>Notes</label><textarea {...register("notes")} rows={2} className={ic} placeholder="Optional notes…" /></div>
        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 disabled:opacity-50">{isSubmitting ? "Registering…" : "Register Unit"}</button>
        </div>
      </form>
    </FormModal>
  );
}
