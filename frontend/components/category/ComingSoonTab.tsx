import { FlatList, Image, Text, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { comics } from "../../data/comics";

export default function ThisWeekTab() {
  const { categoryType } = useLocalSearchParams<{ categoryType: string }>();

  const data = comics.filter(
    (c) =>
      c.category === categoryType &&
      c.releaseWindow === "this-week"
  );

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="mb-6">
          <Image
            source={item.cover}
            className="w-full h-64 rounded-lg"
            resizeMode="contain"
          />
          <Text className="text-white mt-2 font-gothamMedium">
            {item.title}
          </Text>
        </View>
      )}
    />
  );
}
