import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { useCreateTransfer, useOrganizations } from "../../hooks/useApi";
import { BloodType, ComponentType } from "../../types";

const schema = z.object({
  fromOrganizationId: z.string().min(1, "Source required"),
  toOrganizationId: z.string().min(1, "Destination required"),
  bloodType: z.nativeEnum(BloodType),
  componentType: z.nativeEnum(ComponentType),
  quantity: z.coerce.number().min(1, "Min 1 unit"),
  urgency: z.enum(["routine", "urgent", "emergency"]),
  notes: z.string().default(""),
});
type FormValues = z.infer<typeof schema>;
interface Props { open: boolean; onClose: () => void; }

export function CreateTransferModal({ open, onClose }: Props) {
  const create = useCreateTransfer();
  const { data: orgs } = useOrganizations();
  const orgItems = Array.isArray(orgs?.items || orgs) ? (orgs?.items || orgs) : [];

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { bloodType: BloodType.O_POSITIVE, componentType: ComponentType.WHOLE_BLOOD, urgency: "routine", quantity: 5 },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create.mutateAsync(data);
      toast.success("Transfer request created");
      reset(); onClose();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create transfer");
    }
  };

  const ic = "w-full px-3 py-2 border border-m3-outline-variant rounded-lg bg-m3-surface-container-lowest text-body-compact text-m3-on-surface focus:outline-none focus:border-m3-primary focus:ring-1 focus:ring-m3-primary";
  const lc = "block text-label-caps text-m3-on-surface-variant mb-1.5";
  const ec = "text-xs text-m3-error mt-0.5";

  return (
    <FormModal open={open} onClose={onClose} title="New Transfer Request" description="Create a blood unit transfer between organizations.">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div><label className={lc}>From Organization</label><select {...register("fromOrganizationId")} className={ic}><option value="">Select source…</option>{(orgItems as { _id: string; name: string }[]).map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}</select>{errors.fromOrganizationId && <p className={ec}>{errors.fromOrganizationId.message}</p>}</div>
        <div><label className={lc}>To Organization</label><select {...register("toOrganizationId")} className={ic}><option value="">Select destination…</option>{(orgItems as { _id: string; name: string }[]).map((o) => <option key={o._id} value={o._id}>{o.name}</option>)}</select>{errors.toOrganizationId && <p className={ec}>{errors.toOrganizationId.message}</p>}</div>
        <div className="grid grid-cols-3 gap-4">
          <div><label className={lc}>Blood Type</label><select {...register("bloodType")} className={ic}>{Object.values(BloodType).map((b) => <option key={b} value={b}>{b}</option>)}</select></div>
          <div><label className={lc}>Component</label><select {...register("componentType")} className={ic}>{Object.values(ComponentType).map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}</select></div>
          <div><label className={lc}>Quantity</label><input {...register("quantity")} type="number" className={ic} />{errors.quantity && <p className={ec}>{errors.quantity.message}</p>}</div>
        </div>
        <div><label className={lc}>Urgency</label><select {...register("urgency")} className={ic}><option value="routine">Routine</option><option value="urgent">Urgent</option><option value="emergency">Emergency</option></select></div>
        <div><label className={lc}>Notes</label><textarea {...register("notes")} rows={2} className={ic} placeholder="Optional notes…" /></div>
        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant">Cancel</button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 disabled:opacity-50">{isSubmitting ? "Creating…" : "Submit Request"}</button>
        </div>
      </form>
    </FormModal>
  );
}
