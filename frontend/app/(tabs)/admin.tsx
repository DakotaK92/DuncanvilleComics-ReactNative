import { useEffect } from "react";
import { ImageBackground } from "react-native";
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
        <AdminScreen />
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Admin;
