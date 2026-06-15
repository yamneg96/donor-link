import { useQuery } from '@tanstack/react-query';
import { centerApi } from '../api/centers';

export const useCenters = (params?: any) => {
  return useQuery({
    queryKey: ['centers', params],
    queryFn: () => centerApi.getAll(params),
  });
};

export const useCenter = (id: string) => {
  return useQuery({
    queryKey: ['centers', id],
    queryFn: () => centerApi.getById(id),
    enabled: !!id,
  });
};
