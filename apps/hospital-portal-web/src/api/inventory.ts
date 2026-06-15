import { apiClient } from './client';

export interface InventoryStats {
  totalUnits: number;
  capacity: number;
  byType: Record<string, number>;
  lowStockAlerts: { type: string; current: number; threshold: number }[];
}

export interface UrgentRequest {
  id: string;
  bloodType: string;
  unit: string;
  status: string;
  neededBy: string;
}

export const inventoryApi = {
  getStats: async (): Promise<InventoryStats> => {
    const { data } = await apiClient.get('/inventory/stats');
    return data.data;
  },
  getUrgentRequests: async (): Promise<UrgentRequest[]> => {
    const { data } = await apiClient.get('/requests/urgent');
    return data.data;
  },
  getInventory: async (params?: any) => {
    const { data } = await apiClient.get('/inventory', { params });
    return data.data;
  },
  recordTransfusion: async (data: any) => {
    const { data: response } = await apiClient.post('/transfusions', data);
    return response.data;
  },
  receiveDispatch: async (id: string) => {
    const { data: response } = await apiClient.patch(`/transfers/${id}/receive`);
    return response.data;
  }
};
