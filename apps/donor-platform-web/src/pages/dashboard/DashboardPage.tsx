import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../../api/donor';

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['donor', 'stats'],
    queryFn: donorApi.getStats,
    refetchInterval: 60000,
  });

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['donor', 'history'],
    queryFn: donorApi.getHistory,
    refetchInterval: 60000,
  });

  // Calculate days left, fallback to dummy
  const today = new Date();
  const nextEligible = stats?.nextEligibleDate ? new Date(stats.nextEligibleDate) : new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000);
  const diffTime = Math.abs(nextEligible.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <>
      {/* Emergency Alert Banner */}
      <div className="w-full bg-error-container border border-error/20 rounded-lg p-md flex items-start sm:items-center gap-md">
        <span className="material-symbols-outlined text-on-error-container mt-0.5 sm:mt-0" style={{ fontVariationSettings: "'FILL' 1" }}>warning</span>
        <div className="flex-grow">
          <h4 className="font-headline-sm text-headline-sm text-on-error-container mb-xs">Critical Shortage: O- Negative</h4>
          <p className="font-body-sm text-body-sm text-on-error-container/80">Local trauma centers are critically low on universal donor supplies. Your donation is urgently needed today.</p>
        </div>
        <button className="shrink-0 bg-on-error-container text-on-error px-md py-sm rounded border border-on-error-container font-label-caps text-label-caps hover:bg-error transition-colors">
          Find Center
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg items-start">
        {/* Left Column: Primary Metrics & History */}
        <div className="md:col-span-8 flex flex-col gap-lg">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-md">
            
            {/* Hero/Countdown Widget */}
            <div className="sm:col-span-2 bg-primary-container border border-primary/10 rounded-xl p-lg relative overflow-hidden flex flex-col justify-between min-h-[160px]">
              <div className="absolute -right-10 -top-10 text-primary opacity-10 pointer-events-none">
                <span className="material-symbols-outlined text-[150px]" style={{ fontVariationSettings: "'FILL' 1" }}>water_drop</span>
              </div>
              <div className="z-10">
                <span className="font-label-caps text-label-caps text-on-primary-container uppercase opacity-80 tracking-wider">Next Eligible Donation</span>
                <div className="mt-xs flex items-baseline gap-xs text-on-primary-container">
                  <span className="font-headline-lg text-headline-lg">{statsLoading ? '--' : diffDays}</span>
                  <span className="font-body-md text-body-md">Days</span>
                </div>
                <p className="font-body-sm text-body-sm text-on-primary-container/80 mt-1">
                  Whole Blood · Eligible on {monthNames[nextEligible.getMonth()]} {nextEligible.getDate()}
                </p>
              </div>
              <div className="z-10 mt-md">
                <button className="bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded hover:bg-surface-tint transition-colors flex items-center gap-xs w-max">
                  <span className="material-symbols-outlined text-[16px]">calendar_month</span>
                  Schedule Now
                </button>
              </div>
            </div>

            {/* Single Impact Metric Card */}
            <div className="bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between min-h-[160px]">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-label-caps text-on-surface-variant uppercase">Total Impact</span>
                <span className="material-symbols-outlined text-secondary text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
              </div>
              <div>
                <div className="flex items-baseline gap-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface">
                    {statsLoading ? '--' : (stats?.totalLivesSaved || 42)}
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant">Potential Lives Saved</p>
              </div>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-md">
            <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase">Gallons</span>
              <span className="font-data-mono text-data-mono text-on-surface text-[18px]">
                {statsLoading ? '--' : (stats?.gallonsDonated || 1.5)}
              </span>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase">Donations</span>
              <span className="font-data-mono text-data-mono text-on-surface text-[18px]">
                {statsLoading ? '--' : (stats?.totalDonations || 14)}
              </span>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase">Current Streak</span>
              <div className="flex items-center gap-xs">
                <span className="font-data-mono text-data-mono text-on-surface text-[18px]">
                  {statsLoading ? '--' : (stats?.currentStreak || 3)}
                </span>
                <span className="material-symbols-outlined text-secondary text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
              </div>
            </div>
            <div className="bg-surface border border-outline-variant rounded-lg p-md flex flex-col gap-xs">
              <span className="font-label-caps text-label-caps text-outline uppercase">Blood Type</span>
              <span className="font-headline-sm text-headline-sm text-error">
                {statsLoading ? '--' : (stats?.bloodType || 'O-')}
              </span>
            </div>
          </div>

          {/* Data Table: Recent History */}
          <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden mt-sm flex flex-col">
            <div className="px-md py-md border-b border-outline-variant flex justify-between items-center bg-surface-bright">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Recent Donations</h3>
              <button className="font-label-caps text-label-caps text-primary hover:text-surface-tint transition-colors">View All</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th className="px-md py-sm font-medium">Date</th>
                    <th className="px-md py-sm font-medium">Location</th>
                    <th className="px-md py-sm font-medium">Type</th>
                    <th className="px-md py-sm font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant/50">
                  {historyLoading ? (
                    <tr>
                      <td colSpan={4} className="px-md py-xl text-center text-on-surface-variant">Loading donation history...</td>
                    </tr>
                  ) : history && history.length > 0 ? (
                    history.map((record, i) => (
                      <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-md py-sm">{record.date}</td>
                        <td className="px-md py-sm text-body-sm font-body-sm">{record.location}</td>
                        <td className="px-md py-sm text-body-sm font-body-sm">{record.type}</td>
                        <td className="px-md py-sm">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-label-caps uppercase tracking-wider ${record.status === 'Completed' ? 'bg-secondary-container/30 text-secondary border border-secondary/20' : 'bg-surface-variant/30 text-surface-variant border border-surface-variant/20'}`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Mock data fallback if history array is empty (for UI testing)
                    <tr className="hover:bg-surface-container-low/50 transition-colors">
                      <td className="px-md py-sm">2023-08-12</td>
                      <td className="px-md py-sm text-body-sm font-body-sm">Metro General Hospital</td>
                      <td className="px-md py-sm text-body-sm font-body-sm">Whole Blood</td>
                      <td className="px-md py-sm">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary border border-secondary/20 text-[10px] font-label-caps uppercase tracking-wider">
                          Completed
                        </span>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Achievements & Context */}
        <div className="md:col-span-4 flex flex-col gap-lg">
          {/* Quick Info Card */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-sm">Preparation Guide</h3>
            <ul className="flex flex-col gap-sm">
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">water_drop</span>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface block">Hydrate</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Drink an extra 16 oz of water before your appointment.</span>
                </div>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">restaurant</span>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface block">Eat Well</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Have a healthy, low-fat meal within 2 hours of donating.</span>
                </div>
              </li>
              <li className="flex items-start gap-sm">
                <span className="material-symbols-outlined text-outline text-[18px] mt-0.5">badge</span>
                <div>
                  <span className="font-label-caps text-label-caps text-on-surface block">Bring ID</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant block mt-0.5">Don't forget your donor card or government-issued ID.</span>
                </div>
              </li>
            </ul>
          </div>

          {/* Achievements */}
          <div className="bg-surface border border-outline-variant rounded-xl p-md">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-sm">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Achievements</h3>
              <span className="font-data-mono text-data-mono text-on-surface-variant bg-surface-container-highest px-2 py-0.5 rounded">4 Earned</span>
            </div>
            
            <div className="grid grid-cols-2 gap-sm">
              <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-sm flex flex-col items-center text-center gap-xs hover:bg-surface-container transition-colors cursor-default">
                <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface">First Drop</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">Joined the cause</span>
              </div>
              
              <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-sm flex flex-col items-center text-center gap-xs hover:bg-surface-container transition-colors cursor-default">
                <div className="w-10 h-10 rounded-full bg-secondary-container text-secondary flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface">1 Gallon Club</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">Major milestone</span>
              </div>
              
              <div className="bg-surface-container-low border border-outline-variant/50 rounded-lg p-sm flex flex-col items-center text-center gap-xs hover:bg-surface-container transition-colors cursor-default">
                <div className="w-10 h-10 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                </div>
                <span className="font-label-caps text-label-caps text-on-surface">Hot Streak</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant text-[10px]">3x in one year</span>
              </div>
              
              <div className="bg-surface border border-dashed border-outline-variant rounded-lg p-sm flex flex-col items-center text-center gap-xs opacity-60">
                <div className="w-10 h-10 rounded-full bg-surface-dim text-outline flex items-center justify-center">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <span className="font-label-caps text-label-caps text-outline">5 Gallon Hero</span>
                <span className="font-body-sm text-body-sm text-outline text-[10px]">In progress...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
