/* ================================================================== */
/* CREATE ORGANIZATION MODAL                                           */
/* ================================================================== */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { useCreateOrganization } from "../../hooks/useApi";
import { OrganizationType, RegionEthiopia } from "../../types";

const schema = z.object({
  name: z.string().min(2, "Name is required"),
  code: z.string().min(2, "Code is required"),
  type: z.nativeEnum(OrganizationType),
  region: z.nativeEnum(RegionEthiopia),
  address: z.object({
    street: z.string().min(1, "Street is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().default(""),
    zipCode: z.string().default(""),
    country: z.string().default("Ethiopia"),
  }),
  contact: z.object({
    phone: z.string().min(6, "Phone is required"),
    email: z.string().email("Valid email required"),
    fax: z.string().default(""),
  }),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateOrganizationModal({ open, onClose }: Props) {
  const create = useCreateOrganization();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: {
      type: OrganizationType.HOSPITAL,
      region: RegionEthiopia.ADDIS_ABABA,
      address: { country: "Ethiopia", state: "", zipCode: "" },
      contact: { fax: "" },
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create.mutateAsync(data);
      toast.success("Organization created successfully");
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create organization";
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
      title="Add Organization"
      description="Register a new hospital, blood bank, or regional center."
      width="max-w-2xl"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Organization Name</label>
            <input {...register("name")} className={inputClass} placeholder="e.g. Tikur Anbessa Hospital" />
            {errors.name && <p className={errorClass}>{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Code</label>
            <input {...register("code")} className={inputClass} placeholder="e.g. TAH-001" />
            {errors.code && <p className={errorClass}>{errors.code.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Type</label>
            <select {...register("type")} className={inputClass}>
              {Object.values(OrganizationType).map((t) => (
                <option key={t} value={t}>{t.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Region</label>
            <select {...register("region")} className={inputClass}>
              {Object.values(RegionEthiopia).map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
        </div>

        <hr className="border-m3-outline-variant" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Street Address</label>
            <input {...register("address.street")} className={inputClass} placeholder="Street" />
            {errors.address?.street && <p className={errorClass}>{errors.address.street.message}</p>}
          </div>
          <div>
            <label className={labelClass}>City</label>
            <input {...register("address.city")} className={inputClass} placeholder="City" />
            {errors.address?.city && <p className={errorClass}>{errors.address.city.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input {...register("contact.phone")} className={inputClass} placeholder="+251..." />
            {errors.contact?.phone && <p className={errorClass}>{errors.contact.phone.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register("contact.email")} className={inputClass} placeholder="org@example.com" />
            {errors.contact?.email && <p className={errorClass}>{errors.contact.email.message}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isSubmitting ? "Creating…" : "Create Organization"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
