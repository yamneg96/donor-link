import { apiClient } from './client';
import { ApiResponse, Campaign, PaginatedResponse } from '../types';

export const campaignApi = {
  getAll: async (params?: any) => {
    // Note: backend routes check for roles, but public/donors should see campaigns
    const response = await apiClient.get<ApiResponse<Campaign[]>>('/campaigns', { params });
    return response.data;
  },
  
  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<Campaign>>(`/campaigns/${id}`);
    return response.data;
  },
};
