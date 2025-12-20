import { View, Text } from "react-native";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CategoryScreen() {
  const { title, type } = useLocalSearchParams();

  return (
    <>
      <Stack.Screen
        options={{
          presentation: "formSheet", // 👈 iOS bottom sheet
          headerShown: true,
          title: title as string,
        }}
      />

      <View className="flex-1 bg-neutral-900 p-6">
        <Text className="text-white text-2xl font-gothamMedium">
          {title}
        </Text>

        <Text className="text-gray-400 mt-2">
          Category: {type}
        </Text>
      </View>
    </>
  );
}
