import { View } from "react-native";

import { RecordCard, SectionTitle, StatCard } from "./AdminUi";
import type { AdminOverview, AdminSubscriptionSummary } from "./types";

export function AdminOverviewSection({ overview }: { overview: AdminOverview | undefined }) {
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
        darkText
      />
      {(overview?.topSubscriptions ?? []).map((item: AdminSubscriptionSummary) => (
        <RecordCard
          key={item._id}
          title={item.title}
          tone="highlight"
          subtitle={`${item.publisher} | ${item.subscriberCount} subscribers`}
        />
      ))}
    </View>
  );
}
