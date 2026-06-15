import { useHospitalInventory } from '../../hooks/useApi';
import { LoadingSkeleton } from '../../components/shared/EmptyState';
import { MaterialIcon } from '../../components/shared/MaterialIcon';
import { cn } from '../../lib/utils';

export default function InventoryPage() {
  const { data: inventory, isLoading } = useHospitalInventory();
  const items = inventory?.items || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-display-lg text-m3-on-surface">Unit Ledger</h2>
           <p className="text-body-main text-m3-on-surface-variant mt-2">Complete registry of all blood components available at this facility.</p>
        </div>
        <button className="bg-m3-primary text-m3-on-primary py-2.5 px-6 rounded-lg font-bold hover:opacity-90 flex items-center gap-2">
          <MaterialIcon icon="add" size={20} /> Register New Units
        </button>
      </div>

      <div className="bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl overflow-hidden shadow-ambient-md">
        <div className="px-6 py-4 border-b border-m3-outline-variant flex justify-between items-center bg-m3-surface-container-low/30">
           <div className="text-title-medium font-bold text-m3-on-surface">Live Component Stock</div>
           <div className="flex items-center gap-4">
              <div className="relative">
                <MaterialIcon icon="search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-m3-on-surface-variant" />
                <input type="text" placeholder="Search Barcode..." className="pl-10 pr-4 py-2 bg-m3-surface-container rounded-lg border border-m3-outline outline-none text-sm w-64 focus:border-m3-primary" />
              </div>
              <button className="text-m3-primary hover:bg-m3-surface-container p-2 rounded-full"><span className="material-symbols-outlined">filter_list</span></button>
           </div>
        </div>
        
        <table className="w-full text-left border-collapse">
            <thead className="bg-m3-surface-container-low text-m3-on-surface-variant text-label-caps border-b border-m3-outline-variant">
                <tr>
                    <th className="px-6 py-4">Barcode</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Component</th>
                    <th className="px-6 py-4">Expiry Date</th>
                    <th className="px-6 py-4 text-center">Status</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-m3-outline-variant text-data-mono">
                {isLoading ? (
                    <tr><td colSpan={5} className="py-12"><LoadingSkeleton rows={5} /></td></tr>
                ) : items.length > 0 ? (
                    items.map((item: any) => {
                        const isExpiring = new Date(item.expiryDate).getTime() < Date.now() + (7 * 24 * 60 * 60 * 1000);
                        return (
                            <tr key={item._id} className="hover:bg-m3-surface-container-low transition-colors">
                                <td className="px-6 py-4 font-mono font-bold text-m3-on-surface">{item.barcode}</td>
                                <td className="px-6 py-4">
                                    <span className="bg-m3-primary-fixed text-m3-on-surface px-2 py-0.5 rounded font-bold text-xs">{item.bloodType}</span>
                                </td>
                                <td className="px-6 py-4 text-m3-on-surface">{item.componentType}</td>
                                <td className={cn("px-6 py-4", isExpiring ? "text-m3-error font-bold" : "text-m3-on-surface-variant")}>
                                    {new Date(item.expiryDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <span className={cn(
                                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase",
                                        item.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-m3-surface-variant text-m3-on-surface-variant'
                                    )}>
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        )
                    })
                ) : (
                    <tr>
                      <td colSpan={5} className="py-20 text-center text-m3-on-surface-variant/50">
                        <MaterialIcon icon="inventory" size={48} className="mx-auto mb-2 opacity-20" />
                        <p>No units found in this facility's inventory.</p>
                      </td>
                    </tr>
                )}
            </tbody>
        </table>
      </div>
    </div>
  );
}
