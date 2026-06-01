import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: inventoryApi.getStats,
    refetchInterval: 30000,
  });

  const { data: requests, isLoading: requestsLoading } = useQuery({
    queryKey: ['inventory', 'requests', 'urgent'],
    queryFn: inventoryApi.getUrgentRequests,
    refetchInterval: 30000,
  });

  // Calculate percentage correctly with a fallback to 75% visual demo if no data
  const capacityPercent = stats ? Math.round((stats.totalUnits / stats.capacity) * 100) : 75;
  const strokeOffset = 251.2 - (251.2 * capacityPercent) / 100;

  // Ordered blood types
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <>
      <div className="flex justify-between items-end mb-stack-lg">
        <div>
          <h2 className="font-display-lg text-display-lg text-on-surface">Command Center</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Live operational overview for City General.</p>
        </div>
        <div className="text-right">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Last Sync</p>
          <p className="font-body-md text-body-md text-primary font-semibold flex items-center gap-1 justify-end">
            <span className="material-symbols-outlined text-sm">sync</span> {statsLoading ? 'Syncing...' : 'Just now'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Urgent Alerts Card */}
        <div className="col-span-1 md:col-span-8 bg-white rounded-xl card-shadow p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-error/5 rounded-bl-full -mr-8 -mt-8"></div>
          
          <div className="flex items-center gap-3 mb-4">
            <span className="material-symbols-outlined text-error" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
            <h3 className="font-headline-md text-headline-md text-on-surface">Urgent Requests</h3>
            <span className="px-2 py-1 bg-error text-on-error rounded-full font-label-sm text-label-sm ml-auto">
              {requests?.length || 0} Active
            </span>
          </div>

          <div className="space-y-3">
            {requestsLoading ? (
              <div className="text-on-surface-variant p-4 text-center">Loading urgent requests...</div>
            ) : requests && requests.length > 0 ? (
              requests.map((req, i) => (
                <div key={req.id || i} className={`flex justify-between items-center p-3 rounded-lg ${req.status === 'CRITICAL' ? 'bg-error-container/20 border border-error-container/50' : 'bg-surface-container'}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${req.status === 'CRITICAL' ? 'bg-error/10 text-error' : 'bg-surface-variant text-on-surface-variant'}`}>
                      {req.bloodType}
                    </div>
                    <div>
                      <p className="font-label-md text-label-md text-on-surface">{req.unit}</p>
                      <p className={`font-label-sm text-label-sm ${req.status === 'CRITICAL' ? 'text-error' : 'text-on-surface-variant'}`}>
                        {req.status === 'CRITICAL' ? 'Critical Shortage - Needed immediately' : 'Scheduled Request'}
                      </p>
                    </div>
                  </div>
                  <button className={`px-4 py-2 rounded-lg font-label-md text-label-md transition-colors ${req.status === 'CRITICAL' ? 'bg-error text-on-error hover:bg-error/90' : 'border border-outline text-on-surface hover:bg-surface-variant'}`}>
                    {req.status === 'CRITICAL' ? 'Fulfill' : 'Review'}
                  </button>
                </div>
              ))
            ) : (
              <div className="flex justify-between items-center p-3 bg-error-container/20 rounded-lg border border-error-container/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error font-bold">O-</div>
                  <div>
                    <p className="font-label-md text-label-md text-on-surface">Trauma Unit - Case #4429</p>
                    <p className="font-label-sm text-label-sm text-error">Critical Shortage - Needed immediately</p>
                  </div>
                </div>
                <button className="px-4 py-2 bg-error text-on-error rounded-lg font-label-md text-label-md hover:bg-error/90 transition-colors">Fulfill</button>
              </div>
            )}
          </div>
        </div>

        {/* Overall Stock Level */}
        <div className="col-span-1 md:col-span-4 bg-white rounded-xl card-shadow p-6 flex flex-col items-center justify-center text-center">
          <h3 className="font-headline-md text-headline-md text-on-surface w-full text-left mb-6">Facility Capacity</h3>
          
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="#f3f4f3" strokeWidth="12" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="#b70011" strokeWidth="12" fill="none" strokeDasharray="251.2" strokeDashoffset={strokeOffset} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease-in-out' }} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-headline-lg text-headline-lg text-primary">{capacityPercent}%</span>
              <span className="font-label-sm text-label-sm text-on-surface-variant">Optimal</span>
            </div>
          </div>
          
          <p className="font-body-md text-body-md text-on-surface-variant">
            {stats ? `${stats.totalUnits} / ${stats.capacity} Units Available` : '420 / 560 Units Available'}
          </p>
        </div>

        {/* Inventory Grid */}
        <div className="col-span-1 md:col-span-12 bg-white rounded-xl card-shadow p-6 mt-stack-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-headline-md text-headline-md text-on-surface">Live Blood Inventory</h3>
            <button className="text-primary font-label-md text-label-md hover:underline flex items-center gap-1">
              View Detailed Log <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodTypes.map((type) => {
              // Get actual count or fallback dummy data
              const count = stats?.byType[type] ?? (type === 'O+' ? 142 : type === 'O-' ? 12 : type === 'A+' ? 85 : type === 'A-' ? 34 : type === 'B+' ? 67 : type === 'B-' ? 21 : type === 'AB+' ? 45 : 14);
              const isLow = type === 'O-' || count < 20;

              return (
                <div key={type} className={`rounded-lg p-4 flex flex-col items-center border-b-2 ${isLow ? 'bg-error-container/30 border-error' : 'bg-surface-container border-surface-variant'}`}>
                  <span className="font-headline-md text-headline-md text-on-surface mb-1">{type}</span>
                  <span className={`font-display-lg text-display-lg leading-none mb-2 ${isLow ? 'text-error' : (type === 'O+' ? 'text-primary' : 'text-on-surface')}`}>{count}</span>
                  <span className={`font-label-sm text-label-sm ${isLow ? 'text-error' : 'text-on-surface-variant'}`}>
                    {isLow ? 'Low Stock' : 'Units'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
