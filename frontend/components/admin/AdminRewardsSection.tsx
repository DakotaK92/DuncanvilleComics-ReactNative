import type { Dispatch, SetStateAction } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import {
  Field,
  FilterChip,
  PrimaryButton,
  RecordCard,
  SecondaryButton,
  SectionTitle,
} from "./AdminUi";
import type { AdminReward, RewardFilter, RewardFormState } from "./types";

export function AdminRewardsSection({
  editingRewardId,
  rewardForm,
  emptyRewardForm,
  rewardMutationPending,
  rewardSearch,
  rewardFilter,
  filteredRewards,
  setRewardForm,
  setEditingRewardId,
  setRewardSearch,
  setRewardFilter,
  onSubmit,
  onDelete,
}: {
  editingRewardId: string | null;
  rewardForm: RewardFormState;
  emptyRewardForm: RewardFormState;
  rewardMutationPending: boolean;
  rewardSearch: string;
  rewardFilter: RewardFilter;
  filteredRewards: AdminReward[];
  setRewardForm: Dispatch<SetStateAction<RewardFormState>>;
  setEditingRewardId: Dispatch<SetStateAction<string | null>>;
  setRewardSearch: Dispatch<SetStateAction<string>>;
  setRewardFilter: Dispatch<SetStateAction<RewardFilter>>;
  onSubmit: () => void;
  onDelete: (id: string) => void;
}) {
  return (
    <View className="gap-4">
      <SectionTitle
        title={editingRewardId ? "Edit Reward" : "Add Reward"}
        subtitle="Keep your reward catalog current and easy to redeem."
        lightPanel
      />
      <View className="gap-3">
        <Field
          label="Title"
          value={rewardForm.title}
          darkLabel
          onChangeText={(value) => setRewardForm((current) => ({ ...current, title: value }))}
        />
        <Field
          label="Description"
          value={rewardForm.description}
          darkLabel
          multiline
          onChangeText={(value) =>
            setRewardForm((current) => ({ ...current, description: value }))
          }
        />
        <Field
          label="Cost"
          value={rewardForm.cost}
          keyboardType="numeric"
          darkLabel
          onChangeText={(value) => setRewardForm((current) => ({ ...current, cost: value }))}
        />
        <Field
          label="Code"
          value={rewardForm.code}
          darkLabel
          onChangeText={(value) => setRewardForm((current) => ({ ...current, code: value }))}
        />
        <View className="flex-row items-center justify-between rounded-xl bg-white/5 px-4 py-3">
          <Text className="rounded-lg bg-white p-2 font-gothamMedium text-sm text-red-600">
            Active reward
          </Text>
          <TouchableOpacity
            onPress={() => setRewardForm((current) => ({ ...current, active: !current.active }))}
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
            rewardMutationPending
              ? "Saving..."
              : editingRewardId
                ? "Update reward"
                : "Create reward"
          }
          onPress={onSubmit}
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
      <Field
        label="Search rewards"
        value={rewardSearch}
        darkLabel
        onChangeText={setRewardSearch}
      />
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
        lightPanel
      />
      {filteredRewards.map((reward: AdminReward) => (
        <RecordCard
          key={reward.id}
          title={`${reward.title} â€¢ ${reward.cost} coins`}
          subtitle={`${reward.active ? "Active" : "Inactive"} â€¢ ${
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
          }}
          secondaryActionLabel="Delete"
          onPressSecondaryAction={() =>
            Alert.alert("Delete reward", `Remove ${reward.title}?`, [
              { text: "Cancel", style: "cancel" },
              {
                text: "Delete",
                style: "destructive",
                onPress: () => onDelete(reward.id),
              },
            ])
          }
        />
      ))}
    </View>
  );
}
