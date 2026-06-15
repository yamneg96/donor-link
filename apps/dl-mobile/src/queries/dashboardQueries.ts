import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard';

export const usePublicStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'public-stats'],
    queryFn: () => dashboardApi.getPublicStats(),
  });
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ['dashboard', 'donor'],
    queryFn: () => dashboardApi.getDonorDashboard(),
  });
};
