import express from "express";
import Reward from "../models/reward.js";
import RewardTransaction from "../models/rewardTransaction.js";
import User from "../models/user.js";
import { defaultEarnRules } from "../data/earnRules.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

const serializeActivity = (activity) => ({
  id: activity._id,
  type: activity.type,
  amount: activity.amount,
  balanceAfter: activity.balanceAfter,
  title: activity.title,
  description: activity.description,
  createdAt: activity.createdAt,
});

router.get("/", async (_req, res) => {
  const rewards = await Reward.find({ active: true }).sort({ cost: 1, title: 1 });
  res.json({ rewards });
});

router.get("/me", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const [rewards, recentActivity] = await Promise.all([
    Reward.find({ active: true }).sort({ cost: 1, title: 1 }),
    RewardTransaction.find({ user: user._id }).sort({ createdAt: -1 }).limit(8),
  ]);

  const nextReward = rewards.find((reward) => reward.cost > user.rewardPoints) ?? null;

  res.json({
    summary: {
      coins: user.rewardPoints,
      lifetimePoints: user.lifetimePoints,
      badges: user.badges.map((badge) => ({
        title: badge.label,
        unlocked: true,
      })),
      nextReward: nextReward
        ? {
            ...nextReward.toObject(),
            remainingCoins: Math.max(nextReward.cost - user.rewardPoints, 0),
          }
        : null,
      recentActivity: recentActivity.map(serializeActivity),
    },
    rewards,
    earnRules: defaultEarnRules,
  });
});

router.post("/redeem/:rewardId", protectRoute, async (req, res) => {
  const [user, reward] = await Promise.all([
    User.findOne({ clerkUserId: req.userId }),
    Reward.findOne({ _id: req.params.rewardId, active: true }),
  ]);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  if (!reward) {
    return res.status(404).json({ message: "Reward not found" });
  }

  if (user.rewardPoints < reward.cost) {
    return res.status(400).json({
      message: `You need ${reward.cost - user.rewardPoints} more coins to redeem this reward.`,
    });
  }

  user.rewardPoints = Math.max(user.rewardPoints - reward.cost, 0);
  await user.save();

  const transaction = await RewardTransaction.create({
    user: user._id,
    type: "redeem",
    amount: reward.cost,
    balanceAfter: user.rewardPoints,
    title: reward.title,
    description: reward.description || `Redeemed ${reward.title}.`,
    reward: reward._id,
  });

  res.json({
    ok: true,
    reward: {
      id: reward._id,
      title: reward.title,
      cost: reward.cost,
    },
    transaction: serializeActivity(transaction),
    summary: {
      coins: user.rewardPoints,
      lifetimePoints: user.lifetimePoints,
    },
  });
});

export default router;
