/* ================================================================== */
/* CREATE USER / STAFF MODAL                                           */
/* ================================================================== */

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { FormModal } from "./FormModal";
import { useCreateUser, useOrganizations } from "../../hooks/useApi";
import { UserRole } from "../../types";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Min 8 characters"),
  phone: z.string().optional(),
  role: z.nativeEnum(UserRole),
  organizationId: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

const STAFF_ROLES = Object.values(UserRole).filter((r) => r !== UserRole.DONOR);

export function CreateUserModal({ open, onClose }: Props) {
  const create = useCreateUser();
  const { data: orgs } = useOrganizations();
  const orgItems = Array.isArray(orgs?.items || orgs) ? (orgs?.items || orgs) : [];

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: UserRole.LAB_STAFF },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      await create.mutateAsync(data);
      toast.success("Staff member created successfully");
      reset();
      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to create user";
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
      title="Add Staff Member"
      description="Create a new user account with role assignment."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name</label>
            <input {...register("firstName")} className={inputClass} placeholder="First name" />
            {errors.firstName && <p className={errorClass}>{errors.firstName.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Last Name</label>
            <input {...register("lastName")} className={inputClass} placeholder="Last name" />
            {errors.lastName && <p className={errorClass}>{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label className={labelClass}>Email</label>
          <input {...register("email")} type="email" className={inputClass} placeholder="user@example.com" />
          {errors.email && <p className={errorClass}>{errors.email.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Password</label>
          <input {...register("password")} type="password" className={inputClass} placeholder="Min 8 characters" />
          {errors.password && <p className={errorClass}>{errors.password.message}</p>}
        </div>

        <div>
          <label className={labelClass}>Phone</label>
          <input {...register("phone")} className={inputClass} placeholder="+251..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Role</label>
            <select {...register("role")} className={inputClass}>
              {STAFF_ROLES.map((r) => (
                <option key={r} value={r}>{r.replace(/_/g, " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Organization</label>
            <select {...register("organizationId")} className={inputClass}>
              <option value="">Select…</option>
              {(orgItems as { _id: string; name: string }[]).map((o) => (
                <option key={o._id} value={o._id}>{o.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-m3-outline-variant">
          <button type="button" onClick={onClose} className="px-5 py-2.5 border border-m3-outline-variant text-m3-on-surface rounded-lg text-sm hover:bg-m3-surface-variant transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 bg-m3-primary text-m3-on-primary rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
            {isSubmitting ? "Creating…" : "Create Staff Member"}
          </button>
        </div>
      </form>
    </FormModal>
  );
}
