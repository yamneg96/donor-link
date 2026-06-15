import { apiClient } from './client';
import { ApiResponse, EligibilityCheck } from '../types';

export const eligibilityApi = {
  getCheck: async () => {
    const response = await apiClient.get<ApiResponse<EligibilityCheck>>('/eligibility/check');
    return response.data;
  },
  
  getHistory: async (donorId: string) => {
    const response = await apiClient.get<ApiResponse<any[]>>(`/eligibility/history/${donorId}`);
    return response.data;
  },
};
