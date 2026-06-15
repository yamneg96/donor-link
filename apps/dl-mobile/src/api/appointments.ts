import { apiClient } from './client';
import { ApiResponse, PaginatedResponse } from '../types';

export const appointmentApi = {
  getMyAppointments: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/appointments/my');
    return response.data;
  },
  
  schedule: async (data: any) => {
    const response = await apiClient.post<ApiResponse<any>>('/appointments', data);
    return response.data;
  },
  
  getAvailableSlots: async (hospitalId: string, date: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/appointments/hospital/${hospitalId}/slots`, {
      params: { date },
    });
    return response.data;
  },
};
