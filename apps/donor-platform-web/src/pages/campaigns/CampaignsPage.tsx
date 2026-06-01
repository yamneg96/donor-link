import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../../api/client';

export default function CampaignsPage() {
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['donor', 'campaigns'],
    queryFn: async () => {
      try {
        const { data } = await apiClient.get('/engagement/campaigns');
        return data;
      } catch {
        return [
          { id: 1, title: 'Summer Shortage Drive', location: 'City Park Center', target: 500, current: 342, daysLeft: 4, type: 'CRITICAL' },
          { id: 2, title: 'Annual Corporate Challenge', location: 'Metro Financial District', target: 1000, current: 850, daysLeft: 12, type: 'COMMUNITY' }
        ]; // Fallback mock 
      }
    },
  });

  return (
    <div className="flex flex-col gap-xl">
      {/* 1. Page Header Block Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md border-b border-outline-variant pb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-background">Community Impact Hub</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Track regional goals and join active drives.</p>
        </div>
        <div className="flex gap-sm">
          <button className="bg-surface border border-outline text-on-surface font-label-caps text-label-caps px-4 py-2 rounded-xl flex items-center gap-xs hover:bg-surface-container-low transition-colors text-[11px] font-semibold tracking-wider">
            <span className="material-symbols-outlined text-[18px]">filter_list</span>
            FILTER
          </button>
          <button className="bg-primary text-on-primary font-label-caps text-label-caps px-4 py-2 rounded-xl flex items-center gap-xs hover:bg-on-primary-fixed-variant transition-colors shadow-sm text-[11px] font-semibold tracking-wider">
            <span className="material-symbols-outlined text-[18px]">add</span>
            HOST A DRIVE
          </button>
        </div>
      </div>

      {/* 2. Premium Operations Bento Layout Grid */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-gutter">
        {/* Primary Widget Frame: Regional Aggregated Analytics Context */}
        <div className="md:col-span-8 bg-surface border border-outline-variant rounded-xl p-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none"></div>
          <div className="relative z-10 flex justify-between items-start mb-xl">
            <div>
              <div className="flex items-center gap-sm mb-xs">
                <span className="material-symbols-outlined text-primary text-[20px]">flag</span>
                <span className="font-label-caps text-label-caps text-primary text-[11px] font-bold tracking-wider">Q3 REGIONAL CAMPAIGN</span>
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">Operation Summer Supply</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Critical reserves are traditionally low during summer months. Join the initiative to restock our network.
              </p>
            </div>
            <div className="bg-error-container text-on-error-container px-2 py-1 rounded-lg font-label-caps text-[10px] font-bold tracking-wide flex items-center gap-xs border border-[#ffb4ab]">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              HIGH NEED
            </div>
          </div>
          
          <div className="relative z-10">
            <div className="flex justify-between items-end mb-sm">
              <div>
                <span className="font-headline-lg text-headline-lg text-on-surface font-bold">14,205</span>
                <span className="font-body-sm text-body-sm text-on-surface-variant ml-1">Units Collected</span>
              </div>
              <div className="text-right">
                <span className="font-data-mono text-data-mono text-on-surface text-xs font-semibold">Target: 20,000</span>
              </div>
            </div>
            <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '71%' }}></div>
            </div>
            <div className="flex justify-between mt-xs">
              <span className="font-data-mono text-data-mono text-outline text-[11px]">71% Complete</span>
              <span className="font-data-mono text-data-mono text-outline text-[11px]">Ends in 14 Days</span>
            </div>
          </div>
        </div>

        {/* Secondary Canvas Frame: Interactive Embedded Map Preview */}
        <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl overflow-hidden relative min-h-[240px] flex flex-col">
          <div className="absolute inset-0 bg-surface-variant">
            <img alt="Regional Map View Frame" className="w-full h-full object-cover opacity-60 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBv9mKqBLI-EvdHP7v9PqdV97dYqT_6G3cWDq7Jyyu3KxtAe28fEeBAfdpVSqcd1t1fZgxDQ3VQeo98rFHXu5_NNH8Lf0S-hdyFiSQO92oQ6z-BcgLNBUMBZcv3AYohsq4H1xoLLbNuGHJDJbU6H_P_WhULG7ZBnjHuS_-XE752Db21YmHV_vq3ZdSC0nWPfJFCYbxp59ko92f6j-u5azkJZ6_Rjfim5ct2vEzNsTPZvW76lSxUWg25sHficSeU8CEB-bJgxi6fKYEL" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
          <div className="relative z-10 p-lg flex flex-col h-full justify-between flex-grow">
            <div className="flex justify-end">
              <button className="w-8 h-8 bg-surface rounded-lg shadow-sm flex items-center justify-center border border-outline-variant text-on-surface-variant hover:text-primary transition-colors">
                <span className="material-symbols-outlined text-[18px]">zoom_in</span>
              </button>
            </div>
            <div>
              <h4 className="font-headline-sm text-headline-sm text-on-surface mb-xs font-bold">Logistics Network</h4>
              <div className="flex flex-col gap-xs">
                <div className="flex items-center gap-sm bg-surface-container-lowest/80 backdrop-blur-sm p-1.5 rounded-lg border border-outline-variant/60">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span className="font-data-mono text-data-mono text-on-surface text-xs font-medium">12 Active Mobile Units</span>
                </div>
                <div className="flex items-center gap-sm bg-surface-container-lowest/80 backdrop-blur-sm p-1.5 rounded-lg border border-outline-variant/60">
                  <div className="w-2 h-2 rounded-full bg-secondary"></div>
                  <span className="font-data-mono text-data-mono text-on-surface text-xs font-medium">4 Processing Centers</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Analytics Highlight Row Metrics */}
        <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="font-label-caps text-on-surface-variant mb-1 text-[10px] font-bold tracking-wider text-outline uppercase">NEW DONORS (WEEK)</p>
            <p className="font-headline-md text-headline-md font-bold text-on-surface">428</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
            <span className="material-symbols-outlined">group_add</span>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="font-label-caps text-on-surface-variant mb-1 text-[10px] font-bold tracking-wider text-outline uppercase">DRIVES COMPLETED</p>
            <p className="font-headline-md text-headline-md font-bold text-on-surface">84</p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed-variant">
            <span className="material-symbols-outlined">check_circle</span>
          </div>
        </div>

        <div className="md:col-span-4 bg-surface border border-outline-variant rounded-xl p-md flex items-center justify-between">
          <div>
            <p className="font-label-caps text-on-surface-variant mb-1 text-[10px] font-bold tracking-wider text-outline uppercase">AVG PROCESSING TIME</p>
            <p className="font-headline-md text-headline-md font-bold text-on-surface">1.2 <span className="font-data-mono text-data-mono text-outline text-xs">Days</span></p>
          </div>
          <div className="w-10 h-10 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface-variant">
            <span className="material-symbols-outlined">timer</span>
          </div>
        </div>
      </section>

      {/* 3. Live Active Query Campaign Processing Card Row Container */}
      <section className="mt-lg">
        <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface mb-md">Live Campaigns</h3>
        
        {isLoading ? (
          <div className="text-center py-20 text-on-surface-variant font-medium flex flex-col items-center justify-center gap-2 border border-dashed border-outline-variant rounded-xl bg-surface/50">
            <span className="animate-spin material-symbols-outlined text-primary text-[28px]">progress_activity</span>
            <span>Loading live campaigns...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
            {campaigns?.map((camp: any) => (
              <div key={camp.id} className="bg-surface border border-outline-variant rounded-xl overflow-hidden hover:shadow-md hover:border-primary transition-all duration-200 cursor-pointer group flex flex-col">
                {/* Header Canvas Container Pattern */}
                <div className="h-32 bg-primary-container relative overflow-hidden flex items-center justify-center border-b border-outline-variant/40">
                  <div className="absolute inset-0 tibeb-overlay"></div>
                  <h3 className="font-headline-sm relative z-10 text-on-primary-container px-4 text-center font-bold tracking-tight transition-transform duration-300 group-hover:scale-105">
                    {camp.title}
                  </h3>
                  {camp.type === 'CRITICAL' && (
                    <span className="absolute top-3 right-3 bg-error text-on-error px-2 py-0.5 rounded-md font-label-caps text-[10px] font-bold tracking-wider uppercase shadow-sm">
                      Urgent
                    </span>
                  )}
                  {camp.type !== 'CRITICAL' && (
                    <span className="absolute top-3 right-3 bg-surface/90 backdrop-blur px-2 py-0.5 rounded-md border border-outline-variant/50 font-label-caps text-[10px] font-bold text-on-surface tracking-wider uppercase">
                      {camp.type || 'CAMP'}
                    </span>
                  )}
                </div>
                
                {/* Content Payload Metadata Card Block */}
                <div className="p-md flex flex-col flex-grow justify-between">
                  <div>
                    <p className="font-data-mono text-on-surface-variant text-xs font-semibold flex items-center gap-1.5 mb-4">
                      <span className="material-symbols-outlined text-[16px] text-outline">location_on</span> 
                      <span>{camp.location}</span>
                    </p>
                    
                    <div className="space-y-sm">
                      <div className="flex justify-between font-label-caps text-[10px] font-bold tracking-wide text-outline uppercase">
                        <span>{camp.current} Donations</span>
                        <span>Target: {camp.target}</span>
                      </div>
                      <div className="w-full bg-surface-container rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-primary rounded-full h-2 transition-all duration-500" 
                          style={{ width: `${Math.min((camp.current / camp.target) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="font-body-sm text-xs font-medium text-outline text-right mb-3">
                      {camp.daysLeft} Days Left!
                    </p>
                    <button className="w-full bg-surface-container-high hover:bg-primary text-on-surface hover:text-white py-2 rounded-xl font-label-caps text-xs font-bold tracking-wider uppercase transition-all duration-150 active:scale-[0.98]">
                      Join Campaign
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Scheduling Metrics Frame Component Data Table */}
      <section className="mt-lg mb-xl">
        <div className="flex items-center justify-between mb-md">
          <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Upcoming Regional Drives</h3>
          <button className="font-label-caps text-[11px] font-bold tracking-wider text-outline hover:text-primary transition-colors uppercase">
            VIEW ALL SCHEDULES
          </button>
        </div>
        <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant/60">
                <th className="py-3 px-md font-label-caps text-[11px] tracking-wider text-on-surface-variant font-bold uppercase">DATE</th>
                <th className="py-3 px-md font-label-caps text-[11px] tracking-wider text-on-surface-variant font-bold uppercase">LOCATION</th>
                <th className="py-3 px-md font-label-caps text-[11px] tracking-wider text-on-surface-variant font-bold uppercase hidden sm:table-cell">TYPE</th>
                <th className="py-3 px-md font-label-caps text-[11px] tracking-wider text-on-surface-variant font-bold uppercase text-right">CAPACITY</th>
              </tr>
            </thead>
            <tbody className="font-data-mono text-xs text-on-surface divide-y divide-surface-variant/40">
              <tr className="hover:bg-primary-fixed/10 transition-colors">
                <td className="py-3.5 px-md font-medium text-on-surface-variant">Oct 24, 09:00 AM</td>
                <td className="py-3.5 px-md flex items-center gap-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  City Hall Plaza
                </td>
                <td className="py-3.5 px-md hidden sm:table-cell">
                  <span className="inline-block bg-surface-container px-2 py-0.5 rounded-md text-[11px] font-medium text-on-surface-variant border border-outline-variant/20">Mobile Unit</span>
                </td>
                <td className="py-3.5 px-md text-right">
                  <div className="flex items-center justify-end gap-sm">
                    <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[85%]"></div>
                    </div>
                    <span className="text-outline font-bold">85%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-primary-fixed/10 transition-colors">
                <td className="py-3.5 px-md font-medium text-on-surface-variant">Oct 26, 10:00 AM</td>
                <td className="py-3.5 px-md flex items-center gap-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  Tech Park Campus, Bldg 4
                </td>
                <td className="py-3.5 px-md hidden sm:table-cell">
                  <span className="inline-block bg-surface-container px-2 py-0.5 rounded-md text-[11px] font-medium text-on-surface-variant border border-outline-variant/20">Pop-up</span>
                </td>
                <td className="py-3.5 px-md text-right">
                  <div className="flex items-center justify-end gap-sm">
                    <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="bg-primary h-full w-[40%]"></div>
                    </div>
                    <span className="text-outline font-bold">40%</span>
                  </div>
                </td>
              </tr>
              <tr className="hover:bg-primary-fixed/10 transition-colors">
                <td className="py-3.5 px-md font-medium text-on-surface-variant">Oct 28, 08:30 AM</td>
                <td className="py-3.5 px-md flex items-center gap-sm font-semibold">
                  <span className="material-symbols-outlined text-[16px] text-outline">location_on</span>
                  General Hospital Main Atrium
                </td>
                <td className="py-3.5 px-md hidden sm:table-cell">
                  <span className="inline-block bg-surface-container px-2 py-0.5 rounded-md text-[11px] font-medium text-on-surface-variant border border-outline-variant/20">Fixed Center</span>
                </td>
                <td className="py-3.5 px-md text-right">
                  <div className="flex items-center justify-end gap-sm">
                    <div className="w-16 h-1.5 bg-surface-variant rounded-full overflow-hidden">
                      <div className="bg-error h-full w-[95%]"></div>
                    </div>
                    <span className="text-error font-bold">95%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}