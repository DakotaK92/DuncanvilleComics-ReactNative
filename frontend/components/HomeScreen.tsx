import React from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  Pressable,
} from "react-native";
import { differenceInMinutes } from "date-fns";
import { useRouter } from "expo-router";

import { messages, HomeTypes } from "../data/home";

const HomeScreen = () => {
  const router = useRouter();

  return (
    <FlatList<HomeTypes>
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      className="m-6"
      showsVerticalScrollIndicator={false}

      /* 🔹 Header at the top */
      ListHeaderComponent={() => (
        <Pressable activeOpacity={0.9}>
          <View className="mb-5 rounded-xl overflow-hidden bg-neutral-900">
            {/* IMAGE */}
            <Image
              source={require("../assets/images/store-front.jpg")}
              className="w-full h-48"
              resizeMode="cover"
            />

            {/* CONTENT */}
            <View className="p-4">
              <Text className="text-white font-gothamMedium text-xl mb-1">
                Duncanville Bookstore
                {"\n"}Comics, Toys & Collectibles
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-3">
                📍 101 W Camp Wisdom Road Suite J Duncanville, TX 75116
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-3">
                🕒 Open Daily • 10:00 AM – 7:00 PM
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-3">
                📞 (123) 456-7890
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-4">
                ✉️ contact@duncanvillebookstore.com
              </Text>

              <View className="flex-row items-center justify-between border-t border-white/10 pt-3">
                <Text className="text-gray-400 text-sm font-gothamLight">
                  Follow us
                </Text>

                <View className="flex-row space-x-4">
                  <Image
                    source={require("../assets/icons/instagram.png")}
                    className="w-6 h-6"
                  />
                  <Image
                    source={require("../assets/icons/facebook.png")}
                    className="w-6 h-6"
                  />
                  <Image
                    source={require("../assets/icons/x.png")}
                    className="w-6 h-6"
                  />
                </View>
              </View>
            </View>
          </View>
        </Pressable>
      )}

      /* 🔹 Each list item */
      renderItem={({ item }) => {
        const minutesRemaining = differenceInMinutes(
          new Date(item.date),
          new Date()
        );

        return (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/category",
                params: {
                  title: item.title,
                  type: item.type,
                },
              })
            }
            style={({ pressed }) => [
              { opacity: pressed ? 0.92 : 1 },
            ]}
          >
            <ImageBackground
              source={item.backgroundImage}
              className="mb-4 rounded-lg overflow-hidden"
              resizeMode="cover"
            >
              <View className="p-4 flex-row items-center justify-between">
                {/* LEFT */}
                <View className="rounded-xl p-4 flex-1">
                  <Text className="text-white font-gothamMedium text-xl mb-1">
                    {item.title}
                  </Text>
                </View>

                {/* RIGHT */}
                <Image
                  source={item.logo}
                  className="w-16 h-16"
                  resizeMode="contain"
                />
              </View>
            </ImageBackground>
          </Pressable>
        );
      }}
    />
  );
};

export default HomeScreen;
