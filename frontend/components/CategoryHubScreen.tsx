import React from "react";
import { View, Text, FlatList, Image, TouchableOpacity, ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { messages } from "@/data/home";
import AppHeader from "./AppHeader";

const featuredTypes = new Set(["weekly-releases", "pull-list", "pre-order"]);
const informationalTypes = new Set(["new-releases"]);

export default function CategoryHubScreen() {
  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <AppHeader />

      <ImageBackground
        source={require("../assets/images/imagebackground.png")}
        className="flex-1"
        resizeMode="cover"
      >
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          ListHeaderComponent={() => (
            <View className="my-4 rounded-2xl bg-red-600">
              <Text className="p-4 font-gothamBold text-3xl text-white">Pull List Hub</Text>
              <Text className="max-w-[320px] p-4 font-gothamLight text-sm leading-5 text-white">
                Track weekly books, jump into your active pull list, and keep the next release
                easy to spot.
              </Text>
            </View>
          )}
          renderItem={({ item }) => {
            const featured = featuredTypes.has(item.type);
            const informational = informationalTypes.has(item.type);

            return (
              <TouchableOpacity
                disabled={informational}
                onPress={
                  informational
                    ? undefined
                    : () =>
                        router.push({
                          pathname: "/category/[type]",
                          params: { type: item.type },
                        })
                }
                className="mb-4 overflow-hidden rounded-xl"
              >
                <Image source={item.backgroundImage} className="h-44 w-full" contentFit="cover" cachePolicy="memory-disk" />

                <View className="absolute inset-0 bg-black/45 px-5 py-4">
                  <View className="flex-row items-start justify-between">

                    {featured ? (
                      <View className="rounded-full bg-white/20 px-3 py-1">
                        <Text className="font-gothamMedium text-xs text-white">Quick access</Text>
                      </View>
                    ) : informational ? (
                      <View className="rounded-full bg-white/20 px-3 py-1">
                        <Text className="font-gothamMedium text-xs text-white">Featured</Text>
                      </View>
                    ) : null}
                  </View>

                  <View className="mt-auto flex-row items-end justify-between">
                    <View className="max-w-[78%]">
                      <Text className="font-gothamBold text-2xl text-white">{item.title}</Text>
                      <Text className="mt-1 font-gothamLight text-sm text-neutral-200">
                        {item.type === "new-releases"
                          ? "A featured spotlight card for brand-new readers."
                          : item.type === "pull-list"
                          ? "See upcoming issues from your saved series."
                          : item.type === "weekly-releases"
                            ? "Add this week's books straight into your list."
                            : item.type === "wishlist"
                              ? "Keep a personal shortlist of books to track down."
                              : item.type === "back-issues"
                                ? "Browse older issues and newly added wall books."
                                : "Browse store picks and release categories."}
                      </Text>
                    </View>

                    {!informational ? (
                      <View className="rounded-full bg-white p-2">
                        <Ionicons name="arrow-forward" size={18} color="#111827" />
                      </View>
                    ) : null}
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
