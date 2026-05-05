import type { ComicBook } from "../data/categoryComics";

export type Reward = {
  _id?: string;
  id?: string;
  code?: string;
  title: string;
  cost: number;
  description?: string;
};

export type RewardBadge = {
  title: string;
  unlocked?: boolean;
};

export type RewardEarnRule = {
  id: string;
  icon: string;
  label: string;
  points: number;
  description?: string;
};

export type RewardActivityItem = {
  id: string;
  type: "earn" | "redeem";
  amount: number;
  balanceAfter: number;
  title: string;
  description?: string;
  createdAt: string;
};

export type RewardSummary = {
  coins: number;
  lifetimePoints: number;
  nextReward: { title: string; cost: number; remainingCoins: number } | null;
  badges: RewardBadge[];
  recentActivity: RewardActivityItem[];
};

export type RewardsSummaryResponse = {
  summary: RewardSummary;
  rewards: Reward[];
  earnRules: RewardEarnRule[];
};

export type RemoteComicBook = ComicBook & {
  coverImageUrl?: string;
  hasNewIssue?: boolean;
  notes?: string;
  seriesKey?: string;
};

export type PullListItem = RemoteComicBook & {
  id: string;
  seriesKey: string;
  hasNewIssue?: boolean;
};

export type WishListItem = RemoteComicBook & {
  id: string;
  seriesKey: string;
};
