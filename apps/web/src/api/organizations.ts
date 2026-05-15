import { api } from "./client";

export const organizationApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/organizations", { params }),
  getById: (id: string) =>
    api.get(`/organizations/${id}`),
  getStats: () =>
    api.get("/organizations/stats"),
  getNearby: (params: { lng: number; lat: number; radiusKm?: number }) =>
    api.get("/organizations/nearby", { params }),
  getHierarchy: (id: string) =>
    api.get(`/organizations/${id}/children`),
  create: (data: Record<string, unknown>) =>
    api.post("/organizations", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/organizations/${id}`, data),
  delete: (id: string) =>
    api.delete(`/organizations/${id}`),
};
