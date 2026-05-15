import { api } from "./client";

export const transferApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/transfers", { params }),
  getById: (id: string) =>
    api.get(`/transfers/${id}`),
  getShipment: (id: string) =>
    api.get(`/transfers/${id}/shipment`),
  create: (data: Record<string, unknown>) =>
    api.post("/transfers", data),
  approve: (id: string) =>
    api.post(`/transfers/${id}/approve`),
  reject: (id: string, data?: { reason?: string }) =>
    api.post(`/transfers/${id}/reject`, data),
  dispatch: (id: string, data: Record<string, unknown>) =>
    api.post(`/transfers/${id}/dispatch`, data),
  receive: (id: string) =>
    api.post(`/transfers/${id}/receive`),
  cancel: (id: string) =>
    api.post(`/transfers/${id}/cancel`),
  addTracking: (id: string, data: Record<string, unknown>) =>
    api.post(`/transfers/${id}/tracking`, data),
};
