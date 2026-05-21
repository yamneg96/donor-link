import React from 'react';
import { MaterialIcon } from '@/components/shared/MaterialIcon';
import { RiskBadge, type RiskLevel } from './RiskBadge';
import { cn } from '@/lib/utils';

interface ShortageRiskCardProps {
  hospitalName: string;
  bloodType: string;
  riskScore: number;
  riskLevel: RiskLevel;
  daysOfSupply: number;
  projectedDeficit: number;
  recommendation: string;
  className?: string;
}

export const ShortageRiskCard: React.FC<ShortageRiskCardProps> = ({
  hospitalName,
  bloodType,
  riskScore,
  riskLevel,
  daysOfSupply,
  projectedDeficit,
  recommendation,
  className,
}) => {
  return (
    <div
      className={cn(
        'bg-card rounded-xl border border-outline-variant/30 p-5 shadow-sm hover:shadow-md transition-all',
        riskLevel === 'critical' && 'border-l-4 border-l-red-600',
        riskLevel === 'high' && 'border-l-4 border-l-orange-500',
        className
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="font-semibold text-on-surface line-clamp-1">{hospitalName}</h4>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-primary font-bold text-lg">{bloodType}</span>
            <span className="text-on-surface-variant text-xs">• Shortage Risk</span>
          </div>
        </div>
        <RiskBadge level={riskLevel} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-surface-variant/30 p-3 rounded-lg text-center">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Risk Score</p>
          <p className="text-xl font-bold text-on-surface">{(riskScore * 100).toFixed(0)}%</p>
        </div>
        <div className="bg-surface-variant/30 p-3 rounded-lg text-center">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-1">Est. Supply</p>
          <p className={cn(
            'text-xl font-bold',
            daysOfSupply < 1 ? 'text-error' : 'text-on-surface'
          )}>
            {daysOfSupply < 1 ? '< 1 Day' : `${daysOfSupply.toFixed(1)} Days`}
          </p>
        </div>
      </div>

      <div className="flex items-start gap-2 mb-4 text-sm text-on-surface-variant">
        <MaterialIcon icon="lightbulb" size={18} className="text-tertiary shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <span className="font-semibold text-tertiary">ML Inference: </span>
          {recommendation}
        </p>
      </div>

      {projectedDeficit > 0 && (
        <div className="flex items-center justify-between py-2 px-3 bg-error-container/20 rounded border border-error/10">
          <span className="text-xs font-medium text-on-error-container">Projected Deficit (7D)</span>
          <span className="text-sm font-bold text-error">-{projectedDeficit} Units</span>
        </div>
      )}
      
      <button className="w-full mt-4 py-2 bg-primary text-on-primary rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
        <MaterialIcon icon="local_shipping" size={18} />
        Initialize Redistribution
      </button>
    </div>
  );
};
