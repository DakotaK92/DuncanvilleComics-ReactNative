import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { messages } from "@/data/home";
import SignOutButton from "../../components/SignOutButton";

const featuredTypes = new Set(["weekly-releases", "pull-list", "pre-order"]);

export default function CategoriesScreen() {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <View className="flex-row items-center justify-between border-b border-gray-200 px-4 py-3">
        <View className="w-10" />
        <Image
          source={require("../../assets/icons/logo.png")}
          className="h-10 w-24 items-center"
        />
        <SignOutButton />
      </View>

      <ImageBackground
        source={require("../../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >

        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          ListHeaderComponent={() => (
            <View className="m bg-red-600 rounded-2xl">
              <Text className="font-gothamBold text-3xl text-white p-4">Pull List Hub</Text>
              <Text className="p-4 max-w-[320px] font-gothamLight text-sm leading-5 text-white">
                Track weekly books, jump into your active pull list, and keep the next
                release easy to spot.
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const featured = featuredTypes.has(item.type);

            return (
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/category/[type]",
                    params: { type: item.type },
                  })
                }
                className="mb-4 overflow-hidden rounded-xl"
              >
                <Image
                  source={item.backgroundImage}
                  className="h-44 w-full"
                  resizeMode="cover"
                />

                <View className="absolute inset-0 bg-black/45 px-5 py-4">
                  <View className="flex-row items-start justify-between">
                    <Image source={item.logo} className="h-16 w-32" resizeMode="contain" />

                    {featured ? (
                      <View className="rounded-full bg-white/20 px-3 py-1">
                        <Text className="font-gothamMedium text-xs text-white">
                          Quick access
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View className="mt-auto flex-row items-end justify-between">
                    <View className="max-w-[78%]">
                      <Text className="font-gothamBold text-2xl text-white">{item.title}</Text>
                      <Text className="mt-1 font-gothamLight text-sm text-neutral-200">
                        {item.type === "pull-list"
                          ? "See upcoming issues from your saved series."
                          : item.type === "weekly-releases"
                            ? "Add this week's books straight into your list."
                            : "Browse store picks and release categories."}
                      </Text>
                    </View>

                    <View className="rounded-full bg-white p-2">
                      <Ionicons name="arrow-forward" size={18} color="#111827" />
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </ImageBackground>
    </SafeAreaView>
  );
}
