import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentApi } from '../api/appointments';

export const useMyAppointments = () => {
  return useQuery({
    queryKey: ['appointments', 'my'],
    queryFn: () => appointmentApi.getMyAppointments(),
  });
};

export const useAvailableSlots = (hospitalId: string, date: string) => {
  return useQuery({
    queryKey: ['appointments', 'slots', hospitalId, date],
    queryFn: () => appointmentApi.getAvailableSlots(hospitalId, date),
    enabled: !!hospitalId && !!date,
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => appointmentApi.schedule(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['appointments'] });
    },
  });
};
