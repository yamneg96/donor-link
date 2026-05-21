import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../api/auth";
import { inventoryApi } from "../api/inventory";
import { transferApi } from "../api/transfers";
import { emergencyApi } from "../api/emergency";
import { campaignApi } from "../api/campaigns";
import { alertApi } from "../api/alerts";
import { analyticsApi } from "../api/analytics";
import { dashboardApi } from "../api/dashboard";
import { organizationApi } from "../api/organizations";
import { userApi } from "../api/users";
import { donorApi } from "../api/donors";
import { hospitalApi } from "../api/hospitals";
import { notificationApi } from "../api/notifications";
import { auditApi } from "../api/audit";
import { forecastingApi } from "../api/forecasting";
import { recommendationApi } from "../api/recommendations";
import { requestApi } from "../api/requests";
import { donationApi } from "../api/donations";
import { intelligenceApi } from "../api/intelligence";
import { authStore } from "../store/authStore";
import type { 
  ApiResponse, 
  IUser, 
  LoginResponse,
  IStockLevel,
  IMLForecastResponse,
  IMLShortageRiskResponse,
  IMLRedistributionResponse,
  IMLAnomalyDetection,
  IMLExpiryRisk,
  IMLHealth,
  IHospital,
  IOrganization
} from "../types";



// ─── Query Keys ───────────────────────────────────────────────────────────────

export const QK = {
  // Auth
  me: ["auth", "me"] as const,
  // Inventory
  inventoryAll: (p?: unknown) => ["inventory", "all", p] as const,
  stockLevels: (p?: unknown) => ["inventory", "stock-levels", p] as const,
  stockByOrg: ["inventory", "stock-by-org"] as const,
  expiring: (p?: unknown) => ["inventory", "expiring", p] as const,
  inventoryStats: ["inventory", "stats"] as const,
  inventoryUnit: (id: string) => ["inventory", id] as const,
  unitLedger: (id: string) => ["inventory", id, "ledger"] as const,
  // Transfers
  transfers: (p?: unknown) => ["transfers", p] as const,
  transfer: (id: string) => ["transfers", id] as const,
  shipment: (id: string) => ["transfers", id, "shipment"] as const,
  // Emergency
  emergencies: (p?: unknown) => ["emergencies", p] as const,
  emergency: (id: string) => ["emergencies", id] as const,
  // Campaigns
  campaigns: (p?: unknown) => ["campaigns", p] as const,
  campaign: (id: string) => ["campaigns", id] as const,
  // Alerts
  alerts: (p?: unknown) => ["alerts", p] as const,
  alert: (id: string) => ["alerts", id] as const,
  // Analytics
  analyticsNational: ["analytics", "national"] as const,
  analyticsHospital: (orgId: string) => ["analytics", "hospital", orgId] as const,
  analyticsTransfers: ["analytics", "transfers"] as const,
  analyticsWastage: ["analytics", "wastage"] as const,
  analyticsDonors: ["analytics", "donors"] as const,
  // Dashboard
  dashboardNational: ["dashboard", "national"] as const,
  dashboardHospital: (orgId?: string) => ["dashboard", "hospital", orgId] as const,
  // Organizations
  organizations: (p?: unknown) => ["organizations", p] as const,
  organization: (id: string) => ["organizations", id] as const,
  orgStats: ["organizations", "stats"] as const,
  // Users
  users: (p?: unknown) => ["users", p] as const,
  user: (id: string) => ["users", id] as const,
  // Donors
  donors: (p?: unknown) => ["donors", p] as const,
  donor: (id: string) => ["donors", id] as const,
  donorProfile: ["donors", "me"] as const,
  // Hospitals
  hospitals: (p?: unknown) => ["hospitals", p] as const,
  hospital: (id: string) => ["hospitals", id] as const,
  myHospital: ["hospitals", "my"] as const,
  // Notifications
  notifications: (p?: unknown) => ["notifications", p] as const,
  // Audit
  auditLogs: (p?: unknown) => ["audit", p] as const,
  // Forecasting
  forecasts: (p?: unknown) => ["forecasting", p] as const,
  // Recommendations
  recommendations: (p?: unknown) => ["recommendations", p] as const,
  // Requests
  requests: (p?: unknown) => ["requests", p] as const,
  request: (id: string) => ["requests", id] as const,
  // Intelligence (ML)
  intelligenceForecast: (p?: unknown) => ["intelligence", "forecast", p] as const,
  intelligenceShortage: (p?: unknown) => ["intelligence", "shortage", p] as const,
  intelligenceRedistribution: (p?: unknown) => ["intelligence", "redistribution", p] as const,
  intelligenceAnomaly: (p?: unknown) => ["intelligence", "anomaly", p] as const,
  intelligenceExpiry: (p?: unknown) => ["intelligence", "expiry", p] as const,
  intelligenceHealth: ["intelligence", "health"] as const,
};

// ─── Auth Hooks ───────────────────────────────────────────────────────────────

export function useMe() {
  return useQuery({
    queryKey: QK.me,
    queryFn: () => authApi.me().then((r: { data: ApiResponse<IUser> }) => r.data.data),
    enabled: authStore.isAuthenticated(),
    staleTime: 5 * 60_000,
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { email: string; password: string }) =>
      authApi.login(data),
    onSuccess: (res: { data: ApiResponse<LoginResponse> }) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      email: string;
      password: string;
      phone?: string;
      role?: string;
      organizationId?: string;
    }) => authApi.register(data),
    onSuccess: (res: { data: ApiResponse<LoginResponse> }) => {
      const { user, tokens } = res.data.data;
      authStore.setAuth(user, tokens.accessToken, tokens.refreshToken);
      qc.invalidateQueries({ queryKey: QK.me });
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

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => authApi.forgotPassword(email),
  });
}

export function useResetPassword() {
  return useMutation({
    mutationFn: (data: { token: string; password: string }) =>
      authApi.resetPassword(data),
  });
}

export function useOnboardDonor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => authApi.onboard(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.me });
    },
  });
}

// ─── Inventory Hooks ──────────────────────────────────────────────────────────

export function useInventoryAll(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.inventoryAll(params),
    queryFn: () => inventoryApi.getAll(params).then((r) => r.data.data),
  });
}


export function useStockLevels(params?: Record<string, unknown>) {
  const query = useQuery({
    queryKey: QK.stockLevels(params),
    queryFn: () => inventoryApi.getStockLevels(params).then((r: { data: ApiResponse<IStockLevel[]> }) => r.data.data),
    refetchInterval: 60_000,
  });
  
  return { ...query, levels: query.data };
}




export function useStockByOrg() {
  return useQuery({
    queryKey: QK.stockByOrg,
    queryFn: () => inventoryApi.getStockByOrg().then((r) => r.data.data),
  });
}

export function useExpiringUnits(params?: { days?: number }) {
  return useQuery({
    queryKey: QK.expiring(params),
    queryFn: () => inventoryApi.getExpiring(params).then((r) => r.data.data),
  });
}

export function useInventoryStats() {
  return useQuery({
    queryKey: QK.inventoryStats,
    queryFn: () => inventoryApi.getStats().then((r) => r.data.data),
  });
}

export function useInventoryUnit(id: string) {
  return useQuery({
    queryKey: QK.inventoryUnit(id),
    queryFn: () => inventoryApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useReserveUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data?: Record<string, unknown> }) =>
      inventoryApi.reserve(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

export function useDiscardUnit() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      inventoryApi.discard(id, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["inventory"] }),
  });
}

// ─── Transfer Hooks ───────────────────────────────────────────────────────────

export function useTransfers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.transfers(params),
    queryFn: () => transferApi.getAll(params).then((r) => r.data.data),
    refetchInterval: 60_000,
  });
}

export function useTransfer(id: string) {
  return useQuery({
    queryKey: QK.transfer(id),
    queryFn: () => transferApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => transferApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
}

export function useApproveTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transferApi.approve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
}

export function useRejectTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      transferApi.reject(id, { reason }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
}

export function useDispatchTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      transferApi.dispatch(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
}

export function useReceiveTransfer() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => transferApi.receive(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["transfers"] }),
  });
}

// ─── Emergency Hooks ──────────────────────────────────────────────────────────

export function useEmergencies(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.emergencies(params),
    queryFn: () => emergencyApi.getAll(params).then((r) => r.data.data),
    refetchInterval: 30_000,
  });
}

export function useEmergency(id: string) {
  return useQuery({
    queryKey: QK.emergency(id),
    queryFn: () => emergencyApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useDeclareEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => emergencyApi.declare(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencies"] }),
  });
}

export function useResolveEmergency() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => emergencyApi.resolve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["emergencies"] }),
  });
}

// ─── Campaign Hooks ───────────────────────────────────────────────────────────

export function useCampaigns(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.campaigns(params),
    queryFn: () => campaignApi.getAll(params).then((r) => r.data.data),
  });
}

export function useCampaign(id: string) {
  return useQuery({
    queryKey: QK.campaign(id),
    queryFn: () => campaignApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => campaignApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useUpdateCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      campaignApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

export function useDeleteCampaign() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["campaigns"] }),
  });
}

// ─── Alert Hooks ──────────────────────────────────────────────────────────────

export function useAlerts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.alerts(params),
    queryFn: () => alertApi.getAll(params).then((r) => r.data.data),
    refetchInterval: 30_000,
  });
}

export function useAcknowledgeAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertApi.acknowledge(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

export function useResolveAlert() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => alertApi.resolve(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["alerts"] }),
  });
}

// ─── Analytics Hooks ──────────────────────────────────────────────────────────

export function useNationalAnalytics() {
  return useQuery({
    queryKey: QK.analyticsNational,
    queryFn: () => analyticsApi.national().then((r) => r.data.data),
    staleTime: 2 * 60_000,
  });
}

export function useTransferAnalytics() {
  return useQuery({
    queryKey: QK.analyticsTransfers,
    queryFn: () => analyticsApi.transfers().then((r) => r.data.data),
  });
}

export function useWastageAnalytics() {
  return useQuery({
    queryKey: QK.analyticsWastage,
    queryFn: () => analyticsApi.wastage().then((r) => r.data.data),
  });
}

export function useDonorAnalytics() {
  return useQuery({
    queryKey: QK.analyticsDonors,
    queryFn: () => analyticsApi.donors().then((r) => r.data.data),
  });
}

// ─── Dashboard Hooks ──────────────────────────────────────────────────────────

export function useNationalDashboard() {
  return useQuery({
    queryKey: QK.dashboardNational,
    queryFn: () => dashboardApi.national().then((r) => r.data.data),
    staleTime: 2 * 60_000,
    refetchInterval: 5 * 60_000,
  });
}

export function usePublicStats() {
  return useQuery({
    queryKey: ["public-stats"],
    queryFn: () => dashboardApi.publicStats().then((r) => r.data.data),
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
  });
}

export function useHospitalDashboard(orgId?: string) {
  return useQuery({
    queryKey: QK.dashboardHospital(orgId),
    queryFn: () => dashboardApi.hospital(orgId).then((r) => r.data.data),
    staleTime: 2 * 60_000,
  });
}

// ─── Organization Hooks ───────────────────────────────────────────────────────

export function useOrganizations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.organizations(params),
    queryFn: () => organizationApi.getAll(params).then((r: { data: ApiResponse<IOrganization[]> }) => r.data.data),
  });
}


export function useOrganization(id: string) {
  return useQuery({
    queryKey: QK.organization(id),
    queryFn: () => organizationApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useOrgStats() {
  return useQuery({
    queryKey: QK.orgStats,
    queryFn: () => organizationApi.getStats().then((r) => r.data.data),
  });
}

export function useCreateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => organizationApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
}

export function useUpdateOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      organizationApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
}

export function useDeleteOrganization() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => organizationApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["organizations"] }),
  });
}

// ─── User Hooks ───────────────────────────────────────────────────────────────

export function useUsers(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.users(params),
    queryFn: () => userApi.getAll(params).then((r) => r.data.data),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: QK.user(id),
    queryFn: () => userApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => userApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Record<string, unknown> }) =>
      userApi.update(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

export function useDeleteUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => userApi.delete(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["users"] }),
  });
}

// ─── Donor Hooks ──────────────────────────────────────────────────────────────

export function useDonors(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.donors(params),
    queryFn: () => donorApi.getAll(params).then((r) => r.data.data),
  });
}

// ─── Hospital Hooks ───────────────────────────────────────────────────────────

export function useHospitals(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.hospitals(params),
    queryFn: () => hospitalApi.getAll(params).then((r: { data: ApiResponse<IHospital[]> }) => r.data.data),
  });
}


// ─── Notification Hooks ───────────────────────────────────────────────────────

export function useNotifications(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.notifications(params),
    queryFn: () => notificationApi.getAll(params).then((r) => r.data.data),
    refetchInterval: 30_000,
  });
}

export function useMarkNotificationRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => notificationApi.markRead(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });
}

// ─── Audit Hooks ──────────────────────────────────────────────────────────────

export function useAuditLogs(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.auditLogs(params),
    queryFn: () => auditApi.getAll(params).then((r) => r.data.data),
  });
}

// ─── Forecasting Hooks ────────────────────────────────────────────────────────

export function useForecasts(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.forecasts(params),
    queryFn: () => forecastingApi.getAll(params).then((r) => r.data.data),
  });
}

// ─── Recommendation Hooks ─────────────────────────────────────────────────────

export function useRecommendations(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.recommendations(params),
    queryFn: () => recommendationApi.getAll(params).then((r) => r.data.data),
  });
}

export function useAcceptRecommendation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => recommendationApi.accept(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["recommendations"] }),
  });
}

// ─── Blood Request Hooks ──────────────────────────────────────────────────────

export function useRequests(params?: Record<string, unknown>) {
  return useQuery({
    queryKey: QK.requests(params),
    queryFn: () => requestApi.getAll(params).then((r) => r.data.data),
    refetchInterval: 60_000,
  });
}

export function useRequest(id: string) {
  return useQuery({
    queryKey: QK.request(id),
    queryFn: () => requestApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => requestApi.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["requests"] }),
  });
}

// ─── Donation Hooks ───────────────────────────────────────────────────────────

export function useScheduleDonation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Record<string, unknown>) => donationApi.schedule(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donations"] }),
  });
}

// ─── Intelligence (ML) Hooks ─────────────────────────────────────────────────

export function useMLForecast(params: any) {
  return useQuery({
    queryKey: QK.intelligenceForecast(params),
    queryFn: () => intelligenceApi.getForecast(params).then((r: { data: ApiResponse<IMLForecastResponse> }) => r.data.data),
    enabled: !!params?.hospitalId && !!params?.bloodType,
  });
}

export function useMLShortageRisk(params: any) {
  return useQuery({
    queryKey: QK.intelligenceShortage(params),
    queryFn: () => intelligenceApi.getShortageRisk(params).then((r: { data: ApiResponse<IMLShortageRiskResponse> }) => r.data.data),
    enabled: !!params?.hospitalId && !!params?.bloodType,
    staleTime: 5 * 60_000,
  });
}


export function useMLRedistribution() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => 
      intelligenceApi.getRedistribution(data).then((r: { data: ApiResponse<IMLRedistributionResponse> }) => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["transfers"] });
      qc.invalidateQueries({ queryKey: ["inventory"] });
    },
  });
}


export function useMLAnomalyDetection(params: any) {
  return useQuery({
    queryKey: QK.intelligenceAnomaly(params),
    queryFn: () => intelligenceApi.detectAnomalies(params).then((r: { data: ApiResponse<IMLAnomalyDetection> }) => r.data.data),
    enabled: !!params?.values?.length,
  });
}

export function useMLExpiryRisk(params: any) {
  return useQuery({
    queryKey: QK.intelligenceExpiry(params),
    queryFn: () => intelligenceApi.getExpiryRisk(params).then((r: { data: ApiResponse<IMLExpiryRisk[]> }) => r.data.data),
    enabled: !!params?.hospital_id && !!params?.units?.length,
  });
}



export function useMLHealth() {
  return useQuery({
    queryKey: QK.intelligenceHealth,
    queryFn: () => intelligenceApi.checkHealth().then((r: { data: ApiResponse<IMLHealth> }) => r.data.data),
    refetchInterval: 60_000,
  });
}