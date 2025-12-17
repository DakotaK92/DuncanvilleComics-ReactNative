import React from "react";
import {
  Text,
  View,
  Image,
  ImageBackground,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { differenceInMinutes } from "date-fns";
import { messages, HomeTypes } from "../data/home";
import { formatTimeRemaining } from "@/utils/formatters";

const HomeScreen = () => {
  return (
    <FlatList<HomeTypes>
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      className="m-6"
      showsVerticalScrollIndicator={false}

      // 🔹 Header at the top
      ListHeaderComponent={() => (
        <TouchableOpacity activeOpacity={0.9}>
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
                Comics, Toys & Collectibles
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-3">
                📍 101 W Camp Wisdom Road Suite J Duncanville, TX 75116
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-3">
                🕒 Open Daily • 10:00 AM – 7:00 PM
              </Text>

              <Text className="text-gray-300 text-sm font-gothamLight mb-4">
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
                    className="w-6 h-6 p-1"
                  />
                  <Image
                    source={require("../assets/icons/facebook.png")}
                    className="w-6 h-6 p-1"
                  />
                  <Image
                    source={require("../assets/icons/x.png")}
                    className="w-6 h-6 p-1"
                  />
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      )}

      // 🔹 Each message item
      renderItem={({ item }) => {
        const minutesRemaining = differenceInMinutes(
          new Date(item.date),
          new Date()
        );

        const isEndingSoon = minutesRemaining > 0 && minutesRemaining <= 60;

        return (
          <ImageBackground
            source={item.backgroundImage}
            className="mb-4 rounded-lg overflow-hidden"
            resizeMode="cover"
          >
            <View className="p-4 flex-row items-center justify-between">
              {/* LEFT: Text and Ending Soon badge */}
              <View className="mb-4 rounded-xl p-4 flex-1">
                <Text
                  className={`self-start text-white text-sm font-bold rounded-full px-3 py-1 mb-2 ${
                    isEndingSoon ? "bg-red-600" : "bg-black/20"
                  }`}
                >
                  {isEndingSoon
                    ? `ENDING SOON • ${formatTimeRemaining(item.date)}`
                    : `EVENT ENDS: ${formatTimeRemaining(item.date)}`}
                </Text>

                <Text className="text-white font-gothamMedium text-xl mb-1">
                  {item.title}
                </Text>
                <Text className="text-white text-sm">{item.event}</Text>
              </View>

              {/* RIGHT: Logo */}
              <Image
                source={item.logo}
                className="w-16 h-16"
                resizeMode="contain"
              />
            </View>
          </ImageBackground>
        );
      }}
    />
  );
};

export default HomeScreen;
