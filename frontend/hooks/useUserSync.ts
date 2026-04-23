import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { getApiErrorMessage, useApiClient, userApi } from "../utils/api";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () =>
      userApi.syncUser(api, {
        email: user?.primaryEmailAddress?.emailAddress,
        firstName: user?.firstName ?? "",
        lastName: user?.lastName ?? "",
      }),
    onSuccess: (response: any) =>
      console.log("User synced successfully:", response.data.user),
    onError: (error) => {
      const message = getApiErrorMessage(error);
      console.error("User sync failed:", message);
      Alert.alert("Backend connection", message);
    },
  });

  useEffect(() => {
    if (isSignedIn && user && !syncUserMutation.data && !syncUserMutation.isPending) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn, user]);

  return null;
};
