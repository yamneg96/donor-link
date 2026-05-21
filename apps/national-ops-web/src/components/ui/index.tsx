import React from "react";
import { cn } from "../../lib/utils";
import { Loader2, X, Shield, Lock } from "lucide-react";

// ─── Button ───────────────────────────────────────────────────────────────────
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "teal" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}
export function Button({ variant = "primary", size = "md", loading, disabled, children, className, ...props }: ButtonProps) {
  const v = {
    primary:   "btn-primary",
    secondary: "btn-secondary",
    teal:      "btn-teal",
    ghost:     "btn-ghost",
    danger:    "btn-danger",
  }[variant];
  const s = { sm: "btn-sm", md: "", lg: "btn-lg" }[size];
  return (
    <button className={cn(v, s, className)} disabled={disabled || loading} {...props}>
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  );
}

// ─── Input ────────────────────────────────────────────────────────────────────
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string; error?: string; hint?: string; leftIcon?: React.ReactNode;
  success?: boolean;
}
export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, success, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && <label htmlFor={inputId} className="label">{label}</label>}
        <div className="relative">
          {leftIcon && (
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-midnight/30">
              {leftIcon}
            </div>
          )}
          <input ref={ref} id={inputId}
            className={cn("input", leftIcon && "pl-11", error && "input-error", success && "input-success", className)}
            {...props}
          />
        </div>
        {error   && <p className="mt-1.5 font-data text-xs text-pulse">{error}</p>}
        {hint && !error && <p className="mt-1.5 font-data text-xs text-midnight/40">{hint}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";

// ─── Select ───────────────────────────────────────────────────────────────────
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string; error?: string; options: { value: string; label: string }[]; placeholder?: string;
}
export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, placeholder, className, id, ...props }, ref) => {
    const sid = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && <label htmlFor={sid} className="label">{label}</label>}
        <select ref={ref} id={sid} className={cn("input cursor-pointer", error && "input-error", className)} {...props}>
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
        {error && <p className="mt-1.5 font-data text-xs text-pulse">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";

// ─── Textarea ─────────────────────────────────────────────────────────────────
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string; error?: string;
}
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const tid = id ?? label?.toLowerCase().replace(/\s+/g, "-");
    return (
      <div className="w-full">
        {label && <label htmlFor={tid} className="label">{label}</label>}
        <textarea ref={ref} id={tid} className={cn("input resize-none", error && "input-error", className)} {...props} />
        {error && <p className="mt-1.5 font-data text-xs text-pulse">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

// ─── Badge ────────────────────────────────────────────────────────────────────
export function Badge({ children, variant = "pending", className }: {
  children: React.ReactNode; variant?: "critical"|"urgent"|"standard"|"fulfilled"|"pending"|"teal"|"hipaa"; className?: string;
}) {
  return <span className={cn(`badge-${variant}`, className)}>{children}</span>;
}

// ─── BloodTypeBadge ───────────────────────────────────────────────────────────
export function BloodTypeBadge({ type, size = "md" }: { type: string; size?: "sm"|"md"|"lg" }) {
  const s = { sm: "w-9 h-7 text-xs", md: "w-12 h-9 text-sm", lg: "w-16 h-12 text-base" }[size];
  return (
    <span className={cn("inline-flex items-center justify-center rounded-xl bg-red-50 text-pulse font-bold font-data border border-red-100", s)}>
      {type}
    </span>
  );
}

// ─── HipaaTag ─────────────────────────────────────────────────────────────────
export function HipaaTag() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-data bg-teal-light text-teal border border-teal/15">
      <Shield className="w-3 h-3" /> HIPAA Compliant
    </span>
  );
}
export function EncryptedTag() {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold font-data bg-teal-light text-teal border border-teal/15">
      <Lock className="w-3 h-3" /> Encrypted
    </span>
  );
}

// ─── Card ─────────────────────────────────────────────────────────────────────
export function Card({ children, className, urgent, interactive, onClick }: {
  children: React.ReactNode; className?: string; urgent?: boolean; interactive?: boolean; onClick?: () => void;
}) {
  return (
    <div className={cn(urgent ? "card-urgent" : interactive ? "card-interactive" : "card", "p-5", className)} onClick={onClick}>
      {children}
    </div>
  );
}

// ─── StatCard ─────────────────────────────────────────────────────────────────
export function StatCard({ label, value, icon, sub, className }: {
  label: string; value: string | number; icon?: React.ReactNode; sub?: string; className?: string;
}) {
  return (
    <div className={cn("stat-card", className)}>
      <div className="flex items-start justify-between">
        <p className="meta-label">{label}</p>
        {icon && <span className="p-2 bg-pulse/8 text-pulse rounded-xl">{icon}</span>}
      </div>
      <p className="text-3xl font-bold font-sans text-midnight mt-1">{value}</p>
      {sub && <p className="font-data text-xs text-midnight/40 mt-0.5">{sub}</p>}
    </div>
  );
}

// ─── Spinner / Loading ────────────────────────────────────────────────────────
export function Spinner({ className }: { className?: string }) {
  return <Loader2 className={cn("animate-spin text-pulse", className ?? "w-5 h-5")} />;
}
export function FullPageSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-sanctuary">
      <div className="flex flex-col items-center gap-3">
        <Spinner className="w-8 h-8" />
        <p className="font-data text-sm text-midnight/40">Loading…</p>
      </div>
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="card p-5 space-y-3">
      <div className="skeleton h-4 w-1/3" />
      <div className="skeleton h-8 w-2/3" />
      <div className="skeleton h-3 w-1/2" />
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }: {
  icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      {icon && <div className="mb-4 text-midnight/15 [&>svg]:w-14 [&>svg]:h-14">{icon}</div>}
      <h3 className="font-sans font-semibold text-midnight">{title}</h3>
      {description && <p className="mt-1 font-data text-sm text-midnight/40 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
export function Modal({ open, onClose, title, children, footer, size = "md" }: {
  open: boolean; onClose: () => void; title: string; children: React.ReactNode;
  footer?: React.ReactNode; size?: "sm"|"md"|"lg";
}) {
  if (!open) return null;
  const sizes = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-midnight/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn("relative w-full bg-white rounded-3xl shadow-card-md animate-slide-up", sizes[size])}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-midnight/6">
          <h2 className="font-sans font-bold text-midnight">{title}</h2>
          <button onClick={onClose} className="p-1.5 rounded-xl text-midnight/40 hover:text-midnight hover:bg-midnight/5 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-midnight/6 flex justify-end gap-3">{footer}</div>}
      </div>
    </div>
  );
}

// ─── AlertBanner ─────────────────────────────────────────────────────────────
export function AlertBanner({ type = "error", message, onDismiss }: {
  type?: "error"|"success"|"warning"|"info"; message: string; onDismiss?: () => void;
}) {
  const styles = {
    error:   "bg-red-50 text-red-800 border-red-200",
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    warning: "bg-amber-50 text-amber-800 border-amber-200",
    info:    "bg-teal-light text-teal border-teal/20",
  };
  return (
    <div className={cn("flex items-center gap-3 px-4 py-3 rounded-2xl border font-data text-sm", styles[type])}>
      <span className="flex-1">{message}</span>
      {onDismiss && <button onClick={onDismiss} className="flex-shrink-0 hover:opacity-70"><X className="w-4 h-4" /></button>}
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────
export function Pagination({ page, totalPages, onChange }: {
  page: number; totalPages: number; onChange: (p: number) => void;
}) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-6">
      <Button variant="secondary" size="sm" onClick={() => onChange(page - 1)} disabled={page <= 1}>Previous</Button>
      <span className="font-data text-sm text-midnight/40">Page {page} of {totalPages}</span>
      <Button variant="secondary" size="sm" onClick={() => onChange(page + 1)} disabled={page >= totalPages}>Next</Button>
    </div>
  );
}

// ─── Divider ──────────────────────────────────────────────────────────────────
export function Divider({ label }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 my-2">
      <div className="flex-1 h-px bg-midnight/8" />
      {label && <span className="font-data text-xs text-midnight/30 font-semibold uppercase tracking-widest">{label}</span>}
      <div className="flex-1 h-px bg-midnight/8" />
    </div>
  );
}