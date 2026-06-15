import { useQuery } from '@tanstack/react-query';
import { requestApi } from '../api/requests';

export const useRequests = (params?: any) => {
  return useQuery({
    queryKey: ['requests', params],
    queryFn: () => requestApi.getAll(params),
  });
};

export const useRequestById = (id: string) => {
  return useQuery({
    queryKey: ['requests', id],
    queryFn: () => requestApi.getById(id),
    enabled: !!id,
  });
};
