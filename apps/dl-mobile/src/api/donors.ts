import { apiClient } from './client';
import { ApiResponse, Donor, EligibilityCheck } from '../types';

export const donorApi = {
  getProfile: async () => {
    const response = await apiClient.get<ApiResponse<Donor>>('/donors/me');
    return response.data;
  },
  
  updateProfile: async (data: Partial<Donor>) => {
    const response = await apiClient.put<ApiResponse<Donor>>('/donors/me', data);
    return response.data;
  },
  
  checkEligibility: async () => {
    const response = await apiClient.get<ApiResponse<EligibilityCheck>>('/donors/me/eligibility');
    return response.data;
  },
};
