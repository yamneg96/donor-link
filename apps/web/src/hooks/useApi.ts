import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  authApi,
  donorApi,
  requestApi,
  hospitalApi,
  donationApi,
  analyticsApi,
} from "../api/client";
import { authStore } from "../store/authStore";

// ─── Keys ─────────────────────────────────────────────────────────────────────
export const QK = {
  me: ["auth", "me"] as const,
  donorProfile: ["donor", "profile"] as const,
  donorDonations: (p?: any) => ["donor", "donations", p] as const,
  donorAlerts: ["donor", "alerts"] as const,
  requests: (p?: any) => ["requests", p] as const,
  request: (id: string) => ["requests", id] as const,
  requestAlerts: (id: string) => ["requests", id, "alerts"] as const,
  hospitals: (p?: any) => ["hospitals", p] as const,
  myHospital: ["hospital", "my"] as const,
  hospitalDonations: (p?: any) => ["hospital", "donations", p] as const,
  dashboard: ["analytics", "dashboard"] as const,
  inventory: ["analytics", "inventory"] as const,
  requestsTrend: (days?: number) => ["analytics", "trend", days] as const,
  donorsByRegion: ["analytics", "regions"] as const,
  allDonors: (p?: any) => ["admin", "donors", p] as const,
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: QK.me,
    queryFn: () => authApi.me().then((r) => r.data.data),
    enabled: authStore.isAuthenticated(),
    staleTime: 5 * 60 * 1000,
  });
}

/** Legacy login (phone + password) */
export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { phone: string; password: string }) => authApi.login(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

/** Hybrid login (email + password) */
export function useLoginWithEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) => authApi.loginWithEmail(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

/** Hybrid register (email + password for any role) */
export function useRegisterWithEmail() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.registerWithEmail(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

/** Legacy register (phone + password + full donor data) */
export function useRegisterDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.registerDonor(data),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

/** Get Fayda authorization URL — redirects user to eSignet */
export function useFaydaAuthorize() {
  return useMutation({
    mutationFn: (role: string) => authApi.faydaAuthorize(role).then((r) => r.data.data),
  });
}

/** Handle Fayda callback — exchange code for tokens */
export function useFaydaCallback() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ code, state }: { code: string; state: string }) =>
      authApi.faydaCallback(code, state),
    onSuccess: (res) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

/** Post-login onboarding (donor-specific data) */
export function useOnboardDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.onboard(data),
    onSuccess: (res) => {
      const { user } = res.data.data;
      // Update user in store with onboardingComplete=true
      const tokens = authStore.getState();
      if (tokens.accessToken && tokens.refreshToken) {
        authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      }
      qc.invalidateQueries({ queryKey: QK.me });
      qc.invalidateQueries({ queryKey: QK.donorProfile });
    },
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => {
      const rt = localStorage.getItem("refreshToken") ?? "";
      return authApi.logout(rt);
    },
    onSettled: () => {
      authStore.clearAuth();
      qc.clear();
    },
  });
}

// ─── Donor ────────────────────────────────────────────────────────────────────

export function useDonorProfile() {
  return useQuery({
    queryKey: QK.donorProfile,
    queryFn: () => donorApi.getProfile().then((r) => r.data.data),
    enabled: authStore.isAuthenticated(),
  });
}

export function useUpdateDonorProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => donorApi.updateProfile(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.donorProfile }),
  });
}

export function useCheckEligibility() {
  return useMutation({
    mutationFn: (data: any) => donorApi.checkEligibility(data).then((r) => r.data.data),
  });
}

export function useMyDonations(params?: any) {
  return useQuery({
    queryKey: QK.donorDonations(params),
    queryFn: () => donorApi.getMyDonations(params).then((r) => r.data.data),
    enabled: authStore.isAuthenticated(),
  });
}

export function useMyAlerts() {
  return useQuery({
    queryKey: QK.donorAlerts,
    queryFn: () => donorApi.getMyAlerts().then((r) => r.data.data),
    enabled: authStore.isAuthenticated(),
    refetchInterval: 30_000,
  });
}

export function useAllDonors(params?: any) {
  return useQuery({
    queryKey: QK.allDonors(params),
    queryFn: () => donorApi.listAll(params).then((r) => r.data.data),
  });
}

// ─── Blood Requests ───────────────────────────────────────────────────────────

export function useRequests(params?: any) {
  return useQuery({
    queryKey: QK.requests(params),
    queryFn: () => requestApi.list(params).then((r) => r.data.data),
    refetchInterval: 60_000,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: QK.request(id),
    queryFn: () => requestApi.get(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => requestApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

export function useRespondToRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ requestId, response }: { requestId: string; response: "accepted" | "declined" }) =>
      requestApi.respond(requestId, response),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.donorAlerts });
      qc.invalidateQueries({ queryKey: ["requests"] });
    },
  });
}

export function useCancelRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestApi.cancel(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

export function useFulfillRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => requestApi.fulfill(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

export function useRetriggerAlerts() {
  return useMutation({
    mutationFn: (id: string) => requestApi.retrigger(id),
  });
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export function useMyHospital() {
  return useQuery({
    queryKey: QK.myHospital,
    queryFn: () => hospitalApi.getMyHospital().then((r) => r.data.data),
    enabled: authStore.hasRole("hospital_admin" as any, "blood_bank_admin" as any, "super_admin" as any),
  });
}

export function useUpdateInventory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (inventory: any[]) => hospitalApi.updateInventory(inventory),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.myHospital }),
  });
}

export function useHospitalDonations(params?: any) {
  return useQuery({
    queryKey: QK.hospitalDonations(params),
    queryFn: () => donationApi.getHospitalDonations(params).then((r) => r.data.data),
  });
}

export function useScheduleDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => donationApi.schedule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: QK.donorDonations() }),
  });
}

// ─── Analytics ────────────────────────────────────────────────────────────────

export function useDashboardStats() {
  return useQuery({
    queryKey: QK.dashboard,
    queryFn: () => analyticsApi.dashboard().then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });
}

export function useInventoryOverview() {
  return useQuery({
    queryKey: QK.inventory,
    queryFn: () => analyticsApi.inventory().then((r) => r.data.data),
    staleTime: 2 * 60 * 1000,
  });
}

export function useRequestsTrend(days = 30) {
  return useQuery({
    queryKey: QK.requestsTrend(days),
    queryFn: () => analyticsApi.requestsTrend(days).then((r) => r.data.data),
  });
}

export function useDonorsByRegion() {
  return useQuery({
    queryKey: QK.donorsByRegion,
    queryFn: () => analyticsApi.donorsByRegion().then((r) => r.data.data),
  });
}