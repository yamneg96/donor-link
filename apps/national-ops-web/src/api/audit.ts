import { api } from "./client";

export const auditApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/audit", { params }),
  getById: (id: string) =>
    api.get(`/audit/${id}`),
};
