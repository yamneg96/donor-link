import { useQuery } from '@tanstack/react-query';
import { donationApi } from '../api/donations';

export const useDonations = () => {
  return useQuery({
    queryKey: ['donations'],
    queryFn: () => donationApi.getAll(),
  });
};

export const useDonationById = (id: string) => {
  return useQuery({
    queryKey: ['donations', id],
    queryFn: () => donationApi.getById(id),
    enabled: !!id,
  });
};
