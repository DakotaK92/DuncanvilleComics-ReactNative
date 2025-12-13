import React from 'react'
import { Text, View, Image, ImageBackground, FlatList } from "react-native";

import { messages, MessageType } from "../data/home";
import { formatTimeRemaining } from "../utils/formatters";

const HomeScreen = () => {
  return (
    
    <FlatList
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      className="m-6"
      showsVerticalScrollIndicator={false}
      renderItem={({ item }: { item: MessageType }) => (
        <ImageBackground
          source={item.backgroundImage}
          className="mb-4 rounded-lg overflow-hidden"
          resizeMode="cover"
        >
          <View className="p-4">
            <View className="flex-row items-center">
              {/* Text content on the left */}
              <View className="flex-1">
                <Text className="self-start text-white text-sm font-bold bg-black/20 rounded-full px-3 py-1 mb-1">
                  FIRST BOOK ENDS {formatTimeRemaining(item.date)}
                </Text>

                <Text className="text-white font-gothamMedium text-xl">
                  {item.title}
                </Text>

                <Text className="text-white font-gothamMedium text-sm">
                  {item.shipping}
                </Text>
              </View>
              {/* Logo on the right */}
              <Image
                source={item.logo}
                className="w-16 h-16 ml-4"
                resizeMode="contain"
              />
            </View>
          </View>
        </ImageBackground>
      )}
    />
  )
}

export default HomeScreen