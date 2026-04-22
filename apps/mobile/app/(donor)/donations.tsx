import { ScrollView, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "@tanstack/react-query";
import { donorApi } from "../../lib/api";
import { MCard, MBloodTypeBadge, MBadge, MEmptyState } from "../../components/ui";
import { formatDate } from "../../lib/utils";
import { CheckCircle, Clock, XCircle } from "lucide-react-native";
import { DonationStatus } from "@donorlink/types";

const STATUS_ICON: Record<string, React.ReactNode> = {
  [DonationStatus.COMPLETED]: <CheckCircle color="#059669" size={16} />,
  [DonationStatus.SCHEDULED]: <Clock color="#D97706" size={16} />,
  [DonationStatus.CANCELLED]: <XCircle color="rgba(39,24,22,0.3)" size={16} />,
  [DonationStatus.NO_SHOW]:   <XCircle color="#D32F2F" size={16} />,
};

export default function DonationsScreen() {
  const { data } = useQuery({
    queryKey: ["donor","donations"],
    queryFn: () => donorApi.getMyDonations({ limit: 50 }).then(r => r.data.data),
  });

  return (
    <SafeAreaView className="flex-1 bg-[#FFF8F7]">
      <View className="px-5 pt-2 pb-4">
        <Text className="font-bold text-2xl text-[#271816]">My donations</Text>
        <Text className="text-sm text-[#271816]/50 mt-0.5">{data?.total ?? 0} total donations</Text>
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 16, gap: 10 }}>
        {data?.items?.length === 0
          ? <MEmptyState title="No donations yet" description="Your history will appear here after your first donation." />
          : data?.items?.map((d: any) => (
            <MCard key={d._id}>
              <View className="flex-row items-center gap-3">
                <MBloodTypeBadge type={d.bloodType} size="lg" />
                <View className="flex-1 min-w-0">
                  <Text className="font-bold text-sm text-[#271816]" numberOfLines={1}>{d.hospitalId?.name ?? "Hospital"}</Text>
                  <Text className="text-xs text-[#271816]/50 mt-0.5">{formatDate(d.scheduledAt)}</Text>
                </View>
                <View className="w-9 h-9 bg-[#FFF8F7] rounded-xl items-center justify-center">
                  {STATUS_ICON[d.status]}
                </View>
              </View>
            </MCard>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}