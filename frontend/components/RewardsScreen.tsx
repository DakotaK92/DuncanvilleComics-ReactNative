import { View, Text, FlatList, Pressable } from "react-native";
import { useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { getApiErrorMessage, useApiClient, rewardsApi } from "../utils/api";

type TabKey = "overview" | "earn" | "redeem" | "badges";

type Reward = {
  _id?: string;
  code?: string;
  title: string;
  cost: number;
  description?: string;
};

type BadgeType = {
  title: string;
  unlocked?: boolean;
};

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const api = useApiClient();
  const rewardsQuery = useQuery({
    queryKey: ["rewards-summary"],
    queryFn: async () => {
      const response = await rewardsApi.getSummary(api);
      return response.data;
    },
  });

  const coins = rewardsQuery.data?.summary?.coins ?? 0;
  const nextReward = rewardsQuery.data?.summary?.nextReward ?? null;
  const rewards = useMemo<Reward[]>(
    () => rewardsQuery.data?.rewards ?? [],
    [rewardsQuery.data]
  );
  const badges = useMemo<BadgeType[]>(
    () => rewardsQuery.data?.summary?.badges ?? [],
    [rewardsQuery.data]
  );
  const errorMessage = rewardsQuery.isError
    ? getApiErrorMessage(rewardsQuery.error)
    : null;

  return (
    <View className="flex-1">
      <View className="flex-row mt-4 bg-white rounded-full p-1 mx-4">
        <TabButton
          label="Overview"
          active={activeTab === "overview"}
          onPress={() => setActiveTab("overview")}
        />
        <TabButton
          label="Earn"
          active={activeTab === "earn"}
          onPress={() => setActiveTab("earn")}
        />
        <TabButton
          label="Redeem"
          active={activeTab === "redeem"}
          onPress={() => setActiveTab("redeem")}
        />
        <TabButton
          label="Badges"
          active={activeTab === "badges"}
          onPress={() => setActiveTab("badges")}
        />
      </View>

      <View className="flex-1">
        {rewardsQuery.isPending ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-white font-gothamMedium text-base">
              Loading rewards...
            </Text>
          </View>
        ) : rewardsQuery.isError ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-white font-gothamMedium text-center text-base">
              {errorMessage}
            </Text>
          </View>
        ) : (
          <>
            {activeTab === "overview" && (
              <Overview coins={coins} nextReward={nextReward} />
            )}
            {activeTab === "earn" && <Earn />}
            {activeTab === "redeem" && <Redeem coins={coins} rewards={rewards} />}
            {activeTab === "badges" && <Badges badges={badges} />}
          </>
        )}
      </View>
    </View>
  );
}

function TabButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-2 rounded-full ${active ? "bg-red-600" : ""}`}
    >
      <Text
        className={`text-center font-gothamMedium ${
          active ? "text-white" : "text-black"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Overview({
  coins,
  nextReward,
}: {
  coins: number;
  nextReward: { title: string; cost: number; remainingCoins: number } | null;
}) {
  const progress = nextReward
    ? Math.max(
        Math.min(
          ((nextReward.cost - nextReward.remainingCoins) / nextReward.cost) * 100,
          100
        ),
        0
      )
    : 100;

  return (
    <View className="p-4">
      <View className="bg-red-600 rounded-2xl p-5 shadow">
        <Text className="text-white text-lg font-gothamMedium">Comic Coins</Text>
        <Text className="text-white text-4xl font-gothamBold">{coins}</Text>

        <View className="mt-3">
          <Text className="text-white text-sm font-gothamLight">
            {nextReward
              ? `Next reward: ${nextReward.title}`
              : "You've unlocked every active reward."}
          </Text>
          <View className="h-3 bg-red-800 rounded-full mt-2 overflow-hidden">
            <View
              className="h-3 bg-white rounded-full"
              style={{ width: `${progress}%` }}
            />
          </View>
          {nextReward ? (
            <Text className="text-white text-sm font-gothamLight mt-2">
              {nextReward.remainingCoins} coins to go
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const earnData = [
  { id: "1", icon: "book", label: "Read a Comic", points: 10 },
  { id: "2", icon: "cart", label: "Buy a Comic", points: 50 },
  { id: "3", icon: "calendar", label: "Daily Check-in", points: 5 },
  { id: "4", icon: "qr-code", label: "Scan QR In-Store", points: 25 },
];

function Earn() {
  return (
    <FlatList
      data={earnData}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-3 flex-row items-center shadow">
          <Ionicons name={item.icon as any} size={28} color="red" />
          <View className="ml-4">
            <Text className="text-lg font-gothamMedium">{item.label}</Text>
            <Text className="text-gray-500 font-gothamLight">
              +{item.points} coins
            </Text>
          </View>
        </View>
      )}
    />
  );
}

function Redeem({
  coins,
  rewards,
}: {
  coins: number;
  rewards: Reward[];
}) {
  return (
    <FlatList
      data={rewards}
      numColumns={2}
      keyExtractor={(item) => item._id ?? item.code ?? item.title}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => {
        const unlocked = coins >= item.cost;

        return (
          <View className="flex-1 m-2 bg-white rounded-2xl p-4 shadow">
            <Text className="text-lg font-gothamMedium">{item.title}</Text>
            <Text className="text-gray-500 mb-3 font-gothamLight">
              {item.cost} coins
            </Text>
            {item.description ? (
              <Text className="text-gray-500 mb-3 font-gothamLight text-xs">
                {item.description}
              </Text>
            ) : null}

            <Pressable
              disabled={!unlocked}
              className={`rounded-xl py-2 ${unlocked ? "bg-red-600" : "bg-gray-300"}`}
            >
              <Text className="text-white text-center font-semibold">
                {unlocked ? "Redeem" : "Locked"}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

function Badges({ badges }: { badges: BadgeType[] }) {
  return (
    <FlatList
      data={badges}
      numColumns={3}
      keyExtractor={(item) => item.title}
      contentContainerStyle={{ padding: 12 }}
      renderItem={({ item }) => (
        <View
          className={`flex-1 m-2 rounded-xl p-4 items-center shadow ${
            (item.unlocked ?? true) ? "bg-white" : "bg-gray-300"
          }`}
        >
          <Ionicons
            name="ribbon"
            size={32}
            color={(item.unlocked ?? true) ? "red" : "gray"}
          />
          <Text
            className={`mt-2 text-sm font-gothamMedium text-center ${
              (item.unlocked ?? true) ? "text-black" : "text-gray-500"
            }`}
          >
            {item.title}
          </Text>
        </View>
      )}
    />
  );
}
