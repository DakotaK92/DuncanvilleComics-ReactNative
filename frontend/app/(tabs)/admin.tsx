import { useEffect } from "react";
import { ImageBackground } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import AppHeader from "../../components/AppHeader";
import AdminScreen from "../../components/AdminScreen";
import StateMessage from "../../components/StateMessage";
import { useAdminAccess } from "../../hooks/useAdminAccess";

const Admin = () => {
  const { isExpectedAdminEmail, isLoading } = useAdminAccess();

  useEffect(() => {
    if (!isLoading && !isExpectedAdminEmail) {
      router.replace("/(tabs)");
    }
  }, [isExpectedAdminEmail, isLoading]);

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-transparent" edges={["top"]}>
        <AppHeader />

        <ImageBackground
          source={require("../../assets/images/imagebackground.png")}
          className="flex-1 justify-center px-6"
          resizeMode="cover"
        >
          <StateMessage
            title="Checking admin access"
            message="We’re making sure this account can open the store tools."
            loading
          />
        </ImageBackground>
      </SafeAreaView>
    );
  }

  if (!isExpectedAdminEmail) {
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
