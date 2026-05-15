import { api } from "./client";

export const dashboardApi = {
  national: () =>
    api.get("/dashboard/national"),
  hospital: (orgId?: string) =>
    orgId
      ? api.get(`/dashboard/hospital/${orgId}`)
      : api.get("/dashboard/hospital"),
};
