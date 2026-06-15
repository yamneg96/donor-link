import { apiClient } from './client';
import { ApiResponse } from '../types';

export const centerApi = {
  findNearby: async (params: { latitude: number; longitude: number; radius?: number }) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/geo/nearby', { params });
    return response.data;
  },
  
  getByRegion: async (region: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/geo/region/${region}`);
    return response.data;
  },

  getAll: async (params?: any) => {
    const response = await apiClient.get<ApiResponse<any[]>>('/centers', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await apiClient.get<ApiResponse<any>>(`/geo/center/${id}`);
    return response.data;
  },
};
