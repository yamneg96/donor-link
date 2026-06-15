import React from 'react';
import { ShortageRiskCard } from './ShortageRiskCard';
import { useMLShortageRisk } from '@/hooks/useApi';
import { Skeleton } from '@/components/ui/skeleton';
import { type RiskLevel, RiskBadge } from './RiskBadge';

interface SmartShortageRiskCardProps {
  hospitalId: string;
  hospitalName: string;
  bloodType: string;
  className?: string;
}

export const SmartShortageRiskCard: React.FC<SmartShortageRiskCardProps> = ({
  hospitalId,
  hospitalName,
  bloodType,
  className,
}) => {
  // Fetch real-time shortage risk for this specific hospital and blood type
  const { data: riskData, isLoading, isError } = useMLShortageRisk({
    hospitalId,
    bloodType,
    daysHorizon: 7
  });

  if (isLoading) {
    return (
      <div className="bg-card rounded-xl border border-outline-variant/30 p-5 space-y-4">
        <div className="flex justify-between items-start mb-4">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-5 w-1/4 rounded-full" />
        </div>
        <Skeleton className="h-12 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-10 w-full rounded-lg" />
      </div>
    );
  }

  if (isError || !riskData) {
    return null; // Don't show card if we can't get risk data or if it's safe
  }

  const { risk, display } = riskData;

  // Only show cards that have at least 'medium' risk to focus national ops attention
};
