import { ScrollView, View, Text, TouchableOpacity, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Bell, Droplets, Heart, CheckCircle, Clock } from "lucide-react-native";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { donorApi, requestApi } from "../../lib/api";
import { mobileAuthStore } from "../../store/authStore";
import { MCard, MBloodTypeBadge, MBadge, MStatCard, MEmptyState, SectionHeader } from "../../components/ui";
import { timeAgo, formatDate } from "../../lib/utils";
import { DonorStatus } from "@donorlink/types";

export default function HomeScreen() {
  const router = useRouter();
  const qc = useQueryClient();
  const { user } = mobileAuthStore.getState();

  const { data: donor, isLoading: dl, refetch } = useQuery({
    queryKey: ["donor", "profile"],
    queryFn: () => donorApi.getProfile().then(r => r.data.data),
  });
  const { data: alerts, refetch: refetchAlerts } = useQuery({
    queryKey: ["donor", "alerts"],
    queryFn: () => donorApi.getMyAlerts().then(r => r.data.data),
    refetchInterval: 30_000,
  });

  const respond = useMutation({
    mutationFn: ({ requestId, response }: any) => requestApi.respond(requestId, response),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["donor","alerts"] }); },
  });

  const doRefresh = async () => { await Promise.all([refetch(), refetchAlerts()]); };

  const pending = (alerts ?? []).filter((a: any) => !a.donorResponse || a.donorResponse === "no_response");
  const isEligible = !donor?.nextEligibleDate || new Date(donor.nextEligibleDate) <= new Date();

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F7]">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={dl} onRefresh={doRefresh} tintColor="#D32F2F" />}
      >
        {/* Top bar */}
        <View className="flex-row items-center justify-between px-5 pt-2 pb-4">
          <View>
            <Text className="text-[#271816]/50 text-sm">Good morning,</Text>
            <Text className="font-bold text-xl text-[#271816]">{user?.firstName} 👋</Text>
          </View>
          <View className="flex-row items-center gap-3">
            {donor?.bloodType && <MBloodTypeBadge type={donor.bloodType} />}
            <TouchableOpacity
              className="w-10 h-10 bg-white rounded-2xl items-center justify-center border border-[#271816]/8 relative"
              onPress={() => router.push("/(donor)/alerts")}
            >
              <Bell color="#271816" size={18} />
              {pending.length > 0 && (
                <View className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#D32F2F] rounded-full" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Eligibility banner */}
        <View className="px-4 mb-4">
          {isEligible ? (
            <View className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex-row items-center gap-3">
              <CheckCircle color="#059669" size={20} />
              <View className="flex-1">
                <Text className="font-bold text-sm text-emerald-800">Eligible to donate today</Text>
                <Text className="text-xs text-emerald-600 mt-0.5">You're ready to save lives</Text>
              </View>
            </View>
          ) : (
            <View className="bg-amber-50 border border-amber-100 rounded-2xl p-4 flex-row items-center gap-3">
              <Clock color="#D97706" size={20} />
              <View className="flex-1">
                <Text className="font-bold text-sm text-amber-800">Donation cooldown</Text>
                <Text className="text-xs text-amber-600 mt-0.5">
                  Eligible again {formatDate(donor!.nextEligibleDate!)}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Stats row */}
        <View className="flex-row gap-3 px-4 mb-5">
          <MStatCard label="Donations" value={donor?.totalDonations ?? 0} />
          <MStatCard label="Alerts" value={pending.length} sub="pending" />
        </View>

        {/* Pending alerts */}
        {pending.length > 0 && (
          <View className="mb-5">
            <SectionHeader title={`Requests (${pending.length})`} action="View all" onAction={() => router.push("/(donor)/alerts")} />
            <View className="px-4 gap-3">
              {pending.slice(0, 2).map((alert: any) => {
                const req = alert.requestId;
                return (
                  <MCard key={alert._id} urgent>
                    <View className="flex-row items-start gap-3 mb-3">
                      <MBloodTypeBadge type={req?.bloodType ?? "?"} size="lg" />
                      <View className="flex-1">
                        <View className="flex-row items-center gap-2 mb-1 flex-wrap">
                          {req?.urgency && <MBadge label={req.urgency} variant={req.urgency} />}
                          <Text className="text-xs text-[#271816]/35">{timeAgo(alert.createdAt)}</Text>
                        </View>
                        <Text className="font-bold text-sm text-[#271816]" numberOfLines={1}>
                          {req?.hospitalId?.name ?? "Nearby hospital"}
                        </Text>
                      </View>
                    </View>
                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        className="flex-1 bg-[#D32F2F] rounded-xl py-2.5 items-center"
                        onPress={() => respond.mutate({ requestId: req?._id, response: "accepted" })}
                      >
                        <Text className="text-white font-bold text-sm">I can donate</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="flex-1 bg-white border border-[#271816]/10 rounded-xl py-2.5 items-center"
                        onPress={() => respond.mutate({ requestId: req?._id, response: "declined" })}
                      >
                        <Text className="text-[#271816]/60 font-semibold text-sm">Decline</Text>
                      </TouchableOpacity>
                    </View>
                  </MCard>
                );
              })}
            </View>
          </View>
        )}

        {/* Quick actions */}
        <SectionHeader title="Quick actions" />
        <View className="px-4 flex-row gap-3">
          {[
            { icon: <Heart color="#D32F2F" size={20} />, label: "Donations", path: "/(donor)/donations" },
            { icon: <Droplets color="#005F7B" size={20} />, label: "Profile", path: "/(donor)/profile" },
          ].map(({ icon, label, path }) => (
            <TouchableOpacity
              key={label}
              className="flex-1 bg-white rounded-2xl p-4 items-center gap-2 border border-[#271816]/6"
              onPress={() => router.push(path as any)}
            >
              <View className="w-10 h-10 bg-[#FFF8F7] rounded-xl items-center justify-center">{icon}</View>
              <Text className="font-semibold text-sm text-[#271816]">{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}