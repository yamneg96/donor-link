import axios, { AxiosError } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL ?? "/api/v1";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Request interceptor — attach access token ─────────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ─── Response interceptor — refresh on 401 ────────────────────────────────
let isRefreshing = false;
let refreshQueue: Array<(token: string) => void> = [];

api.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    const original = error.config as any;

    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          refreshQueue.push((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            resolve(api(original));
          });
        });
      }

      isRefreshing = true;
      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, { refreshToken });
        const { accessToken, refreshToken: newRefresh } = data.data;

        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);

        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        refreshQueue.forEach((cb) => cb(accessToken));
        refreshQueue = [];

        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("user");
}

// ─── Typed API helpers ─────────────────────────────────────────────────────

export const authApi = {
  // Legacy
  registerDonor: (data: any) => api.post("/auth/register/donor", data),
  login: (data: any) => api.post("/auth/login", data),
  // Hybrid email/password
  loginWithEmail: (data: { email: string; password: string }) => api.post("/auth/login/email", data),
  registerWithEmail: (data: any) => api.post("/auth/register/email", data),
  // Fayda OIDC
  faydaAuthorize: (role: string) => api.get("/auth/fayda/authorize", { params: { role } }),
  faydaCallback: (code: string, state: string) => api.get("/auth/fayda/callback", { params: { code, state } }),
  // Common
  onboard: (data: any) => api.post("/auth/onboard", data),
  logout: (refreshToken: string) => api.post("/auth/logout", { refreshToken }),
  me: () => api.get("/auth/me"),
};

export const donorApi = {
  getProfile: () => api.get("/donors/me"),
  updateProfile: (data: any) => api.patch("/donors/me", data),
  checkEligibility: (data: any) => api.post("/donors/me/eligibility", data),
  getMyDonations: (params?: any) => api.get("/donors/me/donations", { params }),
  getMyAlerts: () => api.get("/donors/me/alerts"),
  listAll: (params?: any) => api.get("/donors", { params }),
};

export const requestApi = {
  create: (data: any) => api.post("/requests", data),
  list: (params?: any) => api.get("/requests", { params }),
  get: (id: string) => api.get(`/requests/${id}`),
  respond: (requestId: string, response: "accepted" | "declined") =>
    api.post(`/requests/${requestId}/respond`, { response }),
  cancel: (id: string) => api.patch(`/requests/${id}/cancel`),
  fulfill: (id: string) => api.patch(`/requests/${id}/fulfill`),
  retrigger: (id: string) => api.post(`/requests/${id}/retrigger`),
  getAlerts: (id: string) => api.get(`/requests/${id}/alerts`),
};

export const hospitalApi = {
  create: (data: any) => api.post("/hospitals", data),
  getMyHospital: () => api.get("/hospitals/my/hospital"),
  updateHospital: (data: any) => api.patch("/hospitals/my/hospital", data),
  updateInventory: (inventory: any[]) => api.put("/hospitals/my/hospital/inventory", { inventory }),
  list: (params?: any) => api.get("/hospitals", { params }),
  nearby: (params: { lng: number; lat: number; radiusKm?: number }) =>
    api.get("/hospitals/nearby", { params }),
};

export const donationApi = {
  schedule: (data: any) => api.post("/donations/schedule", data),
  cancel: (id: string) => api.patch(`/donations/${id}/cancel`),
  getHospitalDonations: (params?: any) => api.get("/donations/hospital", { params }),
};

export const analyticsApi = {
  dashboard: () => api.get("/analytics/dashboard"),
  inventory: () => api.get("/analytics/inventory"),
  requestsTrend: (days?: number) => api.get("/analytics/requests/trend", { params: { days } }),
  donorsByRegion: () => api.get("/analytics/donors/by-region"),
};