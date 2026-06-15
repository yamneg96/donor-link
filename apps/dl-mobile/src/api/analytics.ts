import { apiClient } from './client';
import { ApiResponse } from '../types';

export const analyticsApi = {
  getDonorStats: async () => {
    const response = await apiClient.get<ApiResponse<any>>('/analytics/donors');
    return response.data;
  },
};
