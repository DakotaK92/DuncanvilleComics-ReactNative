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
import { formatTimeRemaining } from "../utils/formatters";

const HomeScreen = () => {
  return (
    <FlatList<HomeTypes>
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      className="m-6"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => {
        const minutesRemaining = differenceInMinutes(
          new Date(item.date),
          new Date()
        );

        const isEndingSoon =
          minutesRemaining > 0 && minutesRemaining <= 60;

        return (
          <TouchableOpacity activeOpacity={0.9}>
            <ImageBackground
              source={item.backgroundImage}
              className="mb-4 rounded-lg overflow-hidden"
              resizeMode="cover"
            >
              <View className="p-4">
                <View className="flex-row items-center">
                  {/* Text content */}
                  <View className="flex-1">
                    <Text
                      className={`self-start text-white text-sm font-bold rounded-full px-3 py-1 mb-1 ${
                        isEndingSoon ? "bg-red-600" : "bg-black/20"
                      }`}
                    >
                      {isEndingSoon
                        ? `ENDING SOON • ${formatTimeRemaining(item.date)}`
                        : `EVENT ENDS: ${formatTimeRemaining(item.date)}`}
                    </Text>

                    <Text className="text-white font-gothamMedium text-xl">
                      {item.title}
                    </Text>

                    <Text className="text-white font-gothamMedium text-sm">
                      {item.event}
                    </Text>
                    <TouchableOpacity className="mt-3 bg-red-600 py-2 px-4 rounded-full w-36 items-center">
                      <Text className="text-white font-bold">Join Now</Text>
                    </TouchableOpacity>
                  </View>

                  {/* Logo */}
                  <Image
                    source={item.logo}
                    className="w-16 h-16 ml-4"
                    resizeMode="contain"
                  />
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        );
      }}
    />
  );
};

export default HomeScreen;
