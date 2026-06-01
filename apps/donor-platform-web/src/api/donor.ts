import { apiClient } from './client';

export interface DonorStats {
  nextEligibleDate: string;
  totalLivesSaved: number;
  gallonsDonated: number;
  totalDonations: number;
  currentStreak: number;
  bloodType: string;
}

export interface DonationHistory {
  date: string;
  location: string;
  type: string;
  status: string;
}

export const donorApi = {
  getStats: async (): Promise<DonorStats> => {
    // Assuming backend endpoint exists
    const { data } = await apiClient.get('/engagement/me/stats');
    return data;
  },
  getHistory: async (): Promise<DonationHistory[]> => {
    const { data } = await apiClient.get('/appointments/me/history');
    return data;
  }
};
