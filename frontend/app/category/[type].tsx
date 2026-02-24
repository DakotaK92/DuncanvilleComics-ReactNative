import { View, Text, FlatList } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";

import { ComicCard } from "@/components/ComicCard";
import { CategoryType } from "@/data/home";

import { weeklyReleases } from "@/data/weeklyComics";
import { dealsOfTheWeek } from "@/data/dealsOfTheWeek";
import { preOrders } from "@/data/preOrders";
import { gradedComics } from "@/data/gradedComics";

const categoryDataMap = {
  "weekly-releases": weeklyReleases,
  "deals": dealsOfTheWeek,
  "pre-order": preOrders,
  "graded": gradedComics,
};

const titleMap: Record<CategoryType, string> = {
  "weekly-releases": "Weekly Releases",
  "deals": "Deals of the Week",
  "pre-order": "Pre-Orders",
  "graded": "CGC Graded Comics",
  "pull-list": "My Pull List",
  "wishlist": "My Wish List",
  "back-issues": "Back Issues",
};

export default function CategoryScreen() {
  const { type } = useLocalSearchParams<{ type: CategoryType }>();

  const data =
    type && categoryDataMap[type as keyof typeof categoryDataMap];

  return (
    <>
      <Stack.Screen
        options={{
          title: type ? titleMap[type] : "",
        }}
      />

      {!data ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg font-semibold">
            Category coming soon
          </Text>
        </View>
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          renderItem={({ item }) => (
            <ComicCard comic={item} />
          )}
        />
      )}
    </>
  );
}
