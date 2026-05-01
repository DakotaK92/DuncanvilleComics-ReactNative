import express from "express";
import User from "../models/user.js";
import RewardTransaction from "../models/rewardTransaction.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", protectRoute, async (req, res) => {
  const { email = "", firstName = "", lastName = "" } = req.body ?? {};

  let user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    user = await User.create({
      clerkUserId: req.userId,
      email,
      firstName,
      lastName,
      rewardPoints: 1250,
      lifetimePoints: 1250,
    });

    await RewardTransaction.create({
      user: user._id,
      type: "earn",
      amount: 1250,
      balanceAfter: 1250,
      title: "Welcome bonus",
      description: "Starting Comic Coins for joining Duncanville Comics rewards.",
    });
  } else {
    user.email = email;
    user.firstName = firstName;
    user.lastName = lastName;
    await user.save();
  }

  res.json({ user });
});

router.get("/me", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

export default router;
