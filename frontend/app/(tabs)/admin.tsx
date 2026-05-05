import { useEffect } from "react";
import { View, ImageBackground, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AppHeader from "../../components/AppHeader";
import AdminScreen from "../../components/AdminScreen";
import { useAdminAccess } from "../../hooks/useAdminAccess";

const Admin = () => {
  const { isAdmin, isLoading } = useAdminAccess();

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.replace("/(tabs)");
    }
  }, [isAdmin, isLoading]);

  if (!isAdmin) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
      <AppHeader />

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
