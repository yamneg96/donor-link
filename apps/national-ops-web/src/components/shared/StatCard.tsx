import { cn } from "../../lib/utils";
import { MaterialIcon } from "./MaterialIcon";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  iconColor?: string;
  trend?: { value: string; direction: "up" | "down" | "neutral" };
  badge?: { text: string; variant: "error" | "success" | "warning" | "info" };
  progress?: { value: number; color?: string };
  borderColor?: string;
  className?: string;
  onClick?: () => void;
}

export function StatCard({
  title, value, subtitle, icon, iconColor = "text-m3-secondary",
  trend, badge, progress, borderColor, className, onClick,
}: StatCardProps) {
  return (
    <div 
      onClick={onClick}
      className={cn(
      "bg-m3-surface-container-lowest border rounded-lg p-4 flex flex-col justify-between h-32 relative overflow-hidden group hover:border-m3-secondary transition-colors",
      onClick && "cursor-pointer",
      borderColor || "border-m3-outline-variant",
      className,
    )}>
      <div className="flex justify-between items-start">
        <span className="text-title-sm text-m3-on-surface">{title}</span>
        {icon && <MaterialIcon icon={icon} className={iconColor} />}
      </div>
      <div>
        <div className="text-display-lg text-m3-on-surface">
          {value}
          {subtitle && <span className="text-body-compact text-m3-on-surface-variant ml-1">{subtitle}</span>}
        </div>
        {trend && (
          <div className="flex items-center mt-1 gap-1">
            <MaterialIcon
              icon={trend.direction === "up" ? "trending_up" : trend.direction === "down" ? "trending_down" : "trending_flat"}
              size={16}
              className="text-m3-tertiary"
            />
            <span className="text-data-mono text-m3-tertiary">{trend.value}</span>
          </div>
        )}
        {badge && (
          <div className="flex items-center mt-1">
            <span className={cn(
              "inline-flex items-center px-2 py-0.5 rounded-full text-label-caps",
              badge.variant === "error" && "bg-m3-error-container text-m3-on-error-container",
              badge.variant === "success" && "bg-green-100 text-green-800",
              badge.variant === "warning" && "bg-amber-100 text-amber-800",
              badge.variant === "info" && "bg-m3-secondary-container text-m3-on-secondary-container",
            )}>
              {badge.text}
            </span>
          </div>
        )}
        {progress && (
          <div className="w-full bg-m3-surface-variant h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className={cn("h-full rounded-full", progress.color || "bg-m3-secondary")}
              style={{ width: `${Math.min(progress.value, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
