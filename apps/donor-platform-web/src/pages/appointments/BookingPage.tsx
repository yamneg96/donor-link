import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../../api/donor';

export default function AppointmentsPage() {
  const { data: history, isLoading } = useQuery({
    queryKey: ['donor', 'history'],
    queryFn: donorApi.getHistory,
  });

  return (
    <div className="flex flex-col gap-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-4">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Appointments Center</h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-1">Manage your active bookings and history.</p>
        </div>
        <button className="bg-primary text-on-primary font-label-caps text-label-caps px-lg py-sm rounded border border-primary hover:bg-surface-tint transition-colors shadow-sm whitespace-nowrap mt-4 sm:mt-0">
            Book New Slot
        </button>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
          <div className="px-md py-md border-b border-outline-variant flex items-center justify-between">
             <h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming drives & centres map</h3>
             <span className="material-symbols-outlined text-outline">map</span>
          </div>
          <div className="bg-surface-container-low p-10 flex flex-col items-center justify-center border-b border-outline-variant text-on-surface-variant">
             <span className="material-symbols-outlined text-6xl mb-4 text-outline/50">location_off</span>
             <p className="font-body-sm text-center max-w-sm">Location services are currently disabled. Grant permission to see live blood centers and drives near your area.</p>
             <button className="mt-4 px-6 py-2 border border-outline rounded text-label-caps font-semibold hover:bg-surface-container">Enable Location Services</button>
          </div>
      </div>

      <div className="bg-surface border border-outline-variant rounded-xl overflow-hidden mt-xl">
        <div className="px-md py-md border-b border-outline-variant bg-surface-bright">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Full History Records</h3>
        </div>
        <div className="p-0 overflow-x-auto">
          {isLoading ? (
             <div className="p-xl text-center text-on-surface-variant font-body-sm">Fetching immutable donation history...</div>
          ) : (
            <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low font-label-caps text-label-caps text-on-surface-variant border-b border-outline-variant">
                  <tr>
                    <th className="px-md py-sm font-medium">Date</th>
                    <th className="px-md py-sm font-medium">Location</th>
                    <th className="px-md py-sm font-medium">Type</th>
                    <th className="px-md py-sm font-medium">Status / Reward</th>
                  </tr>
                </thead>
                <tbody className="font-data-mono text-data-mono text-on-surface divide-y divide-outline-variant/50">
                   {history?.map((record, i) => (
                      <tr key={i} className="hover:bg-surface-container-low/50 transition-colors">
                        <td className="px-md py-sm whitespace-nowrap">{record.date}</td>
                        <td className="px-md py-sm whitespace-nowrap text-body-sm font-body-sm">{record.location}</td>
                        <td className="px-md py-sm whitespace-nowrap text-body-sm font-body-sm">{record.type}</td>
                        <td className="px-md py-sm whitespace-nowrap">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary-container/30 text-secondary border border-secondary/20 text-[10px] font-label-caps uppercase tracking-widermr-2">
                            {record.status}
                          </span>
                        </td>
                      </tr>
                   ))}
                </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}
