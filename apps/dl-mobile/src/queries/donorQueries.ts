import { useQuery } from '@tanstack/react-query';
import { donorApi } from '../api/donors';

export const useDonorProfile = () => {
  return useQuery({
    queryKey: ['donor', 'profile'],
    queryFn: () => donorApi.getProfile(),
  });
};

export const useEligibility = () => {
  return useQuery({
    queryKey: ['donor', 'eligibility'],
    queryFn: () => donorApi.checkEligibility(),
  });
};
