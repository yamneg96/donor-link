export function EmergencyPage() {
  return (
    <div className="flex flex-col gap-lg px-margin md:px-0">
      <div className="bg-error-container rounded-xl p-md border border-error/20">
        <h3 className="font-headline-sm text-headline-sm text-on-error-container">Emergency Mobilization Center</h3>
        <p className="font-body-sm text-body-sm text-on-error-container/80 mt-xs">Active critical shortages requiring universal donors.</p>
        <div className="mt-md">
          <div className="h-48 bg-error/10 rounded-lg flex items-center justify-center text-error font-bold">
            Interactive Disaster Map / Notifications Area
          </div>
        </div>
      </div>
    </div>
  );
}
