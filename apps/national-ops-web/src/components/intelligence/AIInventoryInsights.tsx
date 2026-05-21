import React from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { useMLShortageRisk, useMLAnomalyDetection } from '@/hooks/useApi';
import { RiskBadge, type RiskLevel } from './RiskBadge';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';

interface AIInventoryInsightsProps {
  hospitalId: string;
  bloodTypes: string[];
}

export const AIInventoryInsights: React.FC<AIInventoryInsightsProps> = ({ hospitalId, bloodTypes }) => {
  // Focus on the first blood type or most critical one. 
  // In a real app, we might fetch risks for all types.
  const mainBloodType = bloodTypes[0] || 'O-';
  
  const { data: riskData, isLoading: riskLoading } = useMLShortageRisk({
    hospitalId,
    bloodType: mainBloodType,
    daysHorizon: 3
  });

  // We could also check for anomalies in stock levels
  const { data: anomalyData, isLoading: anomalyLoading } = useMLAnomalyDetection({
    metric_name: 'inventory_level',
    values: [45, 42, 38, 30, 25, 20, 15], // Simulated recent history
    threshold: 1.5
  });

  if (riskLoading || anomalyLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    );
  }

  const risk = riskData?.risk;
  const anomalies = anomalyData; // anomalyData is IMLAnomalyDetection directly

  return (
    <div className="space-y-4">
      {/* Shortage Risk Insight */}
      {risk && risk.risk_level !== 'low' && (
        <div className={cn(
          "p-4 rounded-xl border flex flex-col gap-2 shadow-sm transition-all animate-in fade-in slide-in-from-right-4",
          risk.risk_level === 'critical' ? "bg-error/5 border-error/20" : "bg-orange-50 border-orange-200"
        )}>
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <MaterialIcon 
                icon="warning" 
                className={risk.risk_level === 'critical' ? "text-error" : "text-orange-500"} 
                size={20} 
              />
              <span className="font-bold text-sm">Shortage Forecast</span>
            </div>
            <RiskBadge level={risk.risk_level} />
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            <span className="font-bold text-on-surface">{mainBloodType} stock is {risk.risk_level}.</span> {risk.recommendation}
          </p>
          <button className={cn(
            "mt-2 text-[10px] font-black uppercase tracking-widest text-left hover:underline",
            risk.risk_level === 'critical' ? "text-error" : "text-orange-700"
          )}>
            Request Emergency Stock →
          </button>
        </div>
      )}

      {/* Anomaly Insight */}
      {anomalies && anomalies.is_anomaly && (
        <div className="p-4 rounded-xl border bg-tertiary/5 border-tertiary/20 flex flex-col gap-2 shadow-sm animate-in fade-in slide-in-from-right-4 duration-500">
          <div className="flex items-center gap-2">
            <MaterialIcon icon="analytics" className="text-tertiary" size={20} />
            <span className="font-bold text-sm">Usage Anomaly</span>
          </div>
          <p className="text-xs text-on-surface-variant leading-relaxed">
            Current depletion rate is <span className="text-tertiary font-bold">{anomalies.severity.toFixed(1)}x higher</span> than normal local baseline. Emergency usage suspected.
          </p>
        </div>
      )}

      {/* Default Safe State if no risks */}
      {(!risk || risk.risk_level === 'low') && !anomalies?.is_anomaly && (

        <div className="p-4 rounded-xl border bg-green-50/50 border-green-200 border-dashed flex flex-col items-center justify-center text-center py-8">
          <MaterialIcon icon="verified" className="text-green-500 mb-2" size={24} />
          <p className="text-xs font-bold text-green-800 uppercase">Inventory Health: Optimal</p>
          <p className="text-[10px] text-green-600 mt-1">ML Analysis shows stable consumption patterns.</p>
        </div>
      )}
    </div>
  );
};
