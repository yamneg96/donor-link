import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory';

export default function EmergencyPage() {
  const { data: requests, isLoading } = useQuery({
    queryKey: ['inventory', 'requests', 'urgent'],
    queryFn: inventoryApi.getUrgentRequests,
  });

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h2 className="font-display-lg text-display-lg text-error">Emergency Command</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Manage critical shortages and urgent blood requests.</p>
        </div>
        <button className="bg-error text-on-error px-6 py-3 rounded-lg font-label-md text-label-md shadow flex items-center justify-center gap-2 hover:bg-error/90">
             <span className="material-symbols-outlined">warning</span>
             Declare Regional Emergency
        </button>
      </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
           <div className="bg-error-container/10 border border-error/50 rounded-xl card-shadow p-6">
              <h3 className="font-headline-md text-headline-md text-error mb-4">Active Critical Requests</h3>
              <div className="space-y-3">
                 {isLoading ? (
                     <div className="text-on-surface-variant w-full text-center py-10">Fetching live emergency requests...</div>
                 ) : requests && requests.length > 0 ? (
                     requests.filter(r => r.status === 'CRITICAL').map(req => (
                        <div key={req.id} className="bg-surface-bright border-l-4 border-error p-4 rounded shadow-sm flex items-center justify-between">
                            <div>
                                <span className="font-headline-sm text-headline-sm text-on-surface">Unit {req.unit}</span>
                                <p className="font-body-sm text-on-surface-variant flex items-center gap-2 mt-1">
                                   <span className="w-2 h-2 rounded-full bg-error animate-pulse"></span> Needed: {req.bloodType} immediately
                                </p>
                            </div>
                            <button className="border border-error text-error px-4 py-2 rounded text-label-md hover:bg-error hover:text-white transition-colors">Dispatch Now</button>
                        </div>
                     ))
                 ) : (
                     <div className="bg-surface-bright border-l-4 border-surface-variant p-4 rounded shadow-sm text-center font-body-md text-on-surface-variant">
                         No critical local requests at this time.
                     </div>
                 )}
              </div>
           </div>

           <div className="bg-surface rounded-xl card-shadow p-6 flex flex-col justify-center items-center text-center">
                <span className="material-symbols-outlined text-outline/50 text-[120px] mb-4">radar</span>
                <h3 className="font-headline-md text-headline-md text-on-surface">Nearby Hospital SOS Broadcast</h3>
                <p className="font-body-md max-w-sm text-on-surface-variant mt-2 mb-6">Listen to the regional dispatch network for critical shortages in nearby partner facilities to transfer units.</p>
                <div className="w-full h-32 bg-surface-container rounded-lg flex items-center justify-center border border-dashed border-outline-variant">
                   <div className="flex gap-2 items-center text-on-surface-variant">
                      <span className="material-symbols-outlined animate-spin">sync</span> Scanning frequencies...
                   </div>
                </div>
           </div>
       </div>
    </div>
  )
}
