import { cn } from "../../lib/utils";

interface BloodTypeCardProps {
  bloodType: string;
  available: number;
  target?: number;
  isCritical?: boolean;
  className?: string;
}

const BLOOD_TYPE_COLORS: Record<string, { border: string; text: string; bg: string }> = {
  "O-": { border: "border-m3-error", text: "text-m3-error", bg: "bg-m3-error-container text-m3-on-error-container" },
  "O+": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-surface-variant text-m3-on-surface" },
  "A+": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-surface-variant text-m3-on-surface" },
  "A-": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-surface-variant text-m3-on-surface" },
  "B+": { border: "border-m3-tertiary-container", text: "text-m3-tertiary", bg: "bg-m3-tertiary-container text-m3-on-tertiary-container" },
  "B-": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-surface-variant text-m3-on-surface" },
  "AB+": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-secondary-container text-m3-on-secondary-container" },
  "AB-": { border: "border-m3-outline-variant", text: "text-m3-on-surface", bg: "bg-m3-secondary-container text-m3-on-secondary-container" },
};

export function BloodTypeCard({ bloodType, available, target, isCritical: manualCritical, className }: BloodTypeCardProps) {
  const colors = BLOOD_TYPE_COLORS[bloodType] || BLOOD_TYPE_COLORS["O+"];
  const pct = target ? Math.round((available / target) * 100) : 0;
  const isCritical = manualCritical ?? (pct < 20);

  return (
    <div className={cn(
      "bg-m3-surface-container-lowest border rounded-lg p-4 relative overflow-hidden shadow-ambient-md",
      isCritical ? "border-m3-error" : colors.border,
      className
    )}>
      {isCritical && (
        <div className="absolute top-0 right-0 bg-m3-error text-m3-on-error text-label-caps px-2 py-1 rounded-bl-lg">
          CRITICAL
        </div>
      )}
      <div className="flex justify-between items-baseline mb-2">
        <span className={cn("text-display-lg", isCritical ? "text-m3-error" : colors.text)}>{bloodType}</span>
        <span className="text-headline-md font-bold">{available}</span>
      </div>
      <p className="text-body-compact text-m3-on-surface-variant mb-3">Units Available</p>
      
      {target !== undefined && (
        <>
          <div className="w-full bg-m3-surface-variant rounded-full h-2 mb-1">
            <div
              className={cn(
                "h-2 rounded-full transition-all duration-500",
                isCritical ? "bg-m3-error" : pct > 80 ? "bg-green-600" : pct > 40 ? "bg-yellow-500" : "bg-m3-error"
              )}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-data-mono text-m3-on-surface-variant">
            <span>Target: {target}</span>
            <span>{pct}%</span>
          </div>
        </>
      )}
    </div>
  );
}
