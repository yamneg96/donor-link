import { apiClient } from './client';
import { ApiResponse, BloodRequest, PaginatedResponse } from '../types';

export const requestApi = {
  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<BloodRequest>>>('/requests', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<BloodRequest>>(`/requests/${id}`);
    return response.data;
  },
};
