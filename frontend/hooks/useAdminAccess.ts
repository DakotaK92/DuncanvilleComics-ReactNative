import { useQuery } from "@tanstack/react-query";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { adminApi, getApiErrorMessage, useApiClient } from "../utils/api";
import { isPrimaryAdminEmail } from "../utils/admin";

export const useAdminAccess = () => {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const api = useApiClient();
  const isExpectedAdminEmail = isPrimaryAdminEmail(user?.primaryEmailAddress?.emailAddress);

  const query = useQuery({
    queryKey: ["admin-access", user?.id],
    enabled: Boolean(isSignedIn && user && isExpectedAdminEmail),
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
    isExpectedAdminEmail,
    isAdmin: isExpectedAdminEmail && query.isSuccess,
    isForbidden,
    errorMessage,
  };
};
