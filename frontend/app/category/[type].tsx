import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from "react-native";
import { useEffect, useMemo, useState } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { ComicCard } from "@/components/ComicCard";
import { CategoryType } from "@/data/home";
import { weeklyReleases } from "@/data/weeklyComics";
import { dealsOfTheWeek } from "@/data/dealsOfTheWeek";
import { preOrders } from "@/data/preOrders";
import { gradedComics } from "@/data/gradedComics";
import { pullListApi, useApiClient, weeklyReleasesApi } from "@/utils/api";

const categoryDataMap = {
  "weekly-releases": weeklyReleases,
  deals: dealsOfTheWeek,
  "pre-order": preOrders,
  graded: gradedComics,
};

const titleMap: Record<CategoryType, string> = {
  "weekly-releases": "Weekly Releases",
  deals: "Deals of the Week",
  "pre-order": "Pre-Orders",
  graded: "CGC Graded Comics",
  "pull-list": "My Pull List",
  wishlist: "My Wish List",
  "back-issues": "Back Issues",
  "new-releases": "New Releases",
};

const subtitleMap: Partial<Record<CategoryType, string>> = {
  "weekly-releases": "Add books from this week's drop to your standing list.",
  "pull-list": "Your saved series, with new issues flagged the moment they land.",
};

type PullListFilter = "all" | "ready";

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: CategoryType }>();
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pullListFilter, setPullListFilter] = useState<PullListFilter>("all");

  const weeklyReleasesQuery = useQuery({
    queryKey: ["weekly-releases"],
    queryFn: async () => {
      const response = await weeklyReleasesApi.getAll(api);
      return response.data.releases;
    },
    enabled: type === "weekly-releases",
  });

  const pullListQuery = useQuery({
    queryKey: ["pull-list"],
    queryFn: async () => {
      const response = await pullListApi.getAll(api);
      return response.data.items;
    },
    enabled: type === "pull-list" || type === "weekly-releases",
  });

  const addToPullListMutation = useMutation({
    mutationFn: (comic: { title: string; publisher: string; seriesKey: string }) =>
      pullListApi.add(api, comic),
    onSuccess: (_response, variables) => {
      setToastMessage(`${variables.title} added to your pull list.`);
      queryClient.invalidateQueries({ queryKey: ["pull-list"] });
    },
  });

  const removeFromPullListMutation = useMutation({
    mutationFn: (id: string) => pullListApi.remove(api, id),
    onSuccess: () => {
      setToastMessage("Removed from your pull list.");
      queryClient.invalidateQueries({ queryKey: ["pull-list"] });
    },
  });

  useEffect(() => {
    if (!toastMessage) {
      return;
    }

    const timeout = setTimeout(() => setToastMessage(null), 2200);
    return () => clearTimeout(timeout);
  }, [toastMessage]);

  useEffect(() => {
    if (type !== "pull-list") {
      setPullListFilter("all");
    }
  }, [type]);

  const rawData = (() => {
    if (type === "weekly-releases") return weeklyReleasesQuery.data ?? [];
    if (type === "pull-list") return pullListQuery.data ?? [];
    return (type && categoryDataMap[type as keyof typeof categoryDataMap]) ?? [];
  })();

  const pullListItems = useMemo(
    () => (pullListQuery.data ?? []) as { hasNewIssue?: boolean; seriesKey: string }[],
    [pullListQuery.data]
  );

  const readyCount = pullListItems.filter((item) => item.hasNewIssue).length;
  const pullListCount = pullListItems.length;

  const data = useMemo(() => {
    if (type !== "pull-list") {
      return rawData;
    }

    if (pullListFilter === "ready") {
      return rawData.filter((item: { hasNewIssue?: boolean }) => item.hasNewIssue);
    }

    return rawData;
  }, [pullListFilter, rawData, type]);

  const isLoading =
    (type === "weekly-releases" && weeklyReleasesQuery.isPending) ||
    (type === "pull-list" && pullListQuery.isPending);

  const savedSeriesKeys = useMemo(
    () => new Set(pullListItems.map((item) => item.seriesKey)),
    [pullListItems]
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: type ? titleMap[type] : "",
          headerStyle: {
            backgroundColor: "#0a0a0a",
          },
          headerTintColor: "#ffffff",
          headerTitleStyle: {
            fontFamily: "Gotham-Bold",
            fontSize: 18,
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 flex-row items-center"
            >
              <Ionicons name="chevron-back" size={22} color="#ffffff" />
              <Text className="font-gothamMedium text-sm text-white">Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {toastMessage ? (
        <View className="absolute left-4 right-4 top-4 z-20 rounded-xl bg-emerald-600 px-4 py-3 shadow">
          <Text className="font-gothamMedium text-center text-sm text-white">
            {toastMessage}
          </Text>
        </View>
      ) : null}

      {isLoading ? (
        <View className="flex-1 items-center justify-center bg-neutral-950">
          <ActivityIndicator color="#ffffff" />
          <Text className="mt-3 font-gothamMedium text-base text-white">Loading...</Text>
        </View>
      ) : type === "pull-list" && pullListCount === 0 ? (
        <FlatList
          data={[]}
          className="bg-neutral-950"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            <View className="mb-5 overflow-hidden rounded-2xl bg-neutral-900 p-5">
              <Text className="font-gothamBold text-3xl text-white">
                {type ? titleMap[type] : ""}
              </Text>
              <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
                {subtitleMap[type]}
              </Text>
              <View className="mt-5 flex-row gap-3">
                <MetricCard label="Saved series" value={pullListCount.toString()} />
                <MetricCard label="Ready this week" value={readyCount.toString()} />
              </View>
            </View>
          }
          ListEmptyComponent={
            <View className="items-center rounded-2xl bg-neutral-900 px-6 py-10">
              <View className="rounded-full bg-red-600/20 p-4">
                <Ionicons name="bookmarks" size={28} color="#f87171" />
              </View>
              <Text className="mt-4 font-gothamBold text-xl text-white">
                Your pull list is empty
              </Text>
              <Text className="mt-2 text-center font-gothamLight text-sm leading-5 text-neutral-300">
                Add titles from Weekly Releases and they&apos;ll show up here with new issues flagged.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/category/weekly-releases")}
                className="mt-4 rounded-md bg-red-600 px-4 py-2"
              >
                <Text className="font-gothamMedium text-white">Browse weekly releases</Text>
              </TouchableOpacity>
            </View>
          }
        />
      ) : rawData.length === 0 ? (
        <View className="flex-1 items-center justify-center bg-neutral-950 px-8">
          <Text className="font-gothamBold text-xl text-white">Category coming soon</Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id?.toString?.() ?? item.seriesKey}
          className="bg-neutral-950"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
          ListHeaderComponent={
            <View className="mb-5 overflow-hidden rounded-2xl bg-neutral-900 p-5">
              <Text className="font-gothamBold text-3xl text-white">
                {type ? titleMap[type] : ""}
              </Text>

              {type && subtitleMap[type] ? (
                <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
                  {subtitleMap[type]}
                </Text>
              ) : null}

              {type === "pull-list" ? (
                <>
                  <View className="mt-5 flex-row gap-3">
                    <MetricCard label="Saved series" value={pullListCount.toString()} />
                    <MetricCard label="Ready this week" value={readyCount.toString()} />
                  </View>

                  <View className="mt-4 flex-row gap-2">
                    <FilterChip
                      label={`All (${pullListCount})`}
                      active={pullListFilter === "all"}
                      onPress={() => setPullListFilter("all")}
                    />
                    <FilterChip
                      label={`Ready This Week (${readyCount})`}
                      active={pullListFilter === "ready"}
                      onPress={() => setPullListFilter("ready")}
                    />
                  </View>
                </>
              ) : null}
            </View>
          }
          ListEmptyComponent={
            type === "pull-list" && pullListFilter === "ready" ? (
              <View className="items-center rounded-2xl bg-neutral-900 px-6 py-10">
                <View className="rounded-full bg-white/10 p-4">
                  <Ionicons name="checkmark-done" size={28} color="#d4d4d8" />
                </View>
                <Text className="mt-4 font-gothamBold text-xl text-white">
                  Nothing ready this week
                </Text>
                <Text className="mt-2 text-center font-gothamLight text-sm leading-5 text-neutral-300">
                  Your saved series are quiet right now. Switch back to all titles to review the full list.
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const itemSeriesKey =
              item.seriesKey || item.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
            const alreadySaved = savedSeriesKeys.has(itemSeriesKey);
            const addPending =
              addToPullListMutation.isPending &&
              addToPullListMutation.variables?.seriesKey === itemSeriesKey;
            const removePending =
              removeFromPullListMutation.isPending &&
              removeFromPullListMutation.variables === item.id.toString();

            return (
              <ComicCard
                comic={item}
                accentLabel={
                  type === "weekly-releases"
                    ? "This week"
                    : item.hasNewIssue
                      ? "Ready"
                      : undefined
                }
                actionLabel={
                  type === "weekly-releases"
                    ? addPending
                      ? "Saving..."
                      : alreadySaved
                        ? "Added"
                        : "Add to pull list"
                    : undefined
                }
                actionDisabled={type === "weekly-releases" ? addPending || alreadySaved : undefined}
                onPressAction={
                  type === "weekly-releases"
                    ? () =>
                        addToPullListMutation.mutate({
                          title: item.title,
                          publisher: item.publisher,
                          seriesKey: itemSeriesKey,
                        })
                    : undefined
                }
                secondaryActionLabel={
                  type === "pull-list" ? (removePending ? "Removing..." : "Remove") : undefined
                }
                secondaryActionDisabled={type === "pull-list" ? removePending : undefined}
                onPressSecondaryAction={
                  type === "pull-list"
                    ? () => removeFromPullListMutation.mutate(item.id.toString())
                    : undefined
                }
              />
            );
          }}
        />
      )}
    </>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl bg-white/5 p-4">
      <Text className="font-gothamBold text-2xl text-white">{value}</Text>
      <Text className="mt-1 font-gothamLight text-xs text-neutral-300">{label}</Text>
    </View>
  );
}

function FilterChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`rounded-full px-4 py-2 ${
        active ? "bg-red-600" : "bg-white/5"
      }`}
    >
      <Text
        className={`font-gothamMedium text-sm ${
          active ? "text-white" : "text-neutral-300"
        }`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}
