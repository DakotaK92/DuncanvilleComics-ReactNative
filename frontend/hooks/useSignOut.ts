import { useClerk } from "@clerk/clerk-expo";
import { Alert } from "react-native";
import { router } from "expo-router";

export const useSignOut = () => {
  const { signOut } = useClerk();

  const handleSignOut = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut();
          router.replace("/(auth)");
        },
      },
    ]);
  };

  return { handleSignOut };
};
