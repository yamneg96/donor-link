import { api } from "./client";

export const donorApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/donors", { params }),
  getById: (id: string) =>
    api.get(`/donors/${id}`),
  getProfile: () =>
    api.get("/donors/me"),
  updateProfile: (data: Record<string, unknown>) =>
    api.patch("/donors/me", data),
  checkEligibility: (data: Record<string, unknown>) =>
    api.post("/donors/me/eligibility", data),
  getMyDonations: (params?: Record<string, unknown>) =>
    api.get("/donors/me/donations", { params }),
  getMyAlerts: () =>
    api.get("/donors/me/alerts"),
};
