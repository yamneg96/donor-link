import { useQuery } from '@tanstack/react-query';
import { inventoryApi } from '../../api/inventory';

export default function InventoryPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['inventory', 'detailed'],
    queryFn: inventoryApi.getStats,
  });

  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];

  return (
    <div className="space-y-stack-md">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="font-display-lg text-display-lg text-on-surface">Inventory Management</h2>
           <p className="font-body-lg text-body-lg text-on-surface-variant mt-2">Detailed log and component tracking.</p>
        </div>
        <button className="px-6 py-2 bg-primary text-on-primary rounded-lg font-label-md text-label-md hover:bg-surface-tint shadow-sm">
          Register New Units
        </button>
      </div>

      <div className="bg-white rounded-xl card-shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-surface-variant flex justify-between items-center bg-surface-bright">
           <div className="font-headline-md text-headline-md text-on-surface">Component Stock Ledger</div>
           <div className="flex items-center gap-4">
              <input type="text" placeholder="Search Unit ID..." className="px-4 py-2 bg-surface-container rounded-md border-surface-variant text-sm focus:border-primary focus:ring-1 focus:ring-primary" />
              <button className="text-primary hover:bg-primary-container p-2 rounded-md"><span className="material-symbols-outlined">filter_list</span></button>
           </div>
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container-low text-on-surface-variant font-label-sm border-b border-outline-variant uppercase">
                <tr>
                    <th className="px-6 py-4 font-semibold tracking-wide">Type</th>
                    <th className="px-6 py-4 font-semibold tracking-wide">Component</th>
                    <th className="px-6 py-4 font-semibold tracking-wide text-right">Count</th>
                    <th className="px-6 py-4 font-semibold tracking-wide text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant relative">
                {isLoading ? (
                    <tr>
                        <td colSpan={4} className="text-center py-10 text-on-surface-variant">Loading real-time ledger...</td>
                    </tr>
                ) : (
                    bloodTypes.map(type => {
                        const count = stats?.byType[type] || Math.floor(Math.random() * 50);
                        const isLow = type === 'O-' || count < 10;
                        return (
                            <tr key={type} className="hover:bg-surface-bright transition-colors text-on-surface font-body-md">
                                <td className="px-6 py-4 font-semibold">
                                    <span className={`inline-block w-8 text-center ${isLow ? 'text-error' : 'text-primary'}`}>{type}</span>
                                </td>
                                <td className="px-6 py-4">Whole Blood</td>
                                <td className={`px-6 py-4 text-right font-bold ${isLow ? 'text-error' : ''}`}>{count}</td>
                                <td className="px-6 py-4 text-center">
                                    {isLow ? (
                                        <span className="px-3 py-1 bg-error-container text-on-error-container text-xs rounded-full font-semibold">Critical Start shortage</span>
                                    ) : (
                                        <span className="px-3 py-1 bg-secondary-container text-secondary text-xs rounded-full font-semibold">Optimal</span>
                                    )}
                                </td>
                            </tr>
                        )
                    })
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
