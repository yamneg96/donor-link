export function RequestsPage() {
  return (
    <div className="flex-1 p-container-padding-desktop flex flex-col gap-stack-md">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Blood Requests</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage, dispatch, and monitor incoming unit requests.</p>
        </div>
      </div>
      <div className="bg-surface rounded-2xl p-6 shadow-soft-warm border border-surface-variant/50">
        <p className="text-on-surface-variant">Request management module...</p>
      </div>
    </div>
  );
}
