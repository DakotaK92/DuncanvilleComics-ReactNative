import React from "react";
import { View, Image, ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SignOutButton from "../../components/SignOutButton";
import AdminScreen from "../../components/AdminScreen";
import { useAdminAccess } from "../../hooks/useAdminAccess";

const Admin = () => {
  const { isAdmin } = useAdminAccess();

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
        <View className="pt-4 px-4">
          <Text className="h-12 rounded bg-red-600 px-4 text-center font-gothamBold text-xl leading-[48px] text-white">
            STORE ADMIN
          </Text>
          {isAdmin ? (
            <View className="mt-3 self-start rounded-full bg-emerald-600/90 px-3 py-2">
              <Text className="font-gothamMedium text-xs text-white">Admin access active</Text>
            </View>
          ) : null}
        </View>

        <AdminScreen />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Admin;
