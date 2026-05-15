import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { EmptyState, LoadingSkeleton } from "../../components/shared/EmptyState";
import { useNotifications, useMarkNotificationRead } from "../../hooks/useApi";

export default function NotificationsPage() {
  const { data: notifications, isLoading } = useNotifications();
  const markRead = useMarkNotificationRead();
  const items = Array.isArray(notifications?.items || notifications) ? (notifications?.items || notifications) : [];
  if (isLoading) return <div className="p-6"><LoadingSkeleton rows={6} /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-display-lg text-m3-on-surface">Notifications</h2>
        <p className="text-body-main text-m3-on-surface-variant mt-2">In-app notification center.</p>
      </div>
      {items.length > 0 ? (
        <div className="space-y-2">
          {items.map((n: any) => (
            <div key={n._id} className={`bg-m3-surface-container-lowest border border-m3-outline-variant rounded-lg p-4 flex items-start gap-4 ${n.status !== "read" ? "border-l-4 border-l-m3-primary" : ""}`}>
              <MaterialIcon icon="notifications" className={n.status !== "read" ? "text-m3-primary" : "text-m3-on-surface-variant"} />
              <div className="flex-1">
                <h3 className="text-title-sm text-m3-on-surface text-sm">{n.title}</h3>
                <p className="text-body-compact text-m3-on-surface-variant">{n.body}</p>
                <span className="text-data-mono text-m3-outline">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              {n.status !== "read" && (
                <button onClick={() => markRead.mutate(n._id)} className="text-label-caps text-m3-primary hover:underline shrink-0">Mark Read</button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <EmptyState icon="notifications_none" title="No notifications" description="You're all caught up." />
      )}
    </div>
  );
}
