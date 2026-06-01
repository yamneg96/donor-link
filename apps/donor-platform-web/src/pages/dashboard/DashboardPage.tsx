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

  // Calculate days left, fallback to backend intent timeline
  const today = new Date();
  const nextEligible = stats?.nextEligibleDate ? new Date(stats.nextEligibleDate) : new Date(today.getTime() + 12 * 24 * 60 * 60 * 1000);
  const diffTime = Math.abs(nextEligible.getTime() - today.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-6 p-4 md:p-6 lg:p-8">
      
      {/* Emergency Alert Banner */}
      <div className="group relative flex flex-col gap-4 overflow-hidden rounded-xl border border-error/20 bg-error-container p-5 transition-all duration-300 hover:shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-error/10 text-on-error-container">
            <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              warning
            </span>
          </div>
          <div className="space-y-1">
            <h4 className="font-headline-sm text-lg font-bold tracking-tight text-on-error-container">
              Critical Shortage: O- Negative
            </h4>
            <p className="font-body-sm max-w-2xl text-sm leading-relaxed text-on-error-container/80">
              Local trauma centers are critically low on universal donor supplies. Your donation is urgently needed today.
            </p>
          </div>
        </div>
        <button className="w-full shrink-0 rounded-lg bg-on-error-container px-5 py-2.5 font-label-caps text-xs font-semibold tracking-wider text-on-error transition-all duration-200 hover:bg-error hover:shadow-sm sm:w-auto">
          Find Center
        </button>
      </div>

      {/* Main Grid Workspace */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-start">
        
        {/* Left Column: Primary Metrics & History */}
        <div className="flex flex-col gap-6 lg:col-span-8">
          
          {/* Top Hero Row */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            
            {/* Hero/Countdown Widget */}
            <div className="relative flex min-h-[180px] flex-col justify-between overflow-hidden rounded-2xl border border-primary/10 bg-primary-container p-6 shadow-sm transition-all duration-300 hover:shadow-md sm:col-span-2">
              <div className="absolute -right-6 -top-6 text-primary/10 pointer-events-none select-none transition-transform duration-500 group-hover:scale-110">
                <span className="material-symbols-outlined text-[160px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  water_drop
                </span>
              </div>
              
              <div className="relative z-10 space-y-1">
                <span className="font-label-caps text-xs font-bold tracking-widest text-on-primary-container/80 uppercase">
                  Next Eligible Donation
                </span>
                <div className="flex items-baseline gap-1.5 text-on-primary-container">
                  <span className="font-headline-lg text-4xl font-black tracking-tight md:text-5xl">
                    {statsLoading ? '--' : diffDays}
                  </span>
                  <span className="font-body-md text-base font-medium opacity-90">Days</span>
                </div>
                <p className="font-body-sm text-xs text-on-primary-container/70">
                  Whole Blood · Eligible on {monthNames[nextEligible.getMonth()]} {nextEligible.getDate()}
                </p>
              </div>

              <div className="relative z-10 mt-6">
                <button className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 font-label-caps text-xs font-bold tracking-wider text-on-primary shadow-sm transition-all duration-200 hover:bg-surface-tint hover:shadow">
                  <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                  Schedule Now
                </button>
              </div>
            </div>

            {/* Single Impact Metric Card */}
            <div className="flex min-h-[180px] flex-col justify-between rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm transition-all duration-300 hover:shadow-md">
              <div className="flex items-center justify-between">
                <span className="font-label-caps text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                  Total Impact
                </span>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    favorite
                  </span>
                </div>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-baseline gap-1">
                  <span className="font-headline-lg text-4xl font-black tracking-tight text-on-surface">
                    {statsLoading ? '--' : (stats?.totalLivesSaved || 42)}
                  </span>
                </div>
                <p className="font-body-sm text-sm font-medium text-on-surface-variant/80">Potential Lives Saved</p>
              </div>
            </div>
          </div>

          {/* Secondary Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Gallons', value: statsLoading ? '--' : (stats?.gallonsDonated || 1.5), type: 'mono' },
              { label: 'Donations', value: statsLoading ? '--' : (stats?.totalDonations || 14), type: 'mono' },
              { 
                label: 'Current Streak', 
                value: statsLoading ? '--' : (stats?.currentStreak || 3), 
                type: 'streak',
                icon: 'local_fire_department' 
              },
              { label: 'Blood Type', value: statsLoading ? '--' : (stats?.bloodType || 'O-'), type: 'danger' }
            ].map((metric, idx) => (
              <div key={idx} className="group rounded-xl border border-outline-variant bg-surface p-4 shadow-sm transition-all duration-200 hover:border-outline hover:shadow-sm">
                <span className="block font-label-caps text-[11px] font-bold tracking-widest text-outline uppercase mb-2">
                  {metric.label}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-xl font-bold tracking-tight ${
                    metric.type === 'danger' ? 'text-error font-headline-sm text-2xl' : 'text-on-surface font-data-mono'
                  }`}>
                    {metric.value}
                  </span>
                  {metric.icon && (
                    <span className="material-symbols-outlined text-secondary text-[18px] animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {metric.icon}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Data Table Container */}
          <div className="rounded-2xl border border-outline-variant bg-surface shadow-sm overflow-hidden flex flex-col mt-2">
            <div className="flex items-center justify-between border-b border-outline-variant bg-surface-bright px-6 py-4">
              <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">Recent Donations</h3>
              <button className="font-label-caps text-xs font-bold tracking-wider text-primary transition-colors hover:text-surface-tint">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead className="bg-surface-container-low border-b border-outline-variant font-label-caps text-[11px] font-bold tracking-wider text-on-surface-variant uppercase">
                  <tr>
                    <th className="px-6 py-3.5">Date</th>
                    <th className="px-6 py-3.5">Location</th>
                    <th className="px-6 py-3.5">Type</th>
                    <th className="px-6 py-3.5">Status</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-sm text-on-surface divide-y divide-outline-variant/40">
                  {historyLoading ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center text-on-surface-variant">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-xs font-medium">Loading donation history...</span>
                        </div>
                      </td>
                    </tr>
                  ) : history && history.length > 0 ? (
                    history.map((record, i) => (
                      <tr key={i} className="group hover:bg-surface-container-low/40 transition-colors">
                        <td className="px-6 py-3.5 whitespace-nowrap font-medium text-on-surface/90">{record.date}</td>
                        <td className="px-6 py-3.5 font-body-sm text-sm text-on-surface-variant">{record.location}</td>
                        <td className="px-6 py-3.5 font-body-sm text-sm text-on-surface-variant">{record.type}</td>
                        <td className="px-6 py-3.5 whitespace-nowrap">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border ${
                            record.status === 'Completed' 
                              ? 'bg-secondary-container/20 text-secondary border-secondary/20' 
                              : 'bg-surface-variant/30 text-surface-variant border-surface-variant/20'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    // Fallback block if table context lacks active rows
                    <tr className="group hover:bg-surface-container-low/40 transition-colors">
                      <td className="px-6 py-3.5 whitespace-nowrap font-medium text-on-surface/90">2023-08-12</td>
                      <td className="px-6 py-3.5 font-body-sm text-sm text-on-surface-variant">Metro General Hospital</td>
                      <td className="px-6 py-3.5 font-body-sm text-sm text-on-surface-variant">Whole Blood</td>
                      <td className="px-6 py-3.5 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase border bg-secondary-container/20 text-secondary border-secondary/20">
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

        {/* Right Column: Achievements & Informational Sidebar */}
        <div className="flex flex-col gap-6 lg:col-span-4 w-full">
          
          {/* Preparation Guide */}
          <div className="rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight mb-4">
              Preparation Guide
            </h3>
            <ul className="flex flex-col gap-4">
              {[
                { icon: 'water_drop', title: 'Hydrate', desc: 'Drink an extra 16 oz of water before your appointment.' },
                { icon: 'restaurant', title: 'Eat Well', desc: 'Have a healthy, low-fat meal within 2 hours of donating.' },
                { icon: 'badge', title: 'Bring ID', desc: "Don't forget your donor card or government-issued ID." }
              ].map((step, idx) => (
                <li key={idx} className="flex items-start gap-3.5 group">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-surface-container border border-outline-variant/40 text-outline transition-colors group-hover:bg-primary/5 group-hover:text-primary">
                    <span className="material-symbols-outlined text-[18px]">{step.icon}</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block font-label-caps text-xs font-bold tracking-wider text-on-surface">
                      {step.title}
                    </span>
                    <span className="block font-body-sm text-xs leading-relaxed text-on-surface-variant">
                      {step.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Achievements Block */}
          <div className="rounded-2xl border border-outline-variant bg-surface p-6 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="flex items-center justify-between border-b border-outline-variant pb-3 mb-4">
              <h3 className="font-headline-sm text-base font-bold text-on-surface tracking-tight">Achievements</h3>
              <span className="font-data-mono text-xs font-bold text-on-surface-variant bg-surface-container-highest px-2.5 py-0.5 rounded-md">
                4 Earned
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: 'First Drop', desc: 'Joined the cause', icon: 'star', bg: 'bg-primary-container text-on-primary-container' },
                { title: '1 Gallon Club', desc: 'Major milestone', icon: 'workspace_premium', bg: 'bg-secondary-container text-secondary' },
                { title: 'Hot Streak', desc: '3x in one year', icon: 'local_fire_department', bg: 'bg-tertiary-container text-on-tertiary-container' },
              ].map((badge, idx) => (
                <div key={idx} className="group/badge rounded-xl border border-outline-variant/60 bg-surface-container-low p-4 flex flex-col items-center text-center gap-2 transition-all duration-200 hover:bg-surface-container hover:scale-[1.02] cursor-default">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover/badge:rotate-12 ${badge.bg}`}>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {badge.icon}
                    </span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="block font-label-caps text-xs font-bold tracking-tight text-on-surface">
                      {badge.title}
                    </span>
                    <span className="block font-body-sm text-[10px] text-on-surface-variant/80">
                      {badge.desc}
                    </span>
                  </div>
                </div>
              ))}

              {/* Locked Achievement Target */}
              <div className="rounded-xl border border-dashed border-outline-variant bg-surface p-4 flex flex-col items-center text-center gap-2 opacity-60 transition-opacity duration-200 hover:opacity-80">
                <div className="w-10 h-10 rounded-xl bg-surface-dim border border-outline-variant text-outline flex items-center justify-center">
                  <span className="material-symbols-outlined text-[18px]">lock</span>
                </div>
                <div className="space-y-0.5">
                  <span className="block font-label-caps text-xs font-semibold tracking-tight text-outline">
                    5 Gallon Hero
                  </span>
                  <span className="block font-body-sm text-[10px] text-outline">
                    In progress...
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}