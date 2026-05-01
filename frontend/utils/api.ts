import axios, { AxiosError, AxiosInstance } from "axios";
import { useAuth } from "@clerk/clerk-expo";
import Constants from "expo-constants";

const getExpoHostUrl = () => {
  const hostUri =
    Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.hostUri || null;

  if (!hostUri) {
    return null;
  }

  const host = hostUri.split(":")[0];
  return host ? `http://${host}:3000/api` : null;
};

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, "") ||
  getExpoHostUrl() ||
  "http://localhost:3000/api";

export const API_REQUEST_TIMEOUT_MS = 20000;
export const BACKEND_WAKE_TIMEOUT_MS = 65000;

export const getApiErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ error?: string; message?: string }>;
    const serverMessage =
      axiosError.response?.data?.message || axiosError.response?.data?.error;

    if (serverMessage) {
      return serverMessage;
    }

    if (
      axiosError.code === "ECONNABORTED" ||
      axiosError.message === "Network Error" ||
      !axiosError.response
    ) {
      return `Can't reach the backend at ${API_BASE_URL}. Make sure the backend is running and your device can reach that address.`;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong while talking to the backend.";
};

export const createApiClient = (
  getToken: () => Promise<string | null>
): AxiosInstance => {
  const api = axios.create({ baseURL: API_BASE_URL, timeout: API_REQUEST_TIMEOUT_MS });

  api.interceptors.request.use(async (config) => {
    const token = await getToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};

export const useApiClient = (): AxiosInstance => {
  const { getToken } = useAuth();
  return createApiClient(getToken);
};

export const userApi = {
  syncUser: (
    api: AxiosInstance,
    payload: { email?: string; firstName?: string; lastName?: string }
  ) => api.post("/users/sync", payload),
  getMe: (api: AxiosInstance) => api.get("/users/me"),
};

export const rewardsApi = {
  getSummary: (api: AxiosInstance) => api.get("/rewards/me"),
  redeem: (api: AxiosInstance, rewardId: string) => api.post(`/rewards/redeem/${rewardId}`),
};

export const weeklyReleasesApi = {
  getAll: (api: AxiosInstance) => api.get("/weekly-releases"),
};

export const pullListApi = {
  getAll: (api: AxiosInstance) => api.get("/pull-list"),
  add: (
    api: AxiosInstance,
    payload: { title: string; publisher: string; seriesKey: string; notes?: string }
  ) => api.post("/pull-list", payload),
  remove: (api: AxiosInstance, id: string) => api.delete(`/pull-list/${id}`),
  emailStore: (api: AxiosInstance, payload: { filter: "all" | "ready" }) =>
    api.post("/pull-list/email-store", payload),
};

export const wishListApi = {
  getAll: (api: AxiosInstance) => api.get("/wish-list"),
  add: (
    api: AxiosInstance,
    payload: {
      title: string;
      issue: number;
      publisher: string;
      price: number;
      seriesKey: string;
      notes?: string;
    }
  ) => api.post("/wish-list", payload),
  remove: (api: AxiosInstance, id: string) => api.delete(`/wish-list/${id}`),
};

export const adminApi = {
  getOverview: (api: AxiosInstance) => api.get("/admin/overview"),
  getWeeklyReleases: (api: AxiosInstance) => api.get("/admin/weekly-releases"),
  createWeeklyRelease: (
    api: AxiosInstance,
    payload: {
      title: string;
      issue: number;
      publisher: string;
      price: number;
      releaseDate: string;
      coverImageUrl?: string;
      seriesKey?: string;
    }
  ) => api.post("/admin/weekly-releases", payload),
  updateWeeklyRelease: (
    api: AxiosInstance,
    id: string,
    payload: {
      title: string;
      issue: number;
      publisher: string;
      price: number;
      releaseDate: string;
      coverImageUrl?: string;
      seriesKey?: string;
    }
  ) => api.put(`/admin/weekly-releases/${id}`, payload),
  deleteWeeklyRelease: (api: AxiosInstance, id: string) =>
    api.delete(`/admin/weekly-releases/${id}`),
  getRewards: (api: AxiosInstance) => api.get("/admin/rewards"),
  createReward: (
    api: AxiosInstance,
    payload: {
      title: string;
      description?: string;
      cost: number;
      active: boolean;
      code?: string;
    }
  ) => api.post("/admin/rewards", payload),
  updateReward: (
    api: AxiosInstance,
    id: string,
    payload: {
      title: string;
      description?: string;
      cost: number;
      active: boolean;
      code?: string;
    }
  ) => api.put(`/admin/rewards/${id}`, payload),
  deleteReward: (api: AxiosInstance, id: string) =>
    api.delete(`/admin/rewards/${id}`),
  getUsers: (api: AxiosInstance) => api.get("/admin/users"),
  getUserPullList: (api: AxiosInstance, userId: string) =>
    api.get(`/admin/users/${userId}/pull-list`),
  getUserRewardActivity: (api: AxiosInstance, userId: string) =>
    api.get(`/admin/users/${userId}/reward-activity`),
  getEarnRules: (api: AxiosInstance) => api.get("/admin/earn-rules"),
  awardUserRewardPoints: (
    api: AxiosInstance,
    userId: string,
    payload: { earnRuleId: string; amount?: number; note?: string }
  ) => api.post(`/admin/users/${userId}/reward-awards`, payload),
  adjustUserRewardPoints: (
    api: AxiosInstance,
    userId: string,
    payload: { amount: number; note?: string }
  ) => api.post(`/admin/users/${userId}/reward-adjustments`, payload),
  updateRewardActivityStatus: (
    api: AxiosInstance,
    activityId: string,
    payload: { status: "pending" | "fulfilled" | "completed" }
  ) => api.patch(`/admin/reward-activity/${activityId}/status`, payload),
  getSubscriptions: (api: AxiosInstance) => api.get("/admin/subscriptions"),
};
