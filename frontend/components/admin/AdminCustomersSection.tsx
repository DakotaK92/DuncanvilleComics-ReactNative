import type { Dispatch, SetStateAction } from "react";
import { ScrollView, Text, View } from "react-native";
import { getFriendlyApiErrorMessage } from "../../utils/api";
import StateMessage from "../StateMessage";

import {
  Field,
  FilterChip,
  PrimaryButton,
  RecordCard,
  SectionTitle,
  formatAdminDate,
  formatRewardStatus,
} from "./AdminUi";
import type {
  AdminPullListItem,
  AdminRewardActivityItem,
  AdminRewardActivityResponse,
  AdminRewardActivityUserSummary,
  AdminUser,
  EarnRule,
} from "./types";

export function AdminCustomersSection({
  customerSearch,
  filteredUsers,
  selectedUserId,
  setCustomerSearch,
  setSelectedUserId,
  selectedUser,
  selectedUserRewardSummary,
  userPullListQuery,
  rewardActivityQuery,
  earnRules,
  selectedEarnRuleId,
  selectedEarnRule,
  setSelectedEarnRuleId,
  awardRewardPending,
  onAwardReward,
  adjustmentAmount,
  adjustmentNote,
  setAdjustmentAmount,
  setAdjustmentNote,
  rewardAdjustmentPending,
  onAdjustRewards,
  rewardStatusPendingId,
  onMarkRewardFulfilled,
}: {
  customerSearch: string;
  filteredUsers: AdminUser[];
  selectedUserId: string | null;
  setCustomerSearch: Dispatch<SetStateAction<string>>;
  setSelectedUserId: Dispatch<SetStateAction<string | null>>;
  selectedUser: AdminUser | undefined;
  selectedUserRewardSummary: AdminRewardActivityUserSummary | undefined;
  userPullListQuery: {
    isPending: boolean;
    isError?: boolean;
    error?: unknown;
    data?: { items?: AdminPullListItem[] };
    refetch: () => void;
  };
  rewardActivityQuery: {
    isPending: boolean;
    isError?: boolean;
    error?: unknown;
    data?: AdminRewardActivityResponse;
    refetch: () => void;
  };
  earnRules: EarnRule[];
  selectedEarnRuleId: string;
  selectedEarnRule: EarnRule | null;
  setSelectedEarnRuleId: Dispatch<SetStateAction<string>>;
  awardRewardPending: boolean;
  onAwardReward: () => void;
  adjustmentAmount: string;
  adjustmentNote: string;
  setAdjustmentAmount: Dispatch<SetStateAction<string>>;
  setAdjustmentNote: Dispatch<SetStateAction<string>>;
  rewardAdjustmentPending: boolean;
  onAdjustRewards: () => void;
  rewardStatusPendingId?: string;
  onMarkRewardFulfilled: (activityId: string) => void;
}) {
  return (
    <View className="gap-4">
      <SectionTitle
        title="Customers"
        subtitle="Inspect pull lists, reward balances, and activity by customer."
        darkText
      />
      <Field
        label="Search customers"
        value={customerSearch}
        darkLabel
        onChangeText={setCustomerSearch}
      />
      {filteredUsers.map((user: AdminUser) => (
        <RecordCard
          key={user._id}
          tone="highlight"
          title={
            user.email || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed user"
          }
          subtitle={`${user.pullListCount} pull-list titles | ${user.rewardPoints} coins`}
          actionLabel={selectedUserId === user._id ? "Selected" : "Open"}
          onPressAction={() => setSelectedUserId(user._id)}
        />
      ))}

      {selectedUser ? (
        <View className="gap-3 pt-2">
          <SectionTitle
            title={`Pull List | ${selectedUser.email || "Customer"}`}
            subtitle={`${userPullListQuery.data?.items?.length ?? 0} active titles`}
            darkText
          />
          <View className="rounded-xl bg-white/5 p-4">
            <Text className="font-gothamBold text-base text-black">Rewards Wallet</Text>
            <Text className="mt-1 font-gothamLight text-sm text-black">
              Current coins: {selectedUserRewardSummary?.rewardPoints ?? selectedUser.rewardPoints}
              {"  "} | {"  "}Lifetime:{" "}
              {selectedUserRewardSummary?.lifetimePoints ?? selectedUser.lifetimePoints}
            </Text>
            <View className="mt-4 gap-3">
              <View>
                <Text className="mb-2 font-gothamMedium text-sm text-black">
                  Award preset earn action
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View className="flex-row gap-2">
                    {earnRules.map((rule) => (
                      <FilterChip
                        key={rule.id}
                        label={`${rule.label} (+${rule.points})`}
                        active={selectedEarnRuleId === rule.id}
                        variant="accent"
                        onPress={() => setSelectedEarnRuleId(rule.id)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
              {selectedEarnRule ? (
                <View className="rounded-xl bg-white/10 p-3">
                  <Text className="font-gothamMedium text-sm text-black">
                    {selectedEarnRule.label}
                  </Text>
                  <Text className="mt-1 font-gothamLight text-xs text-black">
                    {selectedEarnRule.description}
                  </Text>
                </View>
              ) : null}
              <PrimaryButton
                label={awardRewardPending ? "Awarding..." : "Award selected action"}
                onPress={onAwardReward}
                disabled={!selectedEarnRuleId}
              />
              <Field
                label="Adjust coins (+ or -)"
                value={adjustmentAmount}
                darkLabel
                onChangeText={setAdjustmentAmount}
              />
              <Field
                label="Adjustment note"
                value={adjustmentNote}
                darkLabel
                onChangeText={setAdjustmentNote}
                multiline
              />
              <PrimaryButton
                label={rewardAdjustmentPending ? "Saving..." : "Apply coin adjustment"}
                onPress={onAdjustRewards}
              />
            </View>
          </View>
          {userPullListQuery.isPending ? (
            <StateMessage
              title="Loading pull list"
              message="We’re gathering this customer’s saved titles."
              loading
              light
            />
          ) : userPullListQuery.isError ? (
            <StateMessage
              title="Pull list unavailable"
              message={getFriendlyApiErrorMessage(userPullListQuery.error)}
              actionLabel="Try again"
              onPressAction={userPullListQuery.refetch}
              light
            />
          ) : (userPullListQuery.data?.items ?? []).length ? (
            (userPullListQuery.data?.items ?? []).map((item: AdminPullListItem) => (
              <RecordCard
                key={item._id}
                tone="highlight"
                title={item.title}
                subtitle={`${item.publisher} | ${item.seriesKey}`}
              />
            ))
          ) : (
            <StateMessage
              title="No pull-list titles yet"
              message="This customer hasn't saved any recurring titles yet."
              light
            />
          )}
          <SectionTitle
            title="Reward Activity"
            subtitle={`${rewardActivityQuery.data?.activity?.length ?? 0} recent entries`}
            darkText
          />
          {rewardActivityQuery.isPending ? (
            <StateMessage
              title="Loading reward activity"
              message="We’re gathering recent earning and redemption activity."
              loading
              light
            />
          ) : rewardActivityQuery.isError ? (
            <StateMessage
              title="Reward activity unavailable"
              message={getFriendlyApiErrorMessage(rewardActivityQuery.error)}
              actionLabel="Try again"
              onPressAction={rewardActivityQuery.refetch}
              light
            />
          ) : (rewardActivityQuery.data?.activity ?? []).length ? (
            (rewardActivityQuery.data?.activity ?? []).map((item: AdminRewardActivityItem) => (
              <RecordCard
                key={item.id}
                tone="highlight"
                title={`${item.type === "earn" ? "+" : "-"}${item.amount} | ${item.title}`}
                subtitle={`${item.description || "No note"} | ${formatRewardStatus(
                  item.status
                )} | Balance ${item.balanceAfter} | ${formatAdminDate(item.createdAt)}`}
                actionLabel={
                  item.type === "redeem" && item.status === "pending"
                    ? rewardStatusPendingId === item.id
                      ? "Saving..."
                      : "Mark fulfilled"
                    : undefined
                }
                onPressAction={
                  item.type === "redeem" && item.status === "pending"
                    ? () => onMarkRewardFulfilled(item.id)
                    : undefined
                }
              />
            ))
          ) : (
            <StateMessage
              title="No reward activity yet"
              message="This customer doesn't have any recent reward entries yet."
              light
            />
          )}
        </View>
      ) : null}
    </View>
  );
}
