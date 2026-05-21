/* ================================================================== */
/* MAP MARKER — Single marker visual element                           */
/* ================================================================== */

import { MaterialIcon } from "../MaterialIcon";
import type { MarkerSeverity, SeverityStyleSet } from "./map.types";

interface MapMarkerProps {
  severity?: MarkerSeverity;
  styles: SeverityStyleSet;
}

export function MapMarker({ severity, styles }: MapMarkerProps) {
  return (
    <div
      className={`
        relative flex items-center justify-center
        w-12 h-12 rounded-full
        border-4 border-white shadow-2xl ring-4
        transition-all duration-300 hover:scale-110 cursor-pointer
        ${styles.bg} ${styles.ring}
      `}
    >
      <MaterialIcon
        icon="water_drop"
        size={22}
        filled
        className={styles.text}
      />
      {severity === "critical" && (
        <span className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-40" />
      )}
    </div>
  );
}
