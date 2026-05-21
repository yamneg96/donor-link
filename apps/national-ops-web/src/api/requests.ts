import { api } from "./client";

export const requestApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/requests", { params }),
  getById: (id: string) =>
    api.get(`/requests/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/requests", data),
  cancel: (id: string) =>
    api.patch(`/requests/${id}/cancel`),
  fulfill: (id: string) =>
    api.patch(`/requests/${id}/fulfill`),
};
