// ─── alerts.tsx ───────────────────────────────────────────────────────────────
import { ScrollView, View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { donorApi, requestApi } from "../../lib/api";
import { MCard, MBloodTypeBadge, MBadge, MEmptyState } from "../../components/ui";
import { timeAgo } from "../../lib/utils";
import { CheckCircle, XCircle } from "lucide-react-native";

export default function AlertsScreen() {
  const qc = useQueryClient();
  const { data: alerts } = useQuery({
    queryKey: ["donor","alerts"],
    queryFn: () => donorApi.getMyAlerts().then(r => r.data.data),
    refetchInterval: 30_000,
  });
  const respond = useMutation({
    mutationFn: ({ requestId, response }: any) => requestApi.respond(requestId, response),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["donor","alerts"] }),
  });

  const pending = (alerts ?? []).filter((a: any) => !a.donorResponse || a.donorResponse === "no_response");
  const past    = (alerts ?? []).filter((a: any) => a.donorResponse && a.donorResponse !== "no_response");

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F7]">
      <View className="px-5 pt-2 pb-4">
        <Text className="font-bold text-2xl text-[#271816]">Alerts</Text>
        <Text className="text-sm text-[#271816]/50 mt-0.5">Blood requests near you</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, gap: 12 }}>
        {pending.length === 0 && past.length === 0 && (
          <MEmptyState title="No alerts yet" description="You'll be notified when blood matching your type is needed nearby." />
        )}
        {pending.length > 0 && (
          <>
            <Text className="text-xs font-bold uppercase tracking-widest text-[#271816]/35 mb-1">Awaiting response</Text>
            {pending.map((alert: any) => {
              const req = alert.requestId;
              return (
                <MCard key={alert._id} urgent>
                  <View className="flex-row items-start gap-3 mb-3">
                    <MBloodTypeBadge type={req?.bloodType ?? "?"} size="lg" />
                    <View className="flex-1">
                      <View className="flex-row items-center gap-2 mb-1">
                        {req?.urgency && <MBadge label={req.urgency} variant={req.urgency} />}
                        <Text className="text-xs text-[#271816]/35">{timeAgo(alert.createdAt)}</Text>
                      </View>
                      <Text className="font-bold text-[#271816]" numberOfLines={1}>{req?.hospitalId?.name ?? "Hospital"}</Text>
                      <Text className="text-xs text-[#271816]/50 mt-0.5">{req?.hospitalId?.address?.city}</Text>
                    </View>
                  </View>
                  <View className="flex-row gap-2">
                    <TouchableOpacity className="flex-1 bg-[#D32F2F] rounded-xl py-3 items-center"
                      onPress={() => respond.mutate({ requestId: req?._id, response: "accepted" })}>
                      <Text className="text-white font-bold text-sm">I can donate</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="flex-1 bg-white border border-[#271816]/10 rounded-xl py-3 items-center"
                      onPress={() => respond.mutate({ requestId: req?._id, response: "declined" })}>
                      <Text className="text-[#271816]/60 font-semibold text-sm">Decline</Text>
                    </TouchableOpacity>
                  </View>
                </MCard>
              );
            })}
          </>
        )}
        {past.length > 0 && (
          <>
            <Text className="text-xs font-bold uppercase tracking-widest text-[#271816]/35 mt-2 mb-1">Past responses</Text>
            {past.map((alert: any) => (
              <MCard key={alert._id}>
                <View className="flex-row items-center gap-3">
                  <View className={`w-9 h-9 rounded-xl items-center justify-center ${alert.donorResponse === "accepted" ? "bg-emerald-100" : "bg-[#271816]/6"}`}>
                    {alert.donorResponse === "accepted"
                      ? <CheckCircle color="#059669" size={18} />
                      : <XCircle color="rgba(39,24,22,0.3)" size={18} />}
                  </View>
                  <View className="flex-1">
                    <Text className="font-semibold text-sm text-[#271816]">{alert.requestId?.hospitalId?.name ?? "Hospital"}</Text>
                    <Text className="text-xs text-[#271816]/40">{timeAgo(alert.createdAt)}</Text>
                  </View>
                  <MBadge label={alert.donorResponse} variant={alert.donorResponse === "accepted" ? "standard" : "pending"} />
                </View>
              </MCard>
            ))}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}