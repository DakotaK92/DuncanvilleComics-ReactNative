import type { Dispatch, SetStateAction } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

import {
  Field,
  FilterChip,
  PrimaryButton,
  RecordCard,
  SectionTitle,
  formatAdminDate,
  formatRewardStatus,
} from "./AdminUi";

type EarnRule = {
  id: string;
  label: string;
  points: number;
  description?: string;
};

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
  filteredUsers: any[];
  selectedUserId: string | null;
  setCustomerSearch: Dispatch<SetStateAction<string>>;
  setSelectedUserId: Dispatch<SetStateAction<string | null>>;
  selectedUser: any;
  selectedUserRewardSummary: any;
  userPullListQuery: { isPending: boolean; data?: { items?: any[] } };
  rewardActivityQuery: { isPending: boolean; data?: { activity?: any[] } };
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
      {filteredUsers.map((user: any) => (
        <RecordCard
          key={user._id}
          tone="highlight"
          title={
            user.email || `${user.firstName || ""} ${user.lastName || ""}`.trim() || "Unnamed user"
          }
          subtitle={`${user.pullListCount} pull-list titles â€¢ ${user.rewardPoints} coins`}
          actionLabel={selectedUserId === user._id ? "Selected" : "Open"}
          onPressAction={() => setSelectedUserId(user._id)}
        />
      ))}

      {selectedUser ? (
        <View className="gap-3 pt-2">
          <SectionTitle
            title={`Pull List â€¢ ${selectedUser.email || "Customer"}`}
            subtitle={`${userPullListQuery.data?.items?.length ?? 0} active titles`}
            darkText
          />
          <View className="rounded-xl bg-white/5 p-4">
            <Text className="font-gothamBold text-base text-black">Rewards Wallet</Text>
            <Text className="mt-1 font-gothamLight text-sm text-black">
              Current coins: {selectedUserRewardSummary?.rewardPoints ?? selectedUser.rewardPoints}
              {"  "}â€¢{"  "}Lifetime:{" "}
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
            <ActivityIndicator color="#000000" />
          ) : (
            (userPullListQuery.data?.items ?? []).map((item: any) => (
              <RecordCard
                key={item._id}
                tone="highlight"
                title={item.title}
                subtitle={`${item.publisher} â€¢ ${item.seriesKey}`}
              />
            ))
          )}
          <SectionTitle
            title="Reward Activity"
            subtitle={`${rewardActivityQuery.data?.activity?.length ?? 0} recent entries`}
            darkText
          />
          {rewardActivityQuery.isPending ? (
            <ActivityIndicator color="#000000" />
          ) : (
            (rewardActivityQuery.data?.activity ?? []).map((item: any) => (
              <RecordCard
                key={item.id}
                tone="highlight"
                title={`${item.type === "earn" ? "+" : "-"}${item.amount} â€¢ ${item.title}`}
                subtitle={`${item.description || "No note"} â€¢ ${formatRewardStatus(
                  item.status
                )} â€¢ Balance ${item.balanceAfter} â€¢ ${formatAdminDate(item.createdAt)}`}
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
          )}
        </View>
      ) : null}
    </View>
  );
}
