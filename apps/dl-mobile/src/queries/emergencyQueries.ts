import { useQuery } from '@tanstack/react-query';
import { emergencyApi } from '../api/emergency';

export const useEmergencies = () => {
  return useQuery({
    queryKey: ['emergencies'],
    queryFn: () => emergencyApi.getAll(),
  });
};

export const useEmergency = (id: string) => {
  return useQuery({
    queryKey: ['emergencies', id],
    queryFn: () => emergencyApi.getById(id),
    enabled: !!id,
  });
};
