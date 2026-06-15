import { apiClient } from './client';
import { ApiResponse, Notification } from '../types';

export const notificationApi = {
  getMyNotifications: async () => {
    const response = await apiClient.get<ApiResponse<Notification[]>>('/notifications');
    return response.data;
  },
  
  getUnreadCount: async () => {
    const response = await apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count');
    return response.data;
  },
  
  markAsRead: async (id: string) => {
    const response = await apiClient.post<ApiResponse<any>>(`/notifications/${id}/read`);
    return response.data;
  },
  
  markAllRead: async () => {
    const response = await apiClient.post<ApiResponse<any>>('/notifications/mark-all-read');
    return response.data;
  },
};
