import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import RewardTransaction from "../models/rewardTransaction.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { readEmail, readOptionalString } from "../utils/validation.js";
import { Expo } from "expo-server-sdk";

const router = express.Router();

router.post("/sync", protectRoute, asyncHandler(async (req, res) => {
  const email = readEmail(req.body?.email, { field: "email", required: false });
  const firstName = readOptionalString(req.body?.firstName, { max: 80 });
  const lastName = readOptionalString(req.body?.lastName, { max: 80 });

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
      status: "completed",
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
}));

router.get("/me", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json({ user });
});

router.post("/push-token", protectRoute, asyncHandler(async (req, res) => {
  const token = readOptionalString(req.body?.token, { max: 200 });

  if (token && !Expo.isExpoPushToken(token)) {
    return res.status(400).json({ message: "Invalid Expo push token." });
  }

  await User.findOneAndUpdate(
    { clerkUserId: req.userId },
    { $set: { expoPushToken: token ?? "" } }
  );

  res.json({ ok: true });
}));

export default router;
