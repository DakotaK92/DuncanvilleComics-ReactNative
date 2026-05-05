import { useClerk } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert } from "react-native";
import { useState } from "react";

export const useSignOut = () => {
  const { signOut } = useClerk();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const confirmSignOut = () => {
    if (isSigningOut) {
      return;
    }

    Alert.alert("Log out", "Are you sure you want to log out of Duncanville Comics?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log out",
        style: "destructive",
        onPress: async () => {
          try {
            setIsSigningOut(true);
            await signOut();
            router.replace("/(auth)");
          } finally {
            setIsSigningOut(false);
          }
        },
      },
    ]);
  };

  return { confirmSignOut, isSigningOut };
};
