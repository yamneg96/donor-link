import { api } from "./client";

export const forecastingApi = {
  getAll: (params?: Record<string, unknown>) =>
    api.get("/forecasting", { params }),
  getById: (id: string) =>
    api.get(`/forecasting/${id}`),
  generate: (data: Record<string, unknown>) =>
    api.post("/forecasting/generate", data),
};
