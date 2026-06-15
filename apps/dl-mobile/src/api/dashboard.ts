import { apiClient } from './client';
import { ApiResponse } from '../types';

export const dashboardApi = {
  getPublicStats: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/stats');
    return response.data;
  },
  getDonorDashboard: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/dashboard/donor');
    return response.data;
  },
};
