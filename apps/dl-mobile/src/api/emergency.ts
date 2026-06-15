import { apiClient } from './client';
import { ApiResponse, EmergencyRequest } from '../types';

export const emergencyApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<EmergencyRequest[]>>('/emergency');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<EmergencyRequest>>(`/emergency/${id}`);
    return response.data;
  },
};
