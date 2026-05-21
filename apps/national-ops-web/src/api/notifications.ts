import { api } from "./client";

export const notificationApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/notifications", { params }),
  getById: (id: string) =>
    api.get(`/notifications/${id}`),
  markRead: (id: string) =>
    api.patch(`/notifications/${id}/read`),
  markAllRead: () =>
    api.patch("/notifications/read-all"),
};
