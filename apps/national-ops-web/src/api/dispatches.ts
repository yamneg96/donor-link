import { api } from "./client";

export const dispatchApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/dispatches", { params }),
  getById: (id: string) =>
    api.get(`/dispatches/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/dispatches", data),
  receive: (id: string) =>
    api.patch(`/dispatches/${id}/receive`),
};
