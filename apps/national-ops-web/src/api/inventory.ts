import { api } from "./client";

export const inventoryApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/inventory", { params }),
  getStockLevels: (params?: Record<string, unknown>) =>
    api.get("/inventory/stock-levels", { params }),
  getStockByOrg: () =>
    api.get("/inventory/stock-by-org"),
  getExpiring: (params?: { days?: number }) =>
    api.get("/inventory/expiring", { params }),
  getStats: () =>
    api.get("/inventory/stats"),
  getNationalOverview: () =>
    api.get("/inventory/national-overview"),
  getHospitalInventory: (hospitalId: string, params?: Record<string, unknown>) =>
    api.get(`/inventory/hospital/${hospitalId}`, { params }),
  getById: (id: string) =>
    api.get(`/inventory/${id}`),
  getUnitLedger: (id: string) =>
    api.get(`/inventory/${id}/ledger`),
  getByBarcode: (barcode: string) =>
    api.get(`/inventory/barcode/${barcode}`),
  getOrganizationLedger: (orgId: string, params?: Record<string, unknown>) =>
    api.get(`/inventory/ledger/${orgId}`, { params }),
  reserve: (id: string, data?: Record<string, unknown>) =>
    api.post(`/inventory/${id}/reserve`, data),
  release: (id: string) =>
    api.post(`/inventory/${id}/release`),
  markUsed: (id: string, data?: Record<string, unknown>) =>
    api.post(`/inventory/${id}/use`, data),
  markExpired: (id: string) =>
    api.post(`/inventory/${id}/expire`),
  discard: (id: string, data?: { reason: string }) =>
    api.post(`/inventory/${id}/discard`, data),
};
