import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { adminApi, getApiErrorMessage, useApiClient } from "../utils/api";

type AdminView = "overview" | "releases" | "rewards" | "customers" | "titles";
type RewardFilter = "all" | "active" | "inactive";

type ReleaseFormState = {
  title: string;
  issue: string;
  publisher: string;
  price: string;
  releaseDate: string;
  coverImageUrl: string;
  seriesKey: string;
};

type RewardFormState = {
  title: string;
  description: string;
  cost: string;
  code: string;
  active: boolean;
};

type EarnRule = {
  id: string;
  label: string;
  points: number;
  description?: string;
};

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

  const overviewQuery = useQuery({
    queryKey: ["admin-overview"],
    queryFn: async () => (await adminApi.getOverview(api)).data,
  });

  const releasesQuery = useQuery({
    queryKey: ["admin-weekly-releases"],
    queryFn: async () => (await adminApi.getWeeklyReleases(api)).data.releases,
  });

  const rewardsQuery = useQuery({
    queryKey: ["admin-rewards"],
    queryFn: async () => (await adminApi.getRewards(api)).data.rewards,
  });

  const usersQuery = useQuery({
    queryKey: ["admin-users"],
    queryFn: async () => (await adminApi.getUsers(api)).data.users,
  });

  const earnRulesQuery = useQuery({
    queryKey: ["admin-earn-rules"],
    queryFn: async () => (await adminApi.getEarnRules(api)).data.earnRules as EarnRule[],
  });

  const subscriptionsQuery = useQuery({
    queryKey: ["admin-subscriptions"],
    queryFn: async () => (await adminApi.getSubscriptions(api)).data.subscriptions,
  });

  const userPullListQuery = useQuery({
    queryKey: ["admin-user-pull-list", selectedUserId],
    queryFn: async () => (await adminApi.getUserPullList(api, selectedUserId!)).data,
    enabled: Boolean(selectedUserId),
  });

  const rewardActivityQuery = useQuery({
    queryKey: ["admin-user-reward-activity", selectedUserId],
    queryFn: async () => (await adminApi.getUserRewardActivity(api, selectedUserId!)).data,
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
      setNotice("Reward points awarded.");
      setAdjustmentNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
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
      setNotice(editingReleaseId ? "Weekly release updated." : "Weekly release created.");
      setEditingReleaseId(null);
      setReleaseForm(emptyReleaseForm);
      queryClient.invalidateQueries({ queryKey: ["admin-weekly-releases"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
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
      setNotice(editingRewardId ? "Reward updated." : "Reward created.");
      setEditingRewardId(null);
      setRewardForm(emptyRewardForm);
      queryClient.invalidateQueries({ queryKey: ["admin-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
  });

  const deleteReleaseMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteWeeklyRelease(api, id),
    onSuccess: () => {
      setNotice("Weekly release deleted.");
      if (editingReleaseId) {
        setEditingReleaseId(null);
        setReleaseForm(emptyReleaseForm);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-weekly-releases"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
  });

  const deleteRewardMutation = useMutation({
    mutationFn: (id: string) => adminApi.deleteReward(api, id),
    onSuccess: () => {
      setNotice("Reward deleted.");
      if (editingRewardId) {
        setEditingRewardId(null);
        setRewardForm(emptyRewardForm);
      }
      queryClient.invalidateQueries({ queryKey: ["admin-rewards"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
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
      setNotice("Customer coin balance updated.");
      setAdjustmentAmount("");
      setAdjustmentNote("");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
      queryClient.invalidateQueries({ queryKey: ["admin-overview"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
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
      setNotice("Reward activity updated.");
      queryClient.invalidateQueries({ queryKey: ["admin-user-reward-activity", selectedUserId] });
      queryClient.invalidateQueries({ queryKey: ["rewards-summary"] });
    },
    onError: (error) => setNotice(getApiErrorMessage(error)),
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

  const selectedUser = useMemo(
    () => usersQuery.data?.find((user: { _id: string }) => user._id === selectedUserId),
    [selectedUserId, usersQuery.data]
  );

  const selectedUserRewardSummary = rewardActivityQuery.data?.user;
  const earnRules = earnRulesQuery.data ?? [];
  const selectedEarnRule = earnRules.find((rule) => rule.id === selectedEarnRuleId) ?? null;

  const filteredReleases = useMemo(() => {
    const needle = releaseSearch.trim().toLowerCase();
    if (!needle) return releasesQuery.data ?? [];

    return (releasesQuery.data ?? []).filter((release: any) =>
      [release.title, release.publisher, release.seriesKey].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [releaseSearch, releasesQuery.data]);

  const filteredRewards = useMemo(() => {
    const needle = rewardSearch.trim().toLowerCase();
    return (rewardsQuery.data ?? []).filter((reward: any) => {
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

    return (usersQuery.data ?? []).filter((user: any) =>
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

    return (subscriptionsQuery.data ?? []).filter((item: any) =>
      [item.title, item.publisher, item._id].some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(needle)
      )
    );
  }, [subscriptionsQuery.data, titleSearch]);

  if (
    overviewQuery.isPending ||
    releasesQuery.isPending ||
    rewardsQuery.isPending ||
    usersQuery.isPending ||
    subscriptionsQuery.isPending
  ) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator color="#ffffff" />
        <Text className="mt-3 font-gothamMedium text-white">Loading admin tools...</Text>
      </View>
    );
  }

  if (isForbidden) {
    return (
      <View className="flex-1 items-center justify-center px-8">
        <Text className="font-gothamBold text-2xl text-white">Admin access required</Text>
        <Text className="mt-3 text-center font-gothamLight text-sm leading-5 text-black">
          Add your account email to `ADMIN_EMAILS` in the backend environment if you want to lock
          this down outside local development.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {notice ? (
        <View className="mx-4 mt-4 rounded-xl bg-emerald-600 px-4 py-3">
          <Text className="text-center font-gothamMedium text-sm text-white">{notice}</Text>
        </View>
      ) : null}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 36 }}
        showsVerticalScrollIndicator={false}
      >
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
              className={`rounded-full px-4 py-2 ${
                activeView === key ? "bg-red-600" : "bg-white"
              }`}
            >
              <Text
                className={`font-gothamMedium text-sm ${
                  activeView === key ? "text-white" : "text-red-600"
                }`}
              >
                {label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {activeView === "overview" ? <OverviewSection overview={overviewQuery.data} /> : null}

        {activeView === "releases" ? (
          <View className="gap-4">
            <SectionTitle
              title={editingReleaseId ? "Edit Weekly Release" : "Add Weekly Release"}
              subtitle="Create, update, or remove the books customers can add to their pull lists."
            />
            <View className="gap-3">
              <Field
                label="Title"
                value={releaseForm.title}
                onChangeText={(value) => setReleaseForm((current) => ({ ...current, title: value }))}
              />
              <Field
                label="Issue"
                value={releaseForm.issue}
                keyboardType="numeric"
                onChangeText={(value) => setReleaseForm((current) => ({ ...current, issue: value }))}
              />
              <Field
                label="Publisher"
                value={releaseForm.publisher}
                onChangeText={(value) =>
                  setReleaseForm((current) => ({ ...current, publisher: value }))
                }
              />
              <Field
                label="Price"
                value={releaseForm.price}
                keyboardType="decimal-pad"
                onChangeText={(value) => setReleaseForm((current) => ({ ...current, price: value }))}
              />
              <Field
                label="Release Date (YYYY-MM-DD)"
                value={releaseForm.releaseDate}
                onChangeText={(value) =>
                  setReleaseForm((current) => ({ ...current, releaseDate: value }))
                }
              />
              <Field
                label="Series Key"
                value={releaseForm.seriesKey}
                onChangeText={(value) =>
                  setReleaseForm((current) => ({ ...current, seriesKey: value }))
                }
              />
              <Field
                label="Cover Image URL"
                value={releaseForm.coverImageUrl}
                onChangeText={(value) =>
                  setReleaseForm((current) => ({ ...current, coverImageUrl: value }))
                }
              />
            </View>
            <View className="flex-row gap-2">
              <PrimaryButton
                label={
                  releaseMutation.isPending
                    ? "Saving..."
                    : editingReleaseId
                      ? "Update release"
                      : "Create release"
                }
                onPress={() => releaseMutation.mutate()}
              />
              {(editingReleaseId || releaseForm.title) && (
                <SecondaryButton
                  label="Clear"
                  onPress={() => {
                    setEditingReleaseId(null);
                    setReleaseForm(emptyReleaseForm);
                  }}
                />
              )}
            </View>
            <Field label="Search releases" value={releaseSearch} onChangeText={setReleaseSearch} />
            <SectionTitle
              title="Current Weekly Releases"
              subtitle={`${filteredReleases.length} matching books`}
            />
            {filteredReleases.map((release: any) => (
              <RecordCard
                key={release.id}
                title={`${release.title} #${release.issue}`}
                subtitle={`${release.publisher} • $${Number(release.price).toFixed(2)} • ${String(
                  release.releaseDate
                ).slice(0, 10)}`}
                actionLabel="Edit"
                onPressAction={() => {
                  setEditingReleaseId(release.id);
                  setReleaseForm({
                    title: release.title,
                    issue: String(release.issue),
                    publisher: release.publisher,
                    price: String(release.price),
                    releaseDate: String(release.releaseDate).slice(0, 10),
                    coverImageUrl: release.coverImageUrl || "",
                    seriesKey: release.seriesKey || "",
                  });
                  setActiveView("releases");
                }}
                secondaryActionLabel="Delete"
                onPressSecondaryAction={() =>
                  Alert.alert("Delete release", `Remove ${release.title} #${release.issue}?`, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteReleaseMutation.mutate(release.id),
                    },
                  ])
                }
              />
            ))}
          </View>
        ) : null}

        {activeView === "rewards" ? (
          <View className="gap-4">
            <SectionTitle
              title={editingRewardId ? "Edit Reward" : "Add Reward"}
              subtitle="Keep your reward catalog current and easy to redeem."
            />
            <View className="gap-3">
              <Field
                label="Title"
                value={rewardForm.title}
                onChangeText={(value) => setRewardForm((current) => ({ ...current, title: value }))}
              />
              <Field
                label="Description"
                value={rewardForm.description}
                onChangeText={(value) =>
                  setRewardForm((current) => ({ ...current, description: value }))
                }
                multiline
              />
              <Field
                label="Cost"
                value={rewardForm.cost}
                keyboardType="numeric"
                onChangeText={(value) => setRewardForm((current) => ({ ...current, cost: value }))}
              />
              <Field
                label="Code"
                value={rewardForm.code}
                onChangeText={(value) => setRewardForm((current) => ({ ...current, code: value }))}
              />
              <View className="flex-row items-center justify-between rounded-xl bg-white/5 px-4 py-3">
                <Text className="rounded-lg bg-white p-2 font-gothamMedium text-sm text-red-600">
                  Active reward
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    setRewardForm((current) => ({ ...current, active: !current.active }))
                  }
                  className={`rounded-full px-4 py-2 ${
                    rewardForm.active ? "bg-emerald-600" : "bg-white/10"
                  }`}
                >
                  <Text className="font-gothamMedium text-sm text-white">
                    {rewardForm.active ? "Active" : "Inactive"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View className="flex-row gap-2">
              <PrimaryButton
                label={
                  rewardMutation.isPending
                    ? "Saving..."
                    : editingRewardId
                      ? "Update reward"
                      : "Create reward"
                }
                onPress={() => rewardMutation.mutate()}
              />
              {(editingRewardId || rewardForm.title) && (
                <SecondaryButton
                  label="Clear"
                  onPress={() => {
                    setEditingRewardId(null);
                    setRewardForm(emptyRewardForm);
                  }}
                />
              )}
            </View>
            <Field label="Search rewards" value={rewardSearch} onChangeText={setRewardSearch} />
            <View className="flex-row gap-2">
              <FilterChip
                label="All"
                active={rewardFilter === "all"}
                onPress={() => setRewardFilter("all")}
              />
              <FilterChip
                label="Active"
                active={rewardFilter === "active"}
                onPress={() => setRewardFilter("active")}
              />
              <FilterChip
                label="Inactive"
                active={rewardFilter === "inactive"}
                onPress={() => setRewardFilter("inactive")}
              />
            </View>
            <SectionTitle
              title="Reward Catalog"
              subtitle={`${filteredRewards.length} matching rewards`}
            />
            {filteredRewards.map((reward: any) => (
              <RecordCard
                key={reward.id}
                title={`${reward.title} • ${reward.cost} coins`}
                subtitle={`${reward.active ? "Active" : "Inactive"} • ${
                  reward.description || "No description"
                }`}
                actionLabel="Edit"
                onPressAction={() => {
                  setEditingRewardId(reward.id);
                  setRewardForm({
                    title: reward.title,
                    description: reward.description || "",
                    cost: String(reward.cost),
                    code: reward.code || "",
                    active: Boolean(reward.active),
                  });
                  setActiveView("rewards");
                }}
                secondaryActionLabel="Delete"
                onPressSecondaryAction={() =>
                  Alert.alert("Delete reward", `Remove ${reward.title}?`, [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Delete",
                      style: "destructive",
                      onPress: () => deleteRewardMutation.mutate(reward.id),
                    },
                  ])
                }
              />
            ))}
          </View>
        ) : null}

        {activeView === "customers" ? (
          <View className="gap-4">
            <SectionTitle
              title="Customers"
              subtitle="Inspect pull lists, reward balances, and activity by customer."
            />
            <Field
              label="Search customers"
              value={customerSearch}
              onChangeText={setCustomerSearch}
            />
            {filteredUsers.map((user: any) => (
              <RecordCard
                key={user._id}
                title={
                  user.email ||
                  `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
                  "Unnamed user"
                }
                subtitle={`${user.pullListCount} pull-list titles • ${user.rewardPoints} coins`}
                actionLabel={selectedUserId === user._id ? "Selected" : "Open"}
                onPressAction={() => setSelectedUserId(user._id)}
              />
            ))}

            {selectedUser ? (
              <View className="gap-3 pt-2">
                <SectionTitle
                  title={`Pull List • ${selectedUser.email || "Customer"}`}
                  subtitle={`${userPullListQuery.data?.items?.length ?? 0} active titles`}
                />
                <View className="rounded-xl bg-white/5 p-4">
                  <Text className="font-gothamBold text-base text-white">Rewards Wallet</Text>
                  <Text className="mt-1 font-gothamLight text-sm text-neutral-300">
                    Current coins: {selectedUserRewardSummary?.rewardPoints ?? selectedUser.rewardPoints}
                    {"  "}•{"  "}Lifetime: {selectedUserRewardSummary?.lifetimePoints ?? selectedUser.lifetimePoints}
                  </Text>
                  <View className="mt-4 gap-3">
                    <View>
                      <Text className="mb-2 font-gothamMedium text-sm text-neutral-200">
                        Award preset earn action
                      </Text>
                      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <View className="flex-row gap-2">
                          {earnRules.map((rule) => (
                            <FilterChip
                              key={rule.id}
                              label={`${rule.label} (+${rule.points})`}
                              active={selectedEarnRuleId === rule.id}
                              onPress={() => setSelectedEarnRuleId(rule.id)}
                            />
                          ))}
                        </View>
                      </ScrollView>
                    </View>
                    {selectedEarnRule ? (
                      <View className="rounded-xl bg-white/10 p-3">
                        <Text className="font-gothamMedium text-sm text-white">
                          {selectedEarnRule.label}
                        </Text>
                        <Text className="mt-1 font-gothamLight text-xs text-neutral-300">
                          {selectedEarnRule.description}
                        </Text>
                      </View>
                    ) : null}
                    <PrimaryButton
                      label={
                        awardRewardMutation.isPending ? "Awarding..." : "Award selected action"
                      }
                      onPress={() => awardRewardMutation.mutate()}
                      disabled={!selectedEarnRuleId}
                    />
                    <Field
                      label="Adjust coins (+ or -)"
                      value={adjustmentAmount}
                      onChangeText={setAdjustmentAmount}
                    />
                    <Field
                      label="Adjustment note"
                      value={adjustmentNote}
                      onChangeText={setAdjustmentNote}
                      multiline
                    />
                    <PrimaryButton
                      label={
                        rewardAdjustmentMutation.isPending
                          ? "Saving..."
                          : "Apply coin adjustment"
                      }
                      onPress={() => rewardAdjustmentMutation.mutate()}
                    />
                  </View>
                </View>
                {userPullListQuery.isPending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  (userPullListQuery.data?.items ?? []).map((item: any) => (
                    <RecordCard
                      key={item._id}
                      title={item.title}
                      subtitle={`${item.publisher} • ${item.seriesKey}`}
                    />
                  ))
                )}
                <SectionTitle
                  title="Reward Activity"
                  subtitle={`${rewardActivityQuery.data?.activity?.length ?? 0} recent entries`}
                />
                {rewardActivityQuery.isPending ? (
                  <ActivityIndicator color="#ffffff" />
                ) : (
                  (rewardActivityQuery.data?.activity ?? []).map((item: any) => (
                    <RecordCard
                      key={item.id}
                      title={`${item.type === "earn" ? "+" : "-"}${item.amount} • ${item.title}`}
                      subtitle={`${item.description || "No note"} • ${formatRewardStatus(item.status)} • Balance ${item.balanceAfter} • ${formatAdminDate(item.createdAt)}`}
                      actionLabel={
                        item.type === "redeem" && item.status === "pending"
                          ? rewardStatusMutation.isPending &&
                            rewardStatusMutation.variables?.activityId === item.id
                            ? "Saving..."
                            : "Mark fulfilled"
                          : undefined
                      }
                      onPressAction={
                        item.type === "redeem" && item.status === "pending"
                          ? () =>
                              rewardStatusMutation.mutate({
                                activityId: item.id,
                                status: "fulfilled",
                              })
                          : undefined
                      }
                    />
                  ))
                )}
              </View>
            ) : null}
          </View>
        ) : null}

        {activeView === "titles" ? (
          <View className="gap-4">
            <SectionTitle
              title="Most Subscribed Titles"
              subtitle="This helps you spot what people consistently want reserved."
            />
            <Field label="Search titles" value={titleSearch} onChangeText={setTitleSearch} />
            {filteredSubscriptions.map((item: any, index: number) => (
              <RecordCard
                key={item._id}
                title={`${index + 1}. ${item.title}`}
                subtitle={`${item.publisher} • ${item.subscriberCount} subscribers`}
              />
            ))}
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}

function OverviewSection({ overview }: { overview: any }) {
  return (
    <View className="gap-4">
      <View className="flex-row flex-wrap gap-3">
        <StatCard label="Users" value={String(overview?.stats?.users ?? 0)} />
        <StatCard label="Weekly Releases" value={String(overview?.stats?.weeklyReleases ?? 0)} />
        <StatCard label="Rewards" value={String(overview?.stats?.rewards ?? 0)} />
        <StatCard
          label="Active Pulls"
          value={String(overview?.stats?.activePullListSubscriptions ?? 0)}
        />
      </View>

      <SectionTitle
        title="Top Subscriptions"
        subtitle="Fast read on what your store should keep stocked."
      />
      {(overview?.topSubscriptions ?? []).map((item: any) => (
        <RecordCard
          key={item._id}
          title={item.title}
          subtitle={`${item.publisher} • ${item.subscriberCount} subscribers`}
        />
      ))}
    </View>
  );
}

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <View>
      <Text className="font-gothamBold text-xl text-black">{title}</Text>
      {subtitle ? (
        <Text className="mt-1 font-gothamLight text-sm text-black">{subtitle}</Text>
      ) : null}
    </View>
  );
}

function Field({
  label,
  value,
  onChangeText,
  keyboardType,
  multiline,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  keyboardType?: "default" | "numeric" | "decimal-pad";
  multiline?: boolean;
}) {
  return (
    <View>
      <Text className="mb-2 font-gothamMedium text-sm text-neutral-200">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType ?? "default"}
        multiline={multiline}
        placeholder={label}
        placeholderTextColor="#737373"
        className={`rounded-xl bg-white px-4 py-3 text-neutral-900 ${
          multiline ? "min-h-[96px]" : ""
        }`}
        textAlignVertical={multiline ? "top" : "center"}
      />
    </View>
  );
}

function PrimaryButton({
  label,
  onPress,
  disabled,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      className={`rounded-xl px-4 py-3 ${disabled ? "bg-red-400" : "bg-red-600"}`}
    >
      <Text className="font-gothamMedium text-white">{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} className="rounded-xl border border-white/20 px-4 py-3">
      <Text className="font-gothamMedium text-neutral-200">{label}</Text>
    </TouchableOpacity>
  );
}

function RecordCard({
  title,
  subtitle,
  actionLabel,
  onPressAction,
  secondaryActionLabel,
  onPressSecondaryAction,
}: {
  title: string;
  subtitle: string;
  actionLabel?: string;
  onPressAction?: () => void;
  secondaryActionLabel?: string;
  onPressSecondaryAction?: () => void;
}) {
  return (
    <View className="rounded-xl bg-white/5 p-4">
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1">
          <Text className="font-gothamBold text-base text-white">{title}</Text>
          <Text className="mt-1 font-gothamLight text-sm text-neutral-300">{subtitle}</Text>
        </View>

        <View className="flex-row gap-2">
          {actionLabel && onPressAction ? (
            <TouchableOpacity
              onPress={onPressAction}
              className="rounded-full bg-white/10 px-3 py-2"
            >
              <Text className="font-gothamMedium text-xs text-white">{actionLabel}</Text>
            </TouchableOpacity>
          ) : null}

          {secondaryActionLabel && onPressSecondaryAction ? (
            <TouchableOpacity
              onPress={onPressSecondaryAction}
              className="rounded-full bg-red-600/20 px-3 py-2"
            >
              <Text className="font-gothamMedium text-xs text-red-300">
                {secondaryActionLabel}
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    </View>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-[46%] flex-1 rounded-xl bg-white/5 p-4">
      <Text className="font-gothamBold text-3xl text-white">{value}</Text>
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
      className={`rounded-full px-4 py-2 ${active ? "bg-red-600" : "bg-white/10"}`}
    >
      <Text
        className={`font-gothamMedium text-sm ${active ? "text-white" : "text-neutral-300"}`}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unknown date";
  }

  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

function formatRewardStatus(status?: string) {
  switch (status) {
    case "pending":
      return "Pending fulfillment";
    case "fulfilled":
      return "Fulfilled";
    default:
      return "Completed";
  }
}
