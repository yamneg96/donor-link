import { useQuery } from '@tanstack/react-query';
import { eligibilityApi } from '../api/eligibility';

export const useEligibilityCheck = () => {
  return useQuery({
    queryKey: ['eligibility', 'check'],
    queryFn: () => eligibilityApi.getCheck(),
  });
};

export const useEligibilityHistory = (donorId: string) => {
  return useQuery({
    queryKey: ['eligibility', 'history', donorId],
    queryFn: () => eligibilityApi.getHistory(donorId),
    enabled: !!donorId,
  });
};
