import React from 'react';
import { MaterialIcon } from '../shared/MaterialIcon';
import { useCreateTransfer } from '@/hooks/useApi';
import { toast } from 'sonner';

interface RedistributionExecutionModalProps {
  open: boolean;
  onClose: () => void;
  recommendation: {
    hospital_id: string;
    hospital_name: string;
    recommended_units: number;
    rationale: string;
  };
  targetHospital: {
    id: string;
    name: string;
    bloodType: string;
  };
}

export function RedistributionExecutionModal({ open, onClose, recommendation, targetHospital }: RedistributionExecutionModalProps) {
  const createDispatch = useCreateTransfer();

  if (!open) return null;

  const handleExecute = async () => {
    try {
      await createDispatch.mutateAsync({
        fromHospitalId: recommendation.hospital_id,
        toHospitalId: targetHospital.id,
        bloodType: targetHospital.bloodType,
        unitsCount: recommendation.recommended_units,
        urgency: 'HIGH',
        notes: `AI-Powered Strategic Redistribution: ${recommendation.rationale}`
      });
      toast.success('Redistribution dispatch initiated successfully');
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to initiate redistribution');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-m3-surface-container-lowest w-full max-w-lg rounded-3xl shadow-ambient-lg border border-m3-outline-variant overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 border-b border-m3-outline-variant flex justify-between items-center bg-m3-primary/5">
          <h3 className="text-display-sm text-m3-on-surface flex items-center gap-3 font-bold">
            <MaterialIcon icon="auto_mode" className="text-m3-primary" size={28} /> Execute Redistribution
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-m3-surface-variant rounded-full transition-colors">
            <MaterialIcon icon="close" />
          </button>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6 p-4 bg-m3-surface-container rounded-2xl border border-m3-outline-variant/30">
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-m3-on-surface-variant uppercase mb-1">Source</p>
              <p className="font-bold text-m3-on-surface truncate">{recommendation.hospital_name}</p>
            </div>
            <div className="flex flex-col items-center">
               <MaterialIcon icon="arrow_forward" className="text-m3-primary animate-pulse" />
               <span className="text-[10px] font-bold text-m3-primary uppercase">{recommendation.recommended_units} Units</span>
            </div>
            <div className="flex-1 text-center">
              <p className="text-xs font-bold text-m3-on-surface-variant uppercase mb-1">Destination</p>
              <p className="font-bold text-m3-on-surface truncate">{targetHospital.name}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-m3-on-surface-variant uppercase tracking-widest pl-1">AI Rationale</label>
            <div className="bg-m3-surface-container-low p-4 rounded-xl border-l-4 border-m3-primary">
              <p className="text-body-medium text-m3-on-surface-variant italic">
                "{recommendation.rationale}"
              </p>
            </div>
          </div>

          <div className="bg-m3-error-container/20 p-4 rounded-xl flex gap-3">
             <MaterialIcon icon="info" className="text-m3-error" />
             <p className="text-xs text-m3-on-error-container leading-relaxed">
               Approving this will automatically notify both hospitals and create a high-priority dispatch order in the regional logistics queue.
             </p>
          </div>

          <div className="flex gap-4 pt-4">
            <button 
              onClick={onClose} 
              className="flex-1 py-3 text-m3-on-surface font-bold rounded-xl hover:bg-m3-surface-container transition-all"
            >
              Discard Advice
            </button>
            <button 
              onClick={handleExecute}
              disabled={createDispatch.isPending}
              className="flex-1 py-3 bg-m3-primary text-m3-on-primary font-bold rounded-xl shadow-lg hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {createDispatch.isPending ? 'Initiating...' : 'Approve & Execute'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
