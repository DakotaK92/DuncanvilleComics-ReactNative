import express from "express";
import User from "../models/user.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/sync", protectRoute, async (req, res) => {
  const { email = "", firstName = "", lastName = "" } = req.body ?? {};

  const user = await User.findOneAndUpdate(
    { clerkUserId: req.userId },
    {
      $set: {
        email,
        firstName,
        lastName,
      },
      $setOnInsert: {
        rewardPoints: 1250,
        lifetimePoints: 1250,
      },
    },
    { new: true, upsert: true }
  );

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
