import { apiClient } from "./client";

export const authApi = {
  login: (data: { email: string; password: string }) =>
    apiClient.post("/auth/login", data),
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone?: string;
    role?: string;
    organizationId?: string;
  }) => apiClient.post("/auth/register", data),
  refresh: (refreshToken: string) =>
    apiClient.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken: string) =>
    apiClient.post("/auth/logout", { refreshToken }),
  forgotPassword: (email: string) =>
    apiClient.post("/auth/forgot-password", { email }),
  resetPassword: (data: { token: string; password: string }) =>
    apiClient.post("/auth/reset-password", data),
  verifyOtp: (data: { email: string; otp: string }) =>
    apiClient.post("/auth/verify-otp", data),
  sendOtp: (email: string) =>
    apiClient.post("/auth/send-otp", { email }),
  me: () => apiClient.get("/auth/me"),
  onboard: (data: any) => apiClient.post("/auth/onboard", data),
};
