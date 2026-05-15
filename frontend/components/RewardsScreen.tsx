import { View, Text, FlatList, Pressable, RefreshControl } from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getFriendlyApiErrorMessage,
  rewardsApi,
  useApiClient,
} from "../utils/api";
import StateMessage from "./StateMessage";
import ToastBanner from "./ToastBanner";
import type {
  Reward,
  RewardActivityItem,
  RewardBadge,
  RewardEarnRule,
} from "../utils/apiTypes";

type TabKey = "overview" | "earn" | "redeem" | "badges";

export default function RewardsScreen() {
  const [activeTab, setActiveTab] = useState<TabKey>("overview");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error" | "info">("success");
  const api = useApiClient();
  const queryClient = useQueryClient();
  const hasSeenInitialDataRef = useRef(false);

  const rewardsQuery = useQuery({
    queryKey: ["rewards-summary"],
    queryFn: async () => {
      const response = await rewardsApi.getSummary(api);
      return response.data;
    },
  });

  const redeemMutation = useMutation({
    mutationFn: (rewardId: string) => rewardsApi.redeem(api, rewardId),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
      setToastTone("success");
      setToastMessage(`${response.data.reward.title} redeemed successfully.`);
    },
    onError: (error) => {
      setToastTone("error");
      setToastMessage(getFriendlyApiErrorMessage(error));
    },
  });

  const coins = rewardsQuery.data?.summary?.coins ?? 0;
  const nextReward = rewardsQuery.data?.summary?.nextReward ?? null;
  const lifetimePoints = rewardsQuery.data?.summary?.lifetimePoints ?? 0;
  const rewards = useMemo<Reward[]>(
    () => rewardsQuery.data?.rewards ?? [],
    [rewardsQuery.data]
  );
  const badges = useMemo<RewardBadge[]>(
    () => rewardsQuery.data?.summary?.badges ?? [],
    [rewardsQuery.data]
  );
  const earnRules = useMemo<RewardEarnRule[]>(
    () => rewardsQuery.data?.earnRules ?? [],
    [rewardsQuery.data]
  );
  const recentActivity = useMemo<RewardActivityItem[]>(
    () => rewardsQuery.data?.summary?.recentActivity ?? [],
    [rewardsQuery.data]
  );
  const errorMessage = rewardsQuery.isError
    ? getFriendlyApiErrorMessage(
        rewardsQuery.error,
        "We couldn't load rewards right now. Please try again in a moment."
      )
    : null;
  const isRefreshing = rewardsQuery.isRefetching && !rewardsQuery.isPending;
  const lastUpdatedLabel = rewardsQuery.dataUpdatedAt
    ? formatLastUpdated(rewardsQuery.dataUpdatedAt)
    : null;

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    if (!rewardsQuery.dataUpdatedAt) {
      return;
    }

    if (!hasSeenInitialDataRef.current) {
      hasSeenInitialDataRef.current = true;
      return;
    }

    setToastTone("info");
    setToastMessage("Rewards updated just now.");
  }, [rewardsQuery.dataUpdatedAt]);

  const refreshControl = (
    <RefreshControl
      refreshing={isRefreshing}
      onRefresh={() => rewardsQuery.refetch()}
      tintColor="#dc2626"
    />
  );

  return (
    <View className="flex-1">
      {toastMessage ? <ToastBanner message={toastMessage} tone={toastTone} /> : null}

      <View className="mx-4 mt-4 flex-row rounded-full bg-white p-1">
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
          <View className="flex-1 justify-center px-6">
            <StateMessage
              title="Loading rewards"
              message="We’re gathering your coins, badges, and rewards now."
              loading
              light
            />
          </View>
        ) : rewardsQuery.isError ? (
          <View className="flex-1 justify-center px-6">
            <StateMessage
              title="Rewards unavailable"
              message={errorMessage ?? "We couldn't load rewards right now."}
              actionLabel="Try again"
              onPressAction={() => rewardsQuery.refetch()}
            />
          </View>
        ) : (
          <>
            {activeTab === "overview" && (
              <Overview
                coins={coins}
                lifetimePoints={lifetimePoints}
                nextReward={nextReward}
                recentActivity={recentActivity}
                refreshControl={refreshControl}
                lastUpdatedLabel={lastUpdatedLabel}
              />
            )}
            {activeTab === "earn" && <Earn earnRules={earnRules} refreshControl={refreshControl} />}
            {activeTab === "redeem" && (
              <Redeem
                coins={coins}
                rewards={rewards}
                redeemingRewardId={redeemMutation.variables ?? null}
                onRedeem={(rewardId) => redeemMutation.mutate(rewardId)}
                refreshControl={refreshControl}
              />
            )}
            {activeTab === "badges" && <Badges badges={badges} refreshControl={refreshControl} />}
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
      className={`flex-1 rounded-full py-2 ${active ? "bg-red-600" : ""}`}
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
  lifetimePoints,
  nextReward,
  recentActivity,
  refreshControl,
  lastUpdatedLabel,
}: {
  coins: number;
  lifetimePoints: number;
  nextReward: { title: string; cost: number; remainingCoins: number } | null;
  recentActivity: RewardActivityItem[];
  refreshControl: React.ReactElement;
  lastUpdatedLabel: string | null;
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
    <FlatList
      data={recentActivity}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
      refreshControl={refreshControl}
      ListHeaderComponent={
        <>
          <View className="rounded-2xl bg-red-600 p-5 shadow">
            <Text className="text-lg font-gothamMedium text-white">Comic Coins</Text>
            <Text className="text-4xl font-gothamBold text-white">{coins}</Text>

            <View className="mt-4 flex-row gap-3">
              <StatCard label="Lifetime" value={lifetimePoints.toString()} />
              <StatCard
                label="Activity"
                value={recentActivity.length ? recentActivity.length.toString() : "0"}
              />
            </View>

            <View className="mt-4">
              <Text className="text-sm font-gothamLight text-white">
                {nextReward
                  ? `Next reward: ${nextReward.title}`
                  : "You've unlocked every active reward."}
              </Text>
              <View className="mt-2 h-3 overflow-hidden rounded-full bg-red-800">
                <View
                  className="h-3 rounded-full bg-white"
                  style={{ width: `${progress}%` }}
                />
              </View>
              {nextReward ? (
                <Text className="mt-2 text-sm font-gothamLight text-white">
                  {nextReward.remainingCoins} coins to go
                </Text>
              ) : null}
            </View>
          </View>

          <View className="mt-5 rounded-2xl bg-white/95 p-5 shadow">
            <Text className="text-lg font-gothamBold text-neutral-900">Recent Activity</Text>
            <Text className="mt-1 font-gothamLight text-sm text-neutral-500">
              Tracking the current reward week from Sunday through Saturday.
            </Text>
            {lastUpdatedLabel ? (
              <Text className="mt-2 font-gothamMedium text-xs text-red-600">
                Updated {lastUpdatedLabel}
              </Text>
            ) : null}
          </View>
        </>
      }
      renderItem={({ item }) => (
        <View className="mt-3 rounded-2xl bg-white p-4 shadow">
          <View className="flex-row items-start justify-between">
            <View className="mr-4 flex-1">
              <Text className="text-base font-gothamMedium text-neutral-900">{item.title}</Text>
              {item.description ? (
                <Text className="mt-1 font-gothamLight text-sm leading-5 text-neutral-500">
                  {item.description}
                </Text>
              ) : null}
            </View>
            <View
              className={`rounded-full px-3 py-1 ${
                item.type === "earn" ? "bg-emerald-100" : "bg-red-100"
              }`}
            >
              <Text
                className={`font-gothamMedium text-xs ${
                  item.type === "earn" ? "text-emerald-700" : "text-red-700"
                }`}
              >
                {item.type === "earn" ? `+${item.amount}` : `-${item.amount}`} coins
              </Text>
            </View>
          </View>
          <View className="mt-3 flex-row items-center justify-between">
            <Text className="font-gothamLight text-xs text-neutral-500">
              Balance after: {item.balanceAfter}
            </Text>
            <Text className="font-gothamLight text-xs text-neutral-500">
              {formatActivityDate(item.createdAt)}
            </Text>
          </View>
        </View>
      )}
      ListEmptyComponent={
        <View className="mt-3 rounded-2xl bg-white p-5 shadow">
          <Text className="text-base font-gothamMedium text-neutral-900">
            No reward activity yet
          </Text>
          <Text className="mt-1 font-gothamLight text-sm text-neutral-500">
            Once you redeem rewards or earn fresh coins, your activity will show up here.
          </Text>
        </View>
      }
    />
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl bg-white/10 p-4">
      <Text className="text-2xl font-gothamBold text-white">{value}</Text>
      <Text className="mt-1 font-gothamLight text-xs text-red-100">{label}</Text>
    </View>
  );
}

function Earn({
  earnRules,
  refreshControl,
}: {
  earnRules: RewardEarnRule[];
  refreshControl: React.ReactElement;
}) {
  return (
    <FlatList
      data={earnRules}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={refreshControl}
      renderItem={({ item }) => (
        <View className="mb-3 flex-row items-center rounded-xl bg-white p-4 shadow">
          <Ionicons name={item.icon as never} size={28} color="red" />
          <View className="ml-4 flex-1">
            <Text className="text-lg font-gothamMedium">{item.label}</Text>
            {item.description ? (
              <Text className="mt-1 font-gothamLight text-sm text-gray-500">
                {item.description}
              </Text>
            ) : null}
            <Text className="mt-2 font-gothamMedium text-red-600">+{item.points} coins</Text>
          </View>
        </View>
      )}
    />
  );
}

function Redeem({
  coins,
  rewards,
  redeemingRewardId,
  onRedeem,
  refreshControl,
}: {
  coins: number;
  rewards: Reward[];
  redeemingRewardId: string | null;
  onRedeem: (rewardId: string) => void;
  refreshControl: React.ReactElement;
}) {
  return (
    <FlatList
      data={rewards}
      numColumns={2}
      keyExtractor={(item) => item._id ?? item.id ?? item.code ?? item.title}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={refreshControl}
      renderItem={({ item }) => {
        const rewardId = item._id ?? item.id ?? item.code ?? item.title;
        const unlocked = coins >= item.cost;
        const isRedeeming = redeemingRewardId === rewardId;

        return (
          <View className="m-2 flex-1 rounded-2xl bg-white p-4 shadow">
            <Text className="text-lg font-gothamMedium">{item.title}</Text>
            <Text className="mb-2 font-gothamLight text-gray-500">{item.cost} coins</Text>
            {item.description ? (
              <Text className="mb-3 font-gothamLight text-xs text-gray-500">
                {item.description}
              </Text>
            ) : null}

            <Pressable
              onPress={() => onRedeem(rewardId)}
              disabled={!unlocked || isRedeeming}
              className={`rounded-xl py-2 ${
                unlocked ? "bg-red-600" : "bg-gray-300"
              } ${isRedeeming ? "opacity-70" : ""}`}
            >
              <Text className="text-center font-semibold text-white">
                {isRedeeming ? "Redeeming..." : unlocked ? "Redeem" : "Locked"}
              </Text>
            </Pressable>
          </View>
        );
      }}
    />
  );
}

function Badges({
  badges,
  refreshControl,
}: {
  badges: RewardBadge[];
  refreshControl: React.ReactElement;
}) {
  return (
    <FlatList
      data={badges}
      numColumns={3}
      keyExtractor={(item) => item.title}
      contentContainerStyle={{ padding: 12 }}
      refreshControl={refreshControl}
      renderItem={({ item }) => (
        <View
          className={`m-2 flex-1 items-center rounded-xl p-4 shadow ${
            item.unlocked ?? true ? "bg-white" : "bg-gray-300"
          }`}
        >
          <Ionicons
            name="ribbon"
            size={32}
            color={item.unlocked ?? true ? "red" : "gray"}
          />
          <Text
            className={`mt-2 text-center text-sm font-gothamMedium ${
              item.unlocked ?? true ? "text-black" : "text-gray-500"
            }`}
          >
            {item.title}
          </Text>
        </View>
      )}
    />
  );
}

function formatActivityDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Just now";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatLastUpdated(value: number) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "just now";
  }

  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
}
