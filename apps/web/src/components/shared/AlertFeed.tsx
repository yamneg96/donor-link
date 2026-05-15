import { MaterialIcon } from "./MaterialIcon";
import { cn } from "../../lib/utils";

interface AlertItem {
  _id: string;
  title: string;
  severity: "critical" | "warning" | "info";
  type?: string;
  createdAt: string;
}

interface AlertFeedProps {
  alerts: AlertItem[];
  className?: string;
}

export function AlertFeed({ alerts, className }: AlertFeedProps) {
  return (
    <div className={cn("bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg p-4 flex flex-col", className)}>
      <div className="flex items-center justify-between mb-3 border-b border-m3-outline-variant pb-2">
        <h3 className="text-title-sm text-m3-on-surface">Real-Time Alerts</h3>
        <MaterialIcon icon="filter_list" className="text-m3-on-surface-variant" size={20} />
      </div>
      <ul className="space-y-3 flex-1 overflow-y-auto">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <li key={alert._id} className="flex items-start gap-3 group">
              <div className={cn(
                "w-2 h-2 rounded-full mt-1.5 shrink-0 transition-transform group-hover:scale-125",
                alert.severity === "critical" ? "bg-m3-error shadow-[0_0_8px_rgba(186,26,26,0.4)]" : 
                alert.severity === "warning" ? "bg-amber-500" : "bg-m3-secondary"
              )} />
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "text-body-compact text-m3-on-surface truncate",
                  alert.severity === "critical" && "font-bold"
                )}>
                  {alert.title}
                </p>
                <p className="text-data-mono text-m3-on-surface-variant text-[10px]">
                  {alert.type || "System"} • {new Date(alert.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </li>
          ))
        ) : (
          <li className="flex flex-col items-center justify-center py-8 text-m3-on-surface-variant/50">
            <MaterialIcon icon="notifications_off" size={32} className="mb-2" />
            <p className="text-body-compact">No active alerts</p>
          </li>
        )}
      </ul>
    </div>
  );
}
