import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { messages } from "@/data/home";

export default function CategoriesScreen() {
  return (
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() =>
            router.push({
              pathname: "/category/[type]",
              params: { type: item.type },
            })
          }
          className="mb-4 rounded-xl overflow-hidden"
        >
          <Image
            source={item.backgroundImage}
            className="w-full h-40"
            resizeMode="cover"
          />

          <View className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Image source={item.logo} className="w-32 h-16 mb-2" />
            <Text className="text-white text-lg font-bold">
              {item.title}
            </Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
}
