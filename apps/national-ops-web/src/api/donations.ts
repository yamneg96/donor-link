import { api } from "./client";

export const donationApi = {
  schedule: (data: Record<string, unknown>) =>
    api.post("/donations/schedule", data),
  cancel: (id: string) =>
    api.patch(`/donations/${id}/cancel`),
  getHospitalDonations: (params?: Record<string, unknown>) =>
    api.get("/donations/hospital", { params }),
};
