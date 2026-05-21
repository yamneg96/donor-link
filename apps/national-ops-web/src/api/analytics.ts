import { api } from "./client";

export const analyticsApi = {
  national: () =>
    api.get("/analytics/national"),
  hospital: (orgId: string) =>
    api.get(`/analytics/hospital/${orgId}`),
  transfers: () =>
    api.get("/analytics/transfers"),
  wastage: () =>
    api.get("/analytics/wastage"),
  donors: () =>
    api.get("/analytics/donors"),
};
