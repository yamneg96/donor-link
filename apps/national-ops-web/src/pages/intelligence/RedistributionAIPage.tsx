import React, { useState } from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { SmartShortageRiskCard } from '@/components/intelligence/SmartShortageRiskCard';
import { useHospitals } from '@/hooks/useApi';
import { LoadingSkeleton } from '@/components/shared/EmptyState';
import { toast } from 'sonner';
import type { IHospital } from '@/types';


export default function RedistributionAIPage() {
  const [selectedBloodType, setSelectedBloodType] = useState<string>('O-');
  const { data: hospitals, isLoading: isLoadingHospitals } = useHospitals();

  const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  // Current logic: Iterate through all hospitals for the selected blood type.
  // The SmartShortageRiskCard will only render if a 'medium' or higher risk is detected.

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-display-lg text-on-surface tracking-tight">AI Redistribution Engine</h2>
          <p className="text-on-surface-variant mt-2">
            Real-time shortage risk detection and optimized peer-to-peer redistribution logic based on real network data.
          </p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary/5 border border-secondary/10 rounded-lg">
          <MaterialIcon icon="hub" className="text-secondary" />
          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Network Optimization Active</span>
        </div>
      </div>

      {/* FILTERS */}
      <div className="bg-surface p-4 rounded-xl border border-outline-variant/30 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-on-surface-variant uppercase">Focus Blood Type:</span>
          <div className="flex gap-1.5">
            {bloodTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedBloodType(type)}
                className={`px-2.5 py-1.5 rounded transition-all text-xs font-bold ${
                  selectedBloodType === type 
                    ? 'bg-secondary text-on-secondary shadow-sm' 
                    : 'bg-surface-variant/40 text-on-surface-variant hover:bg-surface-variant/60'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
        <div className="h-8 w-px bg-outline-variant/30 mx-2 hidden md:block" />
        <div className="flex items-center gap-2 text-xs font-bold text-on-surface-variant">
          <MaterialIcon icon="visibility" size={16} className="text-tertiary" />
          <span>Showing Medium, High, & Critical Risks</span>
        </div>
      </div>

      {isLoadingHospitals ? (
        <LoadingSkeleton rows={10} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals?.map((hospital: IHospital) => (
            <SmartShortageRiskCard 
              key={`${hospital._id}-${selectedBloodType}`}
              hospitalId={hospital._id}
              hospitalName={hospital.name}
              bloodType={selectedBloodType}
            />
          ))}


          {/* Fallback if no risks are found after loading all cards */}
          <div className="col-span-full hidden only:flex flex-col items-center justify-center py-20 bg-green-50/50 border border-dashed border-green-200 rounded-3xl">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <MaterialIcon icon="verified" size={32} className="text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-green-800">Network Inventory Stable</h3>
            <p className="text-green-600 text-sm mt-1">No medium or high shortage risks detected for {selectedBloodType} across the national network.</p>
          </div>
        </div>
      )}

      {/* NETWORK CONTEXT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4">
        <div className="lg:col-span-8 bg-card border border-outline-variant/30 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-on-surface">Regional Redistribution Graph</h3>
            <button className="text-xs font-bold text-primary uppercase hover:underline">View Global Map</button>
          </div>
          
          <div className="aspect-video bg-surface-container-low rounded-xl border border-outline-variant/20 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-10 pointer-events-none">
              <div className="w-full h-full bg-[radial-gradient(#af101a_1px,transparent_1px)] bg-size-[20px_20px]" />
            </div>
            <MaterialIcon icon="hub" size={48} className="text-tertiary/20 mb-4" />
            <p className="text-on-surface-variant text-sm font-medium">Relational Intelligence Map Loading...</p>
          </div>
        </div>

        <div className="lg:col-span-4 bg-tertiary/5 border border-tertiary/10 rounded-2xl p-6">
          <h3 className="font-bold text-on-surface mb-4">ML Decision Context</h3>
          <div className="space-y-4">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-sm shrink-0">
                <MaterialIcon icon="route" size={18} className="text-secondary" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface uppercase">Logistics Weight</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">Prioritizing centers within 15km to minimize transportation time for critical Ethiopian lifeblood units.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded bg-white flex items-center justify-center shadow-sm shrink-0">
                <MaterialIcon icon="hourglass_top" size={18} className="text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-on-surface uppercase">Expiry Minimization</p>
                <p className="text-[11px] text-on-surface-variant leading-relaxed">System is automatically flagging units with &lt; 5 days shelf-life as primary candidates for redistribution to avoid waste.</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button 
              onClick={() => toast.success('Running global optimization engine...')}
              className="w-full py-3 bg-on-surface text-surface rounded-xl font-bold text-sm tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
            >
              <MaterialIcon icon="refresh" size={20} />
              Recalculate Global Network
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
