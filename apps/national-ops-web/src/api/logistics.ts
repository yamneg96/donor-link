import { api } from "./client";

export const logisticsApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/logistics", { params }),
  getById: (id: string) =>
    api.get(`/logistics/${id}`),
  updateStatus: (id: string, data: Record<string, unknown>) =>
    api.patch(`/logistics/${id}/status`, data),
};
