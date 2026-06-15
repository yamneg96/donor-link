import { MaterialIcon } from "../../components/shared/MaterialIcon";
import { useUrgentRequests } from "../../hooks/useApi";
import { LoadingSkeleton } from "../../components/shared/EmptyState";
import { cn } from "../../lib/utils";

export default function EmergencyPage() {
  const { data: requests, isLoading } = useUrgentRequests();

  const criticalRequests = requests?.filter((r: any) => r.urgency === 'CRITICAL') || [];

  return (
    <div className="flex-1 p-container-padding-desktop flex flex-col gap-6">
      <div className="flex justify-between items-end gap-4">
        <div>
          <h2 className="text-display-lg text-m3-error tracking-tight font-bold">Emergency Command</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2 font-medium">Critical shortage management and regional SOS coordination.</p>
        </div>
        <button className="bg-m3-error text-m3-on-error px-6 py-3 rounded-lg font-bold shadow-soft-red flex items-center justify-center gap-2 hover:opacity-90">
             <MaterialIcon icon="emergency_share" filled />
             Declare Local Emergency
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-m3-error-container/30 border border-m3-error/20 rounded-2xl p-6 shadow-ambient-sm backdrop-blur-sm self-start">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-m3-error flex items-center justify-center animate-pulse">
                <MaterialIcon icon="priority_high" className="text-m3-on-error" size={20} />
            </div>
            <h3 className="text-headline-sm text-m3-error font-bold">Active Critical Needs</h3>
          </div>

          <div className="space-y-3">
             {isLoading ? (
                 <LoadingSkeleton rows={4} />
             ) : criticalRequests.length > 0 ? (
                 criticalRequests.map((req: any) => (
                    <div key={req._id} className="bg-m3-surface-container-lowest border-l-4 border-m3-error p-5 rounded-r-xl shadow-sm flex items-center justify-between">
                        <div>
                            <span className="text-title-medium text-m3-on-surface font-bold">{req.bloodType} Required</span>
                            <p className="text-body-small text-m3-on-surface-variant flex items-center gap-2 mt-1">
                               Needed: {req.units} Units • {req.notes || "Emergency Surgery"}
                            </p>
                        </div>
                        <button className="bg-m3-error text-m3-on-error px-4 py-2 rounded-lg text-label-caps font-bold hover:opacity-90 transition-all">Coordinate</button>
                    </div>
                 ))
             ) : (
                 <div className="bg-m3-surface-container-low border border-dashed border-m3-outline-variant p-10 rounded-xl text-center text-m3-on-surface-variant">
                     <MaterialIcon icon="check_circle" size={48} className="mx-auto mb-3 text-green-200" />
                     <p className="font-bold">No active local emergencies.</p>
                 </div>
             )}
          </div>
        </div>

        <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-ambient-lg relative overflow-hidden group">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--m3-primary)_0%,_transparent_70%)] opacity-0 group-hover:opacity-5 transition-opacity duration-1000"></div>
            
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-m3-primary/10 rounded-full scale-150 animate-ping"></div>
                <div className="w-32 h-32 rounded-full border-4 border-m3-primary flex items-center justify-center bg-white shadow-lg">
                    <MaterialIcon icon="radar" size={64} className="text-m3-primary animate-pulse" />
                </div>
            </div>

            <h3 className="text-headline-md text-m3-on-surface tracking-tight">Regional SOS Broadcast</h3>
            <p className="text-body-main text-m3-on-surface-variant max-w-sm mt-4 mb-8">
              Listening to local frequencies for critical shortages in nearby facilities. You can offer immediate unit transfers.
            </p>

            <div className="w-full bg-m3-surface-container rounded-xl p-6 border border-m3-outline-variant relative">
                <div className="flex flex-col items-center gap-3 text-m3-on-surface-variant font-bold text-xs uppercase tracking-widest">
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => <div key={i} className={`w-1 h-8 rounded-full bg-m3-primary/20 animate-pulse`} style={{ animationDelay: `${i * 200}ms` }}></div>)}
                  </div>
                  Scanning Regional Network...
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
