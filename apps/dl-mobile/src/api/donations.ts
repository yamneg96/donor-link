import { apiClient } from './client';
import { ApiResponse } from '../types';

export const donationApi = {
  getAll: async () => {
    const response = await apiClient.get<ApiResponse<any[]>>('/donations');
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/donations/${id}`);
    return response.data;
  },
};
