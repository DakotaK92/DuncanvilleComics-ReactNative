import { useEffect, useMemo, useRef, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminApi,
  getApiErrorMessage,
  getFriendlyApiErrorMessage,
  useApiClient,
} from "../utils/api";
import { AdminCustomersSection } from "./admin/AdminCustomersSection";
import { AdminOverviewSection } from "./admin/AdminOverviewSection";
import { AdminReleasesSection } from "./admin/AdminReleasesSection";
import { AdminRewardsSection } from "./admin/AdminRewardsSection";
import { AdminTopTitlesSection } from "./admin/AdminTopTitlesSection";
import StateMessage from "./StateMessage";
import ToastBanner from "./ToastBanner";
import type {
  AdminOverview,
  AdminReward,
  AdminRewardActivityResponse,
  AdminSubscriptionSummary,
  AdminUser,
  AdminUserPullListResponse,
  AdminWeeklyRelease,
  EarnRule,
  ReleaseFormState,
  RewardFilter,
  RewardFormState,
} from "./admin/types";

type AdminView = "overview" | "releases" | "rewards" | "customers" | "titles";

const emptyReleaseForm: ReleaseFormState = {
  title: "",
  issue: "",
  publisher: "",
  price: "",
  releaseDate: "",
  coverImageUrl: "",
  seriesKey: "",
};

const emptyRewardForm: RewardFormState = {
  title: "",
  description: "",
  cost: "",
  code: "",
  active: true,
};

export default function AdminScreen() {
  const api = useApiClient();
  const queryClient = useQueryClient();
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [notice, setNotice] = useState<string | null>(null);
  const [noticeTone, setNoticeTone] = useState<"success" | "error" | "info">("success");
  const [editingReleaseId, setEditingReleaseId] = useState<string | null>(null);
  const [editingRewardId, setEditingRewardId] = useState<string | null>(null);
  const [releaseForm, setReleaseForm] = useState<ReleaseFormState>(emptyReleaseForm);
  const [rewardForm, setRewardForm] = useState<RewardFormState>(emptyRewardForm);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [releaseSearch, setReleaseSearch] = useState("");
  const [rewardSearch, setRewardSearch] = useState("");
  const [customerSearch, setCustomerSearch] = useState("");
  const [titleSearch, setTitleSearch] = useState("");
  const [rewardFilter, setRewardFilter] = useState<RewardFilter>("all");
  const [selectedEarnRuleId, setSelectedEarnRuleId] = useState("");
  const [adjustmentAmount, setAdjustmentAmount] = useState("");
  const [adjustmentNote, setAdjustmentNote] = useState("");
  const hasSeenInitialSectionDataRef = useRef(false);

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await adminApi.getOverview(api)).data as AdminOverview,
  });

  const releasesQuery = useQuery({
    queryKey: ["admin-weekly-releases"],
    queryFn: async () =>
      (await adminApi.getWeeklyReleases(api)).data.releases as AdminWeeklyRelease[],
  });

  const rewardsQuery = useQuery({
    queryKey: ["admin-rewards"],
    queryFn: async () => (await adminApi.getRewards(api)).data.rewards as AdminReward[],
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers(api)).data.users as AdminUser[],
  });

  const earnRulesQuery = useQuery({
    queryKey: ["admin-earn-rules"],
    queryFn: async () => (await adminApi.getEarnRules(api)).data.earnRules as EarnRule[],
  });

  const subscriptionsQuery = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () =>
      (await adminApi.getSubscriptions(api)).data.subscriptions as AdminSubscriptionSummary[],
  });

  const userPullListQuery = useQuery({
    queryKey: ["admin-user-pull-list", selectedUserId],
    queryFn: async () =>
      (await adminApi.getUserPullList(api, selectedUserId!)).data as AdminUserPullListResponse,
    enabled: Boolean(selectedUserId),
  });

  const rewardActivityQuery = useQuery({
    queryKey: ["admin-user-reward-activity", selectedUserId],
    queryFn: async () =>
      (await adminApi.getUserRewardActivity(api, selectedUserId!)).data as AdminRewardActivityResponse,
    enabled: Boolean(selectedUserId),
  });

  const awardRewardMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId) {
        throw new Error("Select a customer first.");
      }

      if (!selectedEarnRuleId) {
        throw new Error("Choose an earn action first.");
      }

      return adminApi.awardUserRewardPoints(api, selectedUserId, {
        earnRuleId: selectedEarnRuleId,
        note: adjustmentNote.trim(),
      });
    },
    onSuccess: () => {
      setNoticeTone("success");
      setNotice("Reward points awarded.");
      setAdjustmentNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const releaseMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...releaseForm,
        issue: Number(releaseForm.issue),
        price: Number(releaseForm.price),
      };

      if (editingReleaseId) {
        return adminApi.updateWeeklyRelease(api, editingReleaseId, payload);
      }

      return adminApi.createWeeklyRelease(api, payload);
    },
    onSuccess: () => {
      setNoticeTone("success");
      setNotice(editingReleaseId ? "Weekly release updated." : "Weekly release created.");
      setEditingReleaseId(null);
      setReleaseForm(emptyReleaseForm);
      queryClient.invalidateQueries({ queryKey: ["admin-weekly-releases"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const rewardMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        ...rewardForm,
        cost: Number(rewardForm.cost),
      };

      if (editingRewardId) {
        return adminApi.updateReward(api, editingRewardId, payload);
      }

      return adminApi.createReward(api, payload);
    },
    onSuccess: () => {
      setNoticeTone("success");
      setNotice(editingRewardId ? "Reward updated." : "Reward created.");
      setEditingRewardId(null);
      setRewardForm(emptyRewardForm);
      queryClient.invalidateQueries({ queryKey: ["admin-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteWeeklyRelease(api, id),
    onSuccess: () => {
      setNoticeTone("success");
      setNotice("Weekly release deleted.");
      if (editingReleaseId) {
        setEditingReleaseId(null);
        setReleaseForm(emptyReleaseForm);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-weekly-releases"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteReward(api, id),
    onSuccess: () => {
      setNoticeTone("success");
      setNotice("Reward deleted.");
      if (editingRewardId) {
        setEditingRewardId(null);
        setRewardForm(emptyRewardForm);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const rewardAdjustmentMutation = useMutation({
    mutationFn: async () => {
      if (!selectedUserId) {
        throw new Error("Select a customer first.");
      }

      return adminApi.adjustUserRewardPoints(api, selectedUserId, {
        amount: Number(adjustmentAmount),
        note: adjustmentNote.trim(),
      });
    },
    onSuccess: () => {
      setNoticeTone("success");
      setNotice("Customer coin balance updated.");
      setAdjustmentAmount("");
      setAdjustmentNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  const rewardStatusMutation = useMutation({
    mutationFn: async ({
      activityId,
      status,
    }: {
      activityId: string;
      status: "pending" | "fulfilled" | "completed";
    }) => adminApi.updateRewardActivityStatus(api, activityId, { status }),
    onSuccess: () => {
      setNoticeTone("success");
      setNotice("Reward activity updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
    },
    onError: (error) => {
      setNoticeTone("error");
      setNotice(getFriendlyApiErrorMessage(error));
    },
  });

  useEffect(() => {
    if (!notice) {
      return;
    }

    const timeout = setTimeout(() => setNotice(null), 2500);
    return () => clearTimeout(timeout);
  }, [notice]);

  useEffect(() => {
    const firstUserId = usersQuery.data?.[0]?._id;

    if (!selectedUserId && firstUserId) {
      setSelectedUserId(firstUserId);
    }
  }, [selectedUserId, usersQuery.data]);

  const isForbidden = [
    overviewQuery,
    releasesQuery,
    rewardsQuery,
    usersQuery,
    subscriptionsQuery,
  ].some((query) => getApiErrorMessage(query.error).includes("admin access"));
  const adminErrorMessage = [
    overviewQuery.error,
    releasesQuery.error,
    rewardsQuery.error,
    usersQuery.error,
    subscriptionsQuery.error,
  ]
    .map((error) => (error ? getFriendlyApiErrorMessage(error) : null))
    .find(Boolean);

  const selectedUser = useMemo(
    () => usersQuery.data?.find((user) => user._id === selectedUserId),
    [selectedUserId, usersQuery.data]
  );

  const selectedUserRewardSummary = rewardActivityQuery.data?.user;
  const earnRules = earnRulesQuery.data ?? [];
  const selectedEarnRule = earnRules.find((rule) => rule.id === selectedEarnRuleId) ?? null;

  const filteredReleases = useMemo(() => {
    const needle = releaseSearch.trim().toLowerCase();
    if (!needle) return releasesQuery.data ?? [];

    return (releasesQuery.data ?? []).filter((release) =>
      [release.title, release.publisher, release.seriesKey].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [releaseSearch, releasesQuery.data]);

  const filteredRewards = useMemo(() => {
    const needle = rewardSearch.trim().toLowerCase();
    return (rewardsQuery.data ?? []).filter((reward) => {
      const matchesText =
        !needle ||
        [reward.title, reward.description, reward.code].some((value) =>
          String(value ?? "")
            .toLowerCase()
            .includes(needle)
        );
      const matchesFilter =
        rewardFilter === "all" ||
        (rewardFilter === "active" && reward.active) ||
        (rewardFilter === "inactive" && !reward.active);

      return matchesText && matchesFilter;
    });
  }, [rewardFilter, rewardSearch, rewardsQuery.data]);

  const filteredUsers = useMemo(() => {
    const needle = customerSearch.trim().toLowerCase();
    if (!needle) return usersQuery.data ?? [];

    return (usersQuery.data ?? []).filter((user) =>
      [user.email, user.firstName, user.lastName].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [customerSearch, usersQuery.data]);

  const filteredSubscriptions = useMemo(() => {
    const needle = titleSearch.trim().toLowerCase();
    if (!needle) return subscriptionsQuery.data ?? [];

    return (subscriptionsQuery.data ?? []).filter((item) =>
      [item.title, item.publisher, item._id].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [subscriptionsQuery.data, titleSearch]);
  const activeDataUpdatedAt =
    activeView === "overview"
      ? overviewQuery.dataUpdatedAt
      : activeView === "releases"
        ? releasesQuery.dataUpdatedAt
        : activeView === "rewards"
          ? rewardsQuery.dataUpdatedAt
          : activeView === "customers"
            ? Math.max(
                usersQuery.dataUpdatedAt || 0,
                userPullListQuery.dataUpdatedAt || 0,
                rewardActivityQuery.dataUpdatedAt || 0,
                earnRulesQuery.dataUpdatedAt || 0
              )
            : subscriptionsQuery.dataUpdatedAt;
  const lastUpdatedLabel = activeDataUpdatedAt
    ? formatLastUpdated(activeDataUpdatedAt)
    : null;
  const isRefreshing =
    (activeView === "overview" && overviewQuery.isRefetching) ||
    (activeView === "releases" && releasesQuery.isRefetching) ||
    (activeView === "rewards" && rewardsQuery.isRefetching) ||
    (activeView === "customers" &&
      (usersQuery.isRefetching ||
        userPullListQuery.isRefetching ||
        rewardActivityQuery.isRefetching ||
        earnRulesQuery.isRefetching)) ||
    (activeView === "titles" && subscriptionsQuery.isRefetching);

  useEffect(() => {
    if (!activeDataUpdatedAt) {
      return;
    }

    if (!hasSeenInitialSectionDataRef.current) {
      hasSeenInitialSectionDataRef.current = true;
      return;
    }

    setNoticeTone("info");
    setNotice("Admin data updated just now.");
  }, [activeDataUpdatedAt]);

  const handleRefresh = () => {
    switch (activeView) {
      case "overview":
        overviewQuery.refetch();
        break;
      case "releases":
        releasesQuery.refetch();
        break;
      case "rewards":
        rewardsQuery.refetch();
        break;
      case "customers":
        usersQuery.refetch();
        earnRulesQuery.refetch();
        if (selectedUserId) {
          userPullListQuery.refetch();
          rewardActivityQuery.refetch();
        }
        break;
      case "titles":
        subscriptionsQuery.refetch();
        break;
    }
  };

  if (
    overviewQuery.isPending ||
    releasesQuery.isPending ||
    rewardsQuery.isPending ||
    usersQuery.isPending ||
    subscriptionsQuery.isPending
  ) {
    return (
      <View className="flex-1 justify-center px-6">
        <StateMessage
          title="Loading admin tools"
          message="We’re gathering the latest store data now."
          loading
          light
        />
      </View>
    );
  }

  if (adminErrorMessage && !isForbidden) {
    return (
      <View className="flex-1 justify-center px-6">
        <StateMessage
          title="Admin tools unavailable"
          message={adminErrorMessage}
          actionLabel="Try again"
          onPressAction={() => {
            overviewQuery.refetch();
            releasesQuery.refetch();
            rewardsQuery.refetch();
            usersQuery.refetch();
            subscriptionsQuery.refetch();
          }}
          light
        />
      </View>
    );
  }

  if (isForbidden) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-gothamBold text-2xl text-black">Admin access required</Text>
        <Text className="mt-3 text-center font-gothamLight text-sm leading-5 text-black">
          Add your account email to `ADMIN_EMAILS` in the backend environment if you want to lock
          this down outside local development.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {notice ? <ToastBanner message={notice} tone={noticeTone} /> : null}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={Boolean(isRefreshing)}
            onRefresh={handleRefresh}
            tintColor="#dc2626"
          />
        }
      >
        <View className="mb-4">
          <Text className="h-12 rounded bg-red-600 px-4 text-center font-gothamBold text-xl leading-[48px] text-white">
            STORE ADMIN
          </Text>
          <View className="mt-3 self-start rounded-full bg-emerald-600/90 px-3 py-2">
            <Text className="font-gothamMedium text-xs text-white">Admin access active</Text>
          </View>
          {lastUpdatedLabel ? (
            <Text className="mt-2 font-gothamMedium text-xs text-red-100">
              Updated {lastUpdatedLabel}
            </Text>
          ) : null}
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 16, gap: 8 }}
        >
          {[
            ["overview", "Overview"],
            ["releases", "Weekly Releases"],
            ["rewards", "Rewards"],
            ["customers", "Customers"],
            ["titles", "Top Titles"],
          ].map(([key, label]) => (
            <TouchableOpacity
              key={key}
              onPress={() => setActiveView(key as AdminView)}
              className={`rounded-full border px-4 py-2 ${
                activeView === key
                  ? "border-red-600 bg-red-600"
                  : "border-white/15 bg-white/95"
              }`}
            >
              <Text
                className={`font-gothamMedium text-sm ${
                  activeView === key ? "text-white" : "text-red-700"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeView === "overview" ? <AdminOverviewSection overview={overviewQuery.data} /> : null}

        {activeView === "releases" ? (
          <AdminReleasesSection
            editingReleaseId={editingReleaseId}
            releaseForm={releaseForm}
            emptyReleaseForm={emptyReleaseForm}
            releaseMutationPending={releaseMutation.isPending}
            releaseSearch={releaseSearch}
            filteredReleases={filteredReleases}
            setReleaseForm={setReleaseForm}
            setEditingReleaseId={setEditingReleaseId}
            setReleaseSearch={setReleaseSearch}
            onSubmit={() => releaseMutation.mutate()}
            onDelete={(id) => deleteReleaseMutation.mutate(id)}
          />
        ) : null}

        {activeView === "rewards" ? (
          <AdminRewardsSection
            editingRewardId={editingRewardId}
            rewardForm={rewardForm}
            emptyRewardForm={emptyRewardForm}
            rewardMutationPending={rewardMutation.isPending}
            rewardSearch={rewardSearch}
            rewardFilter={rewardFilter}
            filteredRewards={filteredRewards}
            setRewardForm={setRewardForm}
            setEditingRewardId={setEditingRewardId}
            setRewardSearch={setRewardSearch}
            setRewardFilter={setRewardFilter}
            onSubmit={() => rewardMutation.mutate()}
            onDelete={(id) => deleteRewardMutation.mutate(id)}
          />
        ) : null}

        {activeView === "customers" ? (
          <AdminCustomersSection
            customerSearch={customerSearch}
            filteredUsers={filteredUsers}
            selectedUserId={selectedUserId}
            setCustomerSearch={setCustomerSearch}
            setSelectedUserId={setSelectedUserId}
            selectedUser={selectedUser}
            selectedUserRewardSummary={selectedUserRewardSummary}
            userPullListQuery={userPullListQuery}
            rewardActivityQuery={rewardActivityQuery}
            earnRules={earnRules}
            selectedEarnRuleId={selectedEarnRuleId}
            selectedEarnRule={selectedEarnRule}
            setSelectedEarnRuleId={setSelectedEarnRuleId}
            awardRewardPending={awardRewardMutation.isPending}
            onAwardReward={() => awardRewardMutation.mutate()}
            adjustmentAmount={adjustmentAmount}
            adjustmentNote={adjustmentNote}
            setAdjustmentAmount={setAdjustmentAmount}
            setAdjustmentNote={setAdjustmentNote}
            rewardAdjustmentPending={rewardAdjustmentMutation.isPending}
            onAdjustRewards={() => rewardAdjustmentMutation.mutate()}
            rewardStatusPendingId={rewardStatusMutation.variables?.activityId}
            onMarkRewardFulfilled={(activityId) =>
              rewardStatusMutation.mutate({
                activityId,
                status: "fulfilled",
              })
            }
          />
        ) : null}

        {activeView === "titles" ? (
          <AdminTopTitlesSection
            titleSearch={titleSearch}
            filteredSubscriptions={filteredSubscriptions}
            setTitleSearch={setTitleSearch}
          />
        ) : null}
      </ScrollView>
    </View>
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


