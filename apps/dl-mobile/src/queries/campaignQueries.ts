import { useQuery } from '@tanstack/react-query';
import { campaignApi } from '../api/campaigns';

export const useCampaigns = (params?: any) => {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: () => campaignApi.getAll(params),
  });
};

export const useCampaignById = (id: string) => {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: () => campaignApi.getById(id),
    enabled: !!id,
  });
};
