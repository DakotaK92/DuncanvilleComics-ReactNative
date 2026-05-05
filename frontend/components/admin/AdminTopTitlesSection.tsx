import type { Dispatch, SetStateAction } from "react";
import { View } from "react-native";

import { Field, RecordCard, SectionTitle } from "./AdminUi";
import type { AdminSubscriptionSummary } from "./types";

export function AdminTopTitlesSection({
  titleSearch,
  filteredSubscriptions,
  setTitleSearch,
}: {
  titleSearch: string;
  filteredSubscriptions: AdminSubscriptionSummary[];
  setTitleSearch: Dispatch<SetStateAction<string>>;
}) {
  return (
    <View className="gap-4">
      <SectionTitle
        title="Most Subscribed Titles"
        subtitle="This helps you spot what people consistently want reserved."
        darkText
      />
      <Field
        label="Search titles"
        value={titleSearch}
        darkLabel
        onChangeText={setTitleSearch}
      />
      {filteredSubscriptions.map((item: AdminSubscriptionSummary, index: number) => (
        <RecordCard
          key={item._id}
          tone="highlight"
          title={`${index + 1}. ${item.title}`}
          subtitle={`${item.publisher} â€¢ ${item.subscriberCount} subscribers`}
        />
      ))}
    </View>
  );
}
