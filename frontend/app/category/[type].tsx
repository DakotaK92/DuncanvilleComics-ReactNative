import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ImageBackground,
  RefreshControl,
} from "react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocalSearchParams, Stack, router } from "expo-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";

import { ComicCard } from "@/components/ComicCard";
import StateMessage from "@/components/StateMessage";
import ToastBanner from "@/components/ToastBanner";
import { CategoryType } from "@/data/home";
import { weeklyReleases } from "@/data/weeklyComics";
import { dealsOfTheWeek } from "@/data/dealsOfTheWeek";
import { preOrders } from "@/data/preOrders";
import { gradedComics } from "@/data/gradedComics";
import { backIssues } from "@/data/backIssues";
import {
  getFriendlyApiErrorMessage,
  pullListApi,
  useApiClient,
  weeklyReleasesApi,
  wishListApi,
} from "@/utils/api";
import type { PullListItem } from "@/utils/apiTypes";

const categoryDataMap = {
  "weekly-releases": weeklyReleases,
  deals: dealsOfTheWeek,
  "pre-order": preOrders,
  graded: gradedComics,
  "back-issues": backIssues,
};

const titleMap: Record<CategoryType, string> = {
  "weekly-releases": "Weekly Releases",
  deals: "Deals of the Week",
  "pre-order": "Pre-Orders",
  graded: "CGC Graded Comics",
  "pull-list": "My Pull List",
  wishlist: "My Wish List",
  "back-issues": "Back Issues",
  "new-releases": "New To Duncanville Comics",
};

const subtitleMap: Partial<Record<CategoryType, string>> = {
  "weekly-releases": "Add books from this week's drop to your standing list.",
  "pull-list": "Your saved series, with new issues flagged the moment they land.",
  wishlist: "A saved stack of books worth chasing down next.",
  "back-issues": "Older issues and key books that just hit the wall boxes.",
  "new-releases": "Fresh picks for readers getting started with the shop.",
};

type PullListFilter = "all" | "ready";

const getHeroCardClassName = (categoryType?: CategoryType) =>
  categoryType === "weekly-releases" ||
  categoryType === "pre-order" ||
  categoryType === "deals" ||
  categoryType === "graded" ||
  categoryType === "back-issues"
    ? "mb-5 overflow-hidden rounded-2xl bg-red-600 p-5"
    : "mb-5 overflow-hidden rounded-2xl bg-neutral-900/90 p-5";

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: CategoryType }>();
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastTone, setToastTone] = useState<"success" | "error" | "info">("success");
  const [pullListFilter, setPullListFilter] = useState<PullListFilter>("all");
  const hasSeenInitialDataRef = useRef(false);

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

  const wishListQuery = useQuery({
    queryKey: ["wish-list"],
    queryFn: async () => {
      const response = await wishListApi.getAll(api);
      return response.data.items;
    },
    enabled: type === "wishlist" || type === "back-issues",
  });

  const addToPullListMutation = useMutation({
    mutationFn: (comic: { title: string; publisher: string; seriesKey: string }) =>
      pullListApi.add(api, comic),
    onSuccess: (_response, variables) => {
      setToastTone("success");
      setToastMessage(`${variables.title} added to your pull list.`);
      queryClient.invalidateQueries({ queryKey: ["pull-list"] });
    },
  });

  const removeFromPullListMutation = useMutation({
    mutationFn: (id: string) => pullListApi.remove(api, id),
    onSuccess: () => {
      setToastTone("success");
      setToastMessage("Removed from your pull list.");
      queryClient.invalidateQueries({ queryKey: ["pull-list"] });
    },
  });

  const emailStoreMutation = useMutation({
    mutationFn: (filter: PullListFilter) => pullListApi.emailStore(api, { filter }),
    onSuccess: () => {
      setToastTone("success");
      setToastMessage("Pull list emailed to the store.");
    },
    onError: (error) => {
      setToastTone("error");
      setToastMessage(getFriendlyApiErrorMessage(error));
    },
  });

  const addToWishListMutation = useMutation({
    mutationFn: (comic: {
      title: string;
      issue: number;
      publisher: string;
      price: number;
      seriesKey: string;
    }) => wishListApi.add(api, comic),
    onSuccess: (_response, variables) => {
      setToastTone("success");
      setToastMessage(`${variables.title} added to your wish list.`);
      queryClient.invalidateQueries({ queryKey: ["wish-list"] });
    },
  });

  const removeFromWishListMutation = useMutation({
    mutationFn: (id: string) => wishListApi.remove(api, id),
    onSuccess: () => {
      setToastTone("success");
      setToastMessage("Removed from your wish list.");
      queryClient.invalidateQueries({ queryKey: ["wish-list"] });
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
    if (!lastUpdatedAt || !["weekly-releases", "pull-list", "wishlist"].includes(type ?? "")) {
      return;
    }

    if (!hasSeenInitialDataRef.current) {
      hasSeenInitialDataRef.current = true;
      return;
    }

    setToastTone("info");
    setToastMessage("Updated just now.");
  }, [lastUpdatedAt, type]);

  useEffect(() => {
    if (type !== "pull-list") {
      setPullListFilter("all");
    }
  }, [type]);

  const rawData = (() => {
    if (type === "weekly-releases") return weeklyReleasesQuery.data ?? [];
    if (type === "pull-list") return pullListQuery.data ?? [];
    if (type === "wishlist") return wishListQuery.data ?? [];
    return (type && categoryDataMap[type as keyof typeof categoryDataMap]) ?? [];
  })();

  const pullListItems = useMemo(
    () => pullListQuery.data ?? [],
    [pullListQuery.data]
  );

  const readyCount = pullListItems.filter((item) => item.hasNewIssue).length;
  const pullListCount = pullListItems.length;

  const data = useMemo(() => {
    if (type !== "pull-list") {
      return rawData;
    }

    if (pullListFilter === "ready") {
      return rawData.filter((item: PullListItem) => item.hasNewIssue);
    }

    return rawData;
  }, [pullListFilter, rawData, type]);

  const isLoading =
    (type === "weekly-releases" && weeklyReleasesQuery.isPending) ||
    (type === "pull-list" && pullListQuery.isPending) ||
    (type === "wishlist" && wishListQuery.isPending);
  const categoryErrorMessage =
    type === "weekly-releases" && weeklyReleasesQuery.isError
      ? getFriendlyApiErrorMessage(weeklyReleasesQuery.error)
      : type === "pull-list" && pullListQuery.isError
        ? getFriendlyApiErrorMessage(pullListQuery.error)
        : type === "wishlist" && wishListQuery.isError
          ? getFriendlyApiErrorMessage(wishListQuery.error)
          : null;
  const isRefreshing =
    (type === "weekly-releases" && weeklyReleasesQuery.isRefetching) ||
    (type === "pull-list" && pullListQuery.isRefetching) ||
    (type === "wishlist" && wishListQuery.isRefetching);
  const lastUpdatedAt =
    type === "weekly-releases"
      ? weeklyReleasesQuery.dataUpdatedAt
      : type === "pull-list"
        ? pullListQuery.dataUpdatedAt
        : type === "wishlist"
          ? wishListQuery.dataUpdatedAt
          : 0;
  const lastUpdatedLabel = lastUpdatedAt ? formatLastUpdated(lastUpdatedAt) : null;

  const savedSeriesKeys = useMemo(
    () => new Set(pullListItems.map((item) => item.seriesKey)),
    [pullListItems]
  );

  const wishListItems = useMemo(
    () => wishListQuery.data ?? [],
    [wishListQuery.data]
  );

  const wishedSeriesKeys = useMemo(
    () => new Set(wishListItems.map((item) => item.seriesKey)),
    [wishListItems]
  );

  const handleEmailStore = () => {
    if (type !== "pull-list" || pullListItems.length === 0) {
      return;
    }

    const itemsToSend = pullListItems.filter((item) =>
      pullListFilter === "ready" ? item.hasNewIssue : true
    );

    if (itemsToSend.length === 0) {
      setToastTone("info");
      setToastMessage("There are no pull-list books in this view yet.");
      return;
    }

    emailStoreMutation.mutate(pullListFilter);
  };

  const handleRefresh = () => {
    if (type === "weekly-releases") {
      weeklyReleasesQuery.refetch();
      pullListQuery.refetch();
    } else if (type === "pull-list") {
      pullListQuery.refetch();
    } else if (type === "wishlist") {
      wishListQuery.refetch();
    }
  };

  const refreshControl = (
    <RefreshControl
      refreshing={Boolean(isRefreshing)}
      onRefresh={handleRefresh}
      tintColor="#ffffff"
    />
  );

  return (
    <>
      <Stack.Screen
        options={{
          title: type ? titleMap[type] : "",
          headerStyle: {
            backgroundColor: "#ffffff",
          },
          headerTintColor: "#111111",
          headerTitleStyle: {
            fontFamily: "Gotham-Bold",
            fontSize: 18,
            color: "#111111",
          },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-3 flex-row items-center"
            >
              <Ionicons name="chevron-back" size={22} color="#111111" />
              <Text className="font-gothamMedium text-sm text-neutral-900">Back</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >
        {toastMessage ? <ToastBanner message={toastMessage} tone={toastTone} /> : null}

        {isLoading ? (
          <View className="flex-1 justify-center px-8">
            <StateMessage
              title="Loading category"
              message="We’re pulling the latest books together for you."
              loading
            />
          </View>
        ) : categoryErrorMessage ? (
          <View className="flex-1 justify-center px-8">
            <StateMessage
              title="Category unavailable"
              message={categoryErrorMessage}
              actionLabel="Try again"
              onPressAction={() => {
                if (type === "weekly-releases") {
                  weeklyReleasesQuery.refetch();
                } else if (type === "pull-list") {
                  pullListQuery.refetch();
                } else if (type === "wishlist") {
                  wishListQuery.refetch();
                }
              }}
            />
          </View>
        ) : type === "pull-list" && pullListCount === 0 ? (
          <FlatList
            data={[]}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            refreshControl={refreshControl}
            ListHeaderComponent={
              <View className={getHeroCardClassName(type)}>
                <Text className="font-gothamBold text-3xl text-white">
                  {type ? titleMap[type] : ""}
                </Text>
                <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
                  {subtitleMap[type]}
                </Text>
                {lastUpdatedLabel ? (
                  <Text className="mt-2 font-gothamMedium text-xs text-red-100">
                    Updated {lastUpdatedLabel}
                  </Text>
                ) : null}
                <View className="mt-5 flex-row gap-3">
                  <MetricCard label="Saved series" value={pullListCount.toString()} />
                  <MetricCard label="Ready this week" value={readyCount.toString()} />
                </View>
              </View>
            }
            ListEmptyComponent={
              <View className="items-center rounded-2xl bg-neutral-900/90 px-6 py-10">
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
                  className="mt-4 rounded-xl bg-red-600 px-5 py-2.5"
                >
                  <Text className="font-gothamMedium text-white">Browse weekly releases</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : type === "wishlist" && wishListItems.length === 0 ? (
          <FlatList
            data={[]}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            refreshControl={refreshControl}
            ListHeaderComponent={
              <View className={getHeroCardClassName(type)}>
                <Text className="font-gothamBold text-3xl text-white">
                  {type ? titleMap[type] : ""}
                </Text>
                <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
                  {subtitleMap[type]}
                </Text>
                {lastUpdatedLabel ? (
                  <Text className="mt-2 font-gothamMedium text-xs text-red-100">
                    Updated {lastUpdatedLabel}
                  </Text>
                ) : null}
              </View>
            }
            ListEmptyComponent={
              <View className="items-center rounded-2xl bg-neutral-900/90 px-6 py-10">
                <View className="rounded-full bg-red-600/20 p-4">
                  <Ionicons name="heart" size={28} color="#f87171" />
                </View>
                <Text className="mt-4 font-gothamBold text-xl text-white">
                  Your wish list is empty
                </Text>
                <Text className="mt-2 text-center font-gothamLight text-sm leading-5 text-neutral-300">
                  Save books from Back Issues and they&apos;ll stay here until you&apos;re ready to
                  track them down.
                </Text>
                <TouchableOpacity
                  onPress={() => router.push("/category/back-issues")}
                  className="mt-4 rounded-xl bg-red-600 px-5 py-2.5"
                >
                  <Text className="font-gothamMedium text-white">Browse back issues</Text>
                </TouchableOpacity>
              </View>
            }
          />
        ) : rawData.length === 0 ? (
          <View className="flex-1 items-center justify-center px-8">
            <View className="items-center rounded-2xl bg-neutral-900/90 px-6 py-10">
              <View className="rounded-full bg-white/10 p-4">
                <Ionicons name="storefront-outline" size={28} color="#d4d4d8" />
              </View>
              <Text className="mt-4 font-gothamBold text-xl text-white">Coming soon</Text>
              <Text className="mt-2 text-center font-gothamLight text-sm leading-5 text-neutral-300">
                This section is on its way. Check back after the next update.
              </Text>
            </View>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={(item) => item.id?.toString?.() ?? item.seriesKey}
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            refreshControl={refreshControl}
            ListHeaderComponent={
              <View className={getHeroCardClassName(type)}>
                <Text className="font-gothamBold text-3xl text-white">
                  {type ? titleMap[type] : ""}
                </Text>

                {type && subtitleMap[type] ? (
                  <Text className="mt-2 font-gothamLight text-sm leading-5 text-neutral-300">
                    {subtitleMap[type]}
                  </Text>
                ) : null}
                {lastUpdatedLabel ? (
                  <Text className="mt-2 font-gothamMedium text-xs text-red-100">
                    Updated {lastUpdatedLabel}
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

                    <TouchableOpacity
                      onPress={handleEmailStore}
                      disabled={emailStoreMutation.isPending}
                      className={`mt-4 flex-row items-center justify-center rounded-xl px-4 py-3 ${
                        emailStoreMutation.isPending ? "bg-red-500/70" : "bg-red-600"
                      }`}
                    >
                      <Ionicons name="mail" size={18} color="#ffffff" />
                      <Text className="ml-2 font-gothamMedium text-sm text-white">
                        {emailStoreMutation.isPending
                          ? "Sending..."
                          : pullListFilter === "ready"
                            ? "Email store this week's pull"
                            : "Email store my pull list"}
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : null}
              </View>
            }
            ListEmptyComponent={
              type === "pull-list" && pullListFilter === "ready" ? (
                <View className="items-center rounded-2xl bg-neutral-900/90 px-6 py-10">
                  <View className="rounded-full bg-white/10 p-4">
                    <Ionicons name="checkmark-done" size={28} color="#d4d4d8" />
                  </View>
                  <Text className="mt-4 font-gothamBold text-xl text-white">
                    Nothing ready this week
                  </Text>
                  <Text className="mt-2 text-center font-gothamLight text-sm leading-5 text-neutral-300">
                    Your saved series are quiet right now. Switch back to all titles to review the
                    full list.
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
              const wishAddPending =
                addToWishListMutation.isPending &&
                addToWishListMutation.variables?.seriesKey === itemSeriesKey;
              const wishRemovePending =
                removeFromWishListMutation.isPending &&
                removeFromWishListMutation.variables === item.id.toString();

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
                      : type === "back-issues"
                        ? wishAddPending
                          ? "Saving..."
                          : wishedSeriesKeys.has(itemSeriesKey)
                            ? "Saved"
                            : "Add to wish list"
                      : undefined
                  }
                  actionDisabled={
                    type === "weekly-releases"
                      ? addPending || alreadySaved
                      : type === "back-issues"
                        ? wishAddPending || wishedSeriesKeys.has(itemSeriesKey)
                        : undefined
                  }
                  onPressAction={
                    type === "weekly-releases"
                      ? () =>
                          addToPullListMutation.mutate({
                            title: item.title,
                            publisher: item.publisher,
                            seriesKey: itemSeriesKey,
                          })
                      : type === "back-issues"
                        ? () =>
                            addToWishListMutation.mutate({
                              title: item.title,
                              issue: item.issue,
                              publisher: item.publisher,
                              price: item.price,
                              seriesKey: itemSeriesKey,
                            })
                      : undefined
                  }
                  secondaryActionLabel={
                    type === "pull-list"
                      ? removePending
                        ? "Removing..."
                        : "Remove"
                      : type === "wishlist"
                        ? wishRemovePending
                          ? "Removing..."
                          : "Remove"
                        : undefined
                  }
                  secondaryActionDisabled={
                    type === "pull-list"
                      ? removePending
                      : type === "wishlist"
                        ? wishRemovePending
                        : undefined
                  }
                  onPressSecondaryAction={
                    type === "pull-list"
                      ? () => removeFromPullListMutation.mutate(item.id.toString())
                      : type === "wishlist"
                        ? () => removeFromWishListMutation.mutate(item.id.toString())
                      : undefined
                  }
                />
              );
            }}
          />
        )}
      </ImageBackground>
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
