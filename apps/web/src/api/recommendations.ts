import { api } from "./client";

export const recommendationApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/recommendations", { params }),
  getById: (id: string) =>
    api.get(`/recommendations/${id}`),
  accept: (id: string) =>
    api.post(`/recommendations/${id}/accept`),
  reject: (id: string) =>
    api.post(`/recommendations/${id}/reject`),
  implement: (id: string) =>
    api.post(`/recommendations/${id}/implement`),
};
