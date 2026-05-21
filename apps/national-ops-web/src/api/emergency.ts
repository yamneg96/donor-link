import { api } from "./client";

export const emergencyApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/emergency", { params }),
  getById: (id: string) =>
    api.get(`/emergency/${id}`),
  declare: (data: Record<string, unknown>) =>
    api.post("/emergency/declare", data),
  update: (id: string, data: Record<string, unknown>) =>
    api.put(`/emergency/${id}`, data),
  resolve: (id: string) =>
    api.post(`/emergency/${id}/resolve`),
};
