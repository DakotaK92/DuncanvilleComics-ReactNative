export type RewardFilter = "all" | "active" | "inactive";

export type ReleaseFormState = {
  title: string;
  issue: string;
  publisher: string;
  price: string;
  releaseDate: string;
  coverImageUrl: string;
  seriesKey: string;
};

export type RewardFormState = {
  title: string;
  description: string;
  cost: string;
  code: string;
  active: boolean;
};

export type EarnRule = {
  id: string;
  label: string;
  points: number;
  description?: string;
};

export type AdminOverviewStats = {
  users: number;
  weeklyReleases: number;
  rewards: number;
  activePullListSubscriptions: number;
};

export type AdminSubscriptionSummary = {
  _id: string;
  title: string;
  publisher: string;
  subscriberCount: number;
};

export type AdminOverview = {
  stats: AdminOverviewStats;
  topSubscriptions: AdminSubscriptionSummary[];
};

export type AdminWeeklyRelease = {
  id: string;
  title: string;
  issue: number;
  publisher: string;
  price: number;
  releaseDate: string;
  coverImageUrl?: string;
  seriesKey?: string;
  status?: "current" | "archived";
  importedAt?: string;
};

export type WeeklyReleaseImportPreviewRow = {
  lineNumber: number;
  title: string;
  issue: number;
  publisher: string;
  price: number;
  releaseDate: string;
  coverImageUrl?: string;
  seriesKey: string;
};

export type WeeklyReleaseImportPreviewError = {
  lineNumber: number;
  title?: string;
  message: string;
};

export type WeeklyReleaseImportPreview = {
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
  };
  releases: WeeklyReleaseImportPreviewRow[];
  errors: WeeklyReleaseImportPreviewError[];
};

export type AdminReward = {
  id: string;
  title: string;
  description?: string;
  cost: number;
  active: boolean;
  code?: string;
};

export type AdminUser = {
  _id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  pullListCount: number;
  rewardPoints: number;
  lifetimePoints: number;
};

export type AdminPullListItem = {
  _id: string;
  title: string;
  publisher: string;
  seriesKey: string;
};

export type RewardActivityStatus = "pending" | "fulfilled" | "completed";

export type AdminRewardActivityItem = {
  id: string;
  type: "earn" | "redeem" | string;
  amount: number;
  title: string;
  description?: string;
  status?: RewardActivityStatus;
  balanceAfter: number;
  createdAt: string;
};

export type AdminRewardActivityUserSummary = {
  rewardPoints: number;
  lifetimePoints: number;
};

export type AdminRewardActivityResponse = {
  user?: AdminRewardActivityUserSummary;
  activity: AdminRewardActivityItem[];
};

export type AdminUserPullListResponse = {
  items: AdminPullListItem[];
};
