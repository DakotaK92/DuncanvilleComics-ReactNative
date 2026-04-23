import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { adminApi, getApiErrorMessage, useApiClient } from "../utils/api";

export const useAdminAccess = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const api = useApiClient();

  const query = useQuery({
    queryKey: ["admin-access", user?.id],
    enabled: Boolean(isSignedIn && user),
    retry: false,
    queryFn: async () => {
      await adminApi.getOverview(api);
      return true;
    },
  });

  const errorMessage = query.error ? getApiErrorMessage(query.error) : null;
  const isForbidden = Boolean(errorMessage?.toLowerCase().includes("admin access"));

  return {
    ...query,
    isAdmin: query.isSuccess,
    isForbidden,
    errorMessage,
  };
};
