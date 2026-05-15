import { cn } from "../../lib/utils";

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  className?: string;
  children?: React.ReactNode;
}

export function EmptyState({ icon, title, description, className, children }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-4 text-center", className)}>
      {icon && (
        <span className="material-symbols-outlined text-m3-outline text-[64px] mb-4" style={{ fontVariationSettings: "'FILL' 0" }}>
          {icon}
        </span>
      )}
      <h3 className="text-title-sm text-m3-on-surface mb-1">{title}</h3>
      {description && <p className="text-body-compact text-m3-on-surface-variant max-w-sm">{description}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="h-4 bg-m3-surface-container-high rounded w-3/4" />
          <div className="h-3 bg-m3-surface-container-high rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}
