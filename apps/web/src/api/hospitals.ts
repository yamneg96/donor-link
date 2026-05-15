import { api } from "./client";

export const hospitalApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/hospitals", { params }),
  getById: (id: string) =>
    api.get(`/hospitals/${id}`),
  create: (data: Record<string, unknown>) =>
    api.post("/hospitals", data),
  getMyHospital: () =>
    api.get("/hospitals/my/hospital"),
  updateMyHospital: (data: Record<string, unknown>) =>
    api.patch("/hospitals/my/hospital", data),
  updateInventory: (inventory: unknown[]) =>
    api.put("/hospitals/my/hospital/inventory", { inventory }),
  nearby: (params: { lng: number; lat: number; radiusKm?: number }) =>
    api.get("/hospitals/nearby", { params }),
};
