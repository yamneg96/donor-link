import { api } from "./client";

export const campaignApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/campaigns", { params }),
  getById: (id: string) =>
    api.get(`/campaigns/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/campaigns", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/campaigns/${id}`, data),
  delete: (id: string) =>
    api.delete(`/campaigns/${id}`),
  updateProgress: (id: string, data: Record<string, unknown>) =>
    api.patch(`/campaigns/${id}/progress`, data),
};
