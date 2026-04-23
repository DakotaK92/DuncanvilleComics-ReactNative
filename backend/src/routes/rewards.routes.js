import express from "express";
import Reward from "../models/reward.js";
import User from "../models/user.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const rewards = await Reward.find({ active: true }).sort({ cost: 1, title: 1 });
  res.json({ rewards });
});

router.get("/me", protectRoute, async (req, res) => {
  const [user, rewards] = await Promise.all([
    User.findOne({ clerkUserId: req.userId }),
    Reward.find({ active: true }).sort({ cost: 1, title: 1 }),
  ]);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

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
    },
    rewards,
  });
});

export default router;
