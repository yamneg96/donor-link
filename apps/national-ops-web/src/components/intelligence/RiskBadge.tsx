import React from 'react';
import { cn } from '@/lib/utils';

export type RiskLevel = 'critical' | 'high' | 'medium' | 'low';

interface RiskBadgeProps {
  level: RiskLevel;
  className?: string;
}

const RISK_CONFIG = {
  critical: {
    label: 'Critical',
    bg: 'bg-red-100 dark:bg-red-950/30',
    text: 'text-red-700 dark:text-red-400',
    dot: 'bg-red-500',
  },
  high: {
    label: 'High Risk',
    bg: 'bg-orange-100 dark:bg-orange-950/30',
    text: 'text-orange-700 dark:text-orange-400',
    dot: 'bg-orange-500',
  },
  medium: {
    label: 'Moderate',
    bg: 'bg-yellow-100 dark:bg-yellow-950/30',
    text: 'text-yellow-700 dark:text-yellow-400',
    dot: 'bg-yellow-500',
  },
  low: {
    label: 'Internal Only (Safe)',
    bg: 'bg-green-100 dark:bg-green-950/30',
    text: 'text-green-700 dark:text-green-400',
    dot: 'bg-green-500',
  },
};

export const RiskBadge: React.FC<RiskBadgeProps> = ({ level, className }) => {
  const config = RISK_CONFIG[level] || RISK_CONFIG.low;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider',
        config.bg,
        config.text,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full animate-pulse', config.dot)} />
      {config.label}
    </div>
  );
};
