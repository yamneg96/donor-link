import { cn } from "../../lib/utils";

interface MaterialIconProps {
  icon: string;
  filled?: boolean;
  className?: string;
  size?: number;
}

export function MaterialIcon({ icon, filled = false, className, size }: MaterialIconProps) {
  return (
    <span
      className={cn("material-symbols-outlined select-none", className)}
      style={{
        fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0",
        fontSize: size ? `${size}px` : undefined,
      }}
    >
      {icon}
    </span>
  );
}
