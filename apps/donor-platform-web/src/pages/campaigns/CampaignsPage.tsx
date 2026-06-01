import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
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
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Live Campaigns</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Join local drives and multiply your impact.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
         {isLoading ? (
             <div className="col-span-1 md:col-span-2 text-center py-20 text-on-surface-variant">Loading live campaigns...</div>
         ) : (
            campaigns?.map((camp: any) => (
                <div key={camp.id} className="bg-surface border border-outline-variant rounded-xl overflow-hidden hover:border-primary transition-colors cursor-pointer group">
                    <div className="h-32 bg-primary-container relative overflow-hidden flex items-center justify-center">
                         <div className="absolute inset-0 tibeb-overlay"></div>
                         <h3 className="font-headline-sm relative z-10 text-on-primary-container group-hover:scale-105 transition-transform">{camp.title}</h3>
                         {camp.type === 'CRITICAL' && (
                             <span className="absolute top-4 right-4 bg-error text-on-error px-2 py-1 rounded font-label-caps text-xs">Urgent</span>
                         )}
                    </div>
                    <div className="p-md">
                        <p className="font-data-mono text-on-surface-variant flex items-center gap-1 mb-4">
                           <span className="material-symbols-outlined text-[16px]">location_on</span> {camp.location}
                        </p>
                        
                        <div className="space-y-sm">
                           <div className="flex justify-between font-label-caps text-[10px] text-outline">
                               <span>{camp.current} Donations</span>
                               <span>Target: {camp.target}</span>
                           </div>
                           <div className="w-full bg-surface-container rounded-full h-2">
                               <div className="bg-primary rounded-full h-2" style={{width: `${Math.min((camp.current / camp.target) * 100, 100)}%`}}></div>
                           </div>
                           <p className="font-body-sm text-on-surface text-right mt-1">{camp.daysLeft} Days Left!</p>
                        </div>

                        <button className="w-full mt-lg bg-surface-container-high text-on-surface py-2 rounded font-label-caps uppercase hover:bg-primary hover:text-white transition-colors">Join Campaign</button>
                    </div>
                </div>
            ))
         )}
      </div>
    </div>
  )
}
