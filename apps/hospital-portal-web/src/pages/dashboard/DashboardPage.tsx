import { useHospitalDashboard, useUrgentRequests } from '../../hooks/useApi';
import { LoadingSkeleton } from '../../components/shared/EmptyState';
import { MaterialIcon } from '../../components/shared/MaterialIcon';
import { useState } from 'react';
import { RecordTransfusionModal } from '../../components/modals/RecordTransfusionModal';

export default function DashboardPage() {
  const { data: dashboard, isLoading: statsLoading } = useHospitalDashboard();
  const { data: requests } = useUrgentRequests();
  const [isTransfusionModalOpen, setIsTransfusionModalOpen] = useState(false);

  if (statsLoading) return <div className="p-6"><LoadingSkeleton rows={10} /></div>;

  const capacityPercent = dashboard?.inventoryStats?.capacity 
    ? Math.round((dashboard.inventoryStats.totalUnits / dashboard.inventoryStats.capacity) * 100) 
    : 0;

  const strokeOffset = 251.2 - (251.2 * capacityPercent) / 100;
  const bloodTypes = ['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'];
  const inventoryByType = dashboard?.inventoryStats?.byBloodType?.reduce((acc: any, curr: any) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {}) || {};

  return (
    <>
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-display-lg text-m3-on-surface">Facility Command Center</h2>
          <p className="text-body-main text-m3-on-surface-variant mt-2">
            Operational oversight for <span className="font-bold">{dashboard?.hospital?.name}</span>.
          </p>
        </div>

        <div className="flex gap-2">
          <button 
            onClick={() => setIsTransfusionModalOpen(true)}
            className="bg-m3-primary text-m3-on-primary py-2.5 px-5 rounded flex items-center gap-2 hover:opacity-90 font-medium"
          >
            <MaterialIcon icon="vaccines" size={20} /> Record Transfusion
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Urgent Requests */}
        <div className="col-span-1 md:col-span-8 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <MaterialIcon icon="warning" className="text-m3-error" />
            <h3 className="text-headline-sm text-m3-on-surface">Urgent Requests</h3>
            <span className="px-3 py-1 bg-m3-error text-m3-on-error rounded-full text-label-caps ml-auto">
              {requests?.length || 0} Active
            </span>
          </div>

          <div className="space-y-3">
            {requests && requests?.length > 0 ? (
              requests?.map((req: any) => (
                <div key={req._id} className="flex justify-between items-center p-4 bg-m3-surface-container-low rounded-lg border border-m3-outline-variant">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-m3-error-container text-m3-on-error-container flex items-center justify-center font-bold text-lg">
                      {req.bloodType}
                    </div>
                    <div>
                      <p className="text-body-main font-bold text-m3-on-surface">{req.notes || "Emergency Request"}</p>
                      <p className="text-label-small text-m3-error font-bold uppercase tracking-wider">Needed ASAP • {req.units} Units</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-m3-primary text-m3-on-primary rounded text-label-caps font-bold hover:opacity-90">
                    Process
                  </button>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-m3-on-surface-variant/50 flex flex-col items-center gap-3">
                <MaterialIcon icon="check_circle" size={48} className="text-green-200" />
                <p>No critical shortages detected.</p>
              </div>
            )}
          </div>
        </div>

        {/* Facility Capacity */}
        <div className="col-span-1 md:col-span-4 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md flex flex-col items-center justify-center text-center">
          <h3 className="text-headline-sm text-m3-on-surface w-full text-left mb-6">Physical Capacity</h3>
          <div className="relative w-40 h-40 mb-4">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" stroke="var(--m3-surface-variant)" strokeWidth="10" fill="none" />
              <circle cx="50" cy="50" r="40" stroke="var(--m3-primary)" strokeWidth="10" fill="none" strokeDasharray="251.2" strokeDashoffset={strokeOffset} strokeLinecap="round" className="transition-all duration-1000" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-display-md text-m3-primary font-bold">{capacityPercent}%</span>
              <span className="text-label-small text-m3-on-surface-variant uppercase">Utilization</span>
            </div>
          </div>
          <p className="text-body-main text-m3-on-surface font-medium">
            {dashboard?.inventoryStats?.totalUnits} / {dashboard?.inventoryStats?.capacity} Units Stocked
          </p>
        </div>

        {/* Inventory Grid */}
        <div className="col-span-1 md:col-span-12 bg-m3-surface-container-lowest border border-m3-outline-variant rounded-xl p-6 shadow-ambient-md">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-headline-sm text-m3-on-surface">Unit Inventory</h3>
            <button className="text-m3-primary text-label-caps font-bold hover:underline flex items-center gap-1">
              Full Ledger <MaterialIcon icon="arrow_forward" size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {bloodTypes.map((type) => {
              const count = inventoryByType[type] || 0;
              const isLow = count < 5;
              return (
                <div key={type} className={`rounded-xl p-4 flex flex-col items-center border-b-4 transition-all ${isLow ? 'bg-red-50 border-m3-error' : 'bg-m3-surface-container-low border-m3-outline-variant hover:shadow-sm'}`}>
                  <span className="text-title-medium text-m3-on-surface mb-1 font-bold">{type}</span>
                  <span className={`text-display-sm font-bold ${isLow ? 'text-m3-error' : 'text-m3-primary'}`}>{count}</span>
                  <span className={`text-label-small uppercase font-bold mt-1 ${isLow ? 'text-m3-error' : 'text-m3-on-surface-variant'}`}>{isLow ? 'Low' : 'Units'}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <RecordTransfusionModal open={isTransfusionModalOpen} onClose={() => setIsTransfusionModalOpen(false)} />
    </>
  );
}