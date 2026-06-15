import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { inventoryApi } from "../api/inventory";
import { apiClient } from "../api/client";

export const QK = {
  dashboard: ["dashboard"] as const,
  inventory: (params?: any) => ["inventory", params] as const,
  requests: (params?: any) => ["requests", params] as const,
  transfers: (params?: any) => ["transfers", params] as const,
};

export function useHospitalDashboard() {
  return useQuery({
    queryKey: QK.dashboard,
    queryFn: () => apiClient.get("/dashboard/hospital").then(r => r.data.data),
    staleTime: 60_000,
  });
}

export function useHospitalInventory(params?: any) {
  return useQuery({
    queryKey: QK.inventory(params),
    queryFn: () => inventoryApi.getInventory(params),
  });
}

export function useRecordTransfusion() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => inventoryApi.recordTransfusion(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.inventory() });
      qc.invalidateQueries({ queryKey: QK.dashboard });
    },
  });
}

export function useReceiveDispatch() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => inventoryApi.receiveDispatch(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.inventory() });
      qc.invalidateQueries({ queryKey: QK.dashboard });
      qc.invalidateQueries({ queryKey: QK.transfers() });
    },
  });
}

export function useUrgentRequests() {
  return useQuery({
    queryKey: QK.requests({ urgent: true }),
    queryFn: () => inventoryApi.getUrgentRequests(),
    refetchInterval: 30_000,
  });
}

export function useHospitalRequests() {
  return useQuery({
    queryKey: QK.requests({ mine: true }),
    queryFn: () => apiClient.get("/requests/my-requests").then(r => r.data.data),
    refetchInterval: 60_000,
  });
}

export function useCreateRequest() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: any) => apiClient.post("/requests", data).then(r => r.data.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QK.requests() });
      qc.invalidateQueries({ queryKey: QK.dashboard });
    },
  });
}
