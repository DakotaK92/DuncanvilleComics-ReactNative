import React from "react";
import {
  Text,
  View,
  Image,
  FlatList,
  Pressable,
  Linking,
} from "react-native";

import { messages, HomeTypes } from "../data/home";

const HomeScreen = () => {
  const openLink = async (url: string) => {
    const supported = await Linking.canOpenURL(url)
    if (supported) {
      await Linking.openURL(url)
    } else {
      console.warn("Can't open URL:", url)
    }
  }
  
  return (
    <FlatList<HomeTypes>
      data={messages}
      keyExtractor={(item) => item.id.toString()}
      className="m-6"
      showsVerticalScrollIndicator={false}

      /* Header at the top */
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

                <View className="flex-row items-center space-x-4">
                  <Pressable
                    className="p-2"
                    onPress={() => openLink("")}
                  >
                    <Image
                      source={require("../assets/icons/instagram.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </Pressable>

                  <Pressable
                    className="p-2"
                    onPress={() => openLink("https://www.facebook.com/Duncanville.Bookstore")}
                  >
                    <Image
                      source={require("../assets/icons/facebook.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </Pressable>

                  <Pressable
                    className="p-2"
                    onPress={() => openLink("https://www.tiktok.com/@duncanville.bookstore")}
                  >
                    <Image
                      source={require("../assets/icons/tiktok.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </Pressable>

                  <Pressable
                    className="p-2 "
                    onPress={() => openLink("https://www.ebay.com/str/duncanvillebookstore")}
                  >
                    <Image
                      source={require("../assets/icons/ebay.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </Pressable>

                  <Pressable
                    className="p-2"
                    onPress={() => openLink("https://www.youtube.com/@duncanvillebookstore")}
                  >
                    <Image
                      source={require("../assets/icons/youtube.png")}
                      className="w-6 h-6"
                      resizeMode="contain"
                    />
                  </Pressable>
                </View>


              </View>
            </View>
          </View>
        </Pressable>
      )}
    />
  );
};

export default HomeScreen;
