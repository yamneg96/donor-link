import { api } from "./client";

export const alertApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/alerts", { params }),
  getById: (id: string) =>
    api.get(`/alerts/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/alerts", data),
  acknowledge: (id: string) =>
    api.post(`/alerts/${id}/acknowledge`),
  resolve: (id: string) =>
    api.post(`/alerts/${id}/resolve`),
};
