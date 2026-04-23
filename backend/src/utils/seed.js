import Reward from "../models/reward.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import { defaultRewards } from "../data/rewards.js";
import { defaultWeeklyReleases } from "../data/weeklyReleases.js";

export const seedDefaults = async () => {
  const [rewardCount, releaseCount] = await Promise.all([
    Reward.countDocuments(),
    WeeklyRelease.countDocuments(),
  ]);

  if (rewardCount === 0) {
    await Reward.insertMany(defaultRewards);
  }

  if (releaseCount === 0) {
    await WeeklyRelease.insertMany(defaultWeeklyReleases);
  }
};
