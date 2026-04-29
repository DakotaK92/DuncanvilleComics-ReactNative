import { useEffect, useRef } from "react";
import axios from "axios";
import { Alert } from "react-native";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { getApiErrorMessage, useApiClient, userApi } from "../utils/api";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUserSync = () => {
  const { getToken, isLoaded: isAuthLoaded, isSignedIn } = useAuth();
  const { isLoaded: isUserLoaded, user } = useUser();
  const api = useApiClient();
  const syncedUserIdRef = useRef<string | null>(null);
  const syncingUserIdRef = useRef<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const syncUser = async () => {
      if (!isAuthLoaded || !isUserLoaded || !isSignedIn || !user) {
        return;
      }

      if (syncedUserIdRef.current === user.id || syncingUserIdRef.current === user.id) {
        return;
      }

      syncingUserIdRef.current = user.id;

      try {
        for (let attempt = 0; attempt < 6; attempt += 1) {
          const token = await getToken();

          if (!token) {
            await wait(500);
            continue;
          }

          try {
            const response = await userApi.syncUser(api, {
              email: user.primaryEmailAddress?.emailAddress,
              firstName: user.firstName ?? "",
              lastName: user.lastName ?? "",
            });

            if (cancelled) {
              return;
            }

            syncedUserIdRef.current = user.id;
            console.log("User synced successfully:", response.data.user);
            return;
          } catch (error) {
            const isUnauthorized = axios.isAxiosError(error) && error.response?.status === 401;

            if (isUnauthorized && attempt < 5) {
              await wait(800);
              continue;
            }

            if (!cancelled) {
              const message = getApiErrorMessage(error);

              if (isUnauthorized) {
                console.warn("User sync skipped until Clerk session is fully ready.");
              } else {
                console.warn("User sync issue:", message);
                Alert.alert("Backend connection", message);
              }
            }

            return;
          }
        }
      } finally {
        if (!cancelled && syncingUserIdRef.current === user.id) {
          syncingUserIdRef.current = null;
        }
      }
    };

    syncUser();

    return () => {
      cancelled = true;
    };
  }, [api, getToken, isAuthLoaded, isSignedIn, isUserLoaded, user]);

  useEffect(() => {
    if (!isSignedIn) {
      syncedUserIdRef.current = null;
      syncingUserIdRef.current = null;
    }
  }, [isSignedIn]);

  return null;
};
