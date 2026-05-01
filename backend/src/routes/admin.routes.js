import express from "express";
import User from "../models/user.js";
import Reward from "../models/reward.js";
import RewardTransaction from "../models/rewardTransaction.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import PullListItem from "../models/pullListItem.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";

const router = express.Router();

router.use(protectRoute);
router.use(protectAdminRoute);

const normalizeSeriesKey = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const serializeRelease = (release) => ({
  id: release._id,
  title: release.title,
  issue: release.issueNumber,
  publisher: release.publisher,
  price: release.price,
  releaseDate: release.releaseDate,
  coverImageUrl: release.coverImageUrl,
  seriesKey: release.seriesKey,
});

const serializeReward = (reward) => ({
  id: reward._id,
  code: reward.code,
  title: reward.title,
  description: reward.description,
  cost: reward.cost,
  active: reward.active,
});

const serializeRewardTransaction = (transaction) => ({
  id: transaction._id,
  type: transaction.type,
  amount: transaction.amount,
  balanceAfter: transaction.balanceAfter,
  title: transaction.title,
  description: transaction.description,
  createdAt: transaction.createdAt,
});

router.get("/overview", async (_req, res) => {
  const [userCount, releaseCount, rewardCount, pullListCount, topSubscriptions] =
    await Promise.all([
      User.countDocuments(),
      WeeklyRelease.countDocuments(),
      Reward.countDocuments(),
      PullListItem.countDocuments({ active: true }),
      PullListItem.aggregate([
        { $match: { active: true } },
        {
          $group: {
            _id: "$seriesKey",
            title: { $first: "$title" },
            publisher: { $first: "$publisher" },
            subscriberCount: { $sum: 1 },
          },
        },
        { $sort: { subscriberCount: -1, title: 1 } },
        { $limit: 5 },
      ]),
    ]);

  res.json({
    stats: {
      users: userCount,
      weeklyReleases: releaseCount,
      rewards: rewardCount,
      activePullListSubscriptions: pullListCount,
    },
    topSubscriptions,
  });
});

router.get("/weekly-releases", async (_req, res) => {
  const releases = await WeeklyRelease.find().sort({ releaseDate: 1, title: 1 });
  res.json({ releases: releases.map(serializeRelease) });
});

router.post("/weekly-releases", async (req, res) => {
  const {
    title,
    issue,
    publisher,
    price,
    releaseDate,
    coverImageUrl = "",
    seriesKey,
  } = req.body ?? {};

  if (!title || issue == null || !publisher || price == null || !releaseDate) {
    return res.status(400).json({
      message: "title, issue, publisher, price, and releaseDate are required",
    });
  }

  const release = await WeeklyRelease.create({
    title,
    issueNumber: Number(issue),
    publisher,
    price: Number(price),
    releaseDate: new Date(releaseDate),
    coverImageUrl,
    seriesKey: normalizeSeriesKey(seriesKey || title),
  });

  res.status(201).json({ release: serializeRelease(release) });
});

router.put("/weekly-releases/:id", async (req, res) => {
  const {
    title,
    issue,
    publisher,
    price,
    releaseDate,
    coverImageUrl = "",
    seriesKey,
  } = req.body ?? {};

  const release = await WeeklyRelease.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        issueNumber: Number(issue),
        publisher,
        price: Number(price),
        releaseDate: new Date(releaseDate),
        coverImageUrl,
        seriesKey: normalizeSeriesKey(seriesKey || title),
      },
    },
    { new: true }
  );

  if (!release) {
    return res.status(404).json({ message: "Weekly release not found" });
  }

  res.json({ release: serializeRelease(release) });
});

router.delete("/weekly-releases/:id", async (req, res) => {
  const release = await WeeklyRelease.findByIdAndDelete(req.params.id);

  if (!release) {
    return res.status(404).json({ message: "Weekly release not found" });
  }

  res.status(204).send();
});

router.get("/rewards", async (_req, res) => {
  const rewards = await Reward.find().sort({ active: -1, cost: 1, title: 1 });
  res.json({ rewards: rewards.map(serializeReward) });
});

router.post("/rewards", async (req, res) => {
  const { title, description = "", cost, active = true, code } = req.body ?? {};

  if (!title || cost == null) {
    return res.status(400).json({
      message: "title and cost are required",
    });
  }

  const reward = await Reward.create({
    title,
    description,
    cost: Number(cost),
    active: Boolean(active),
    code: normalizeSeriesKey(code || title),
  });

  res.status(201).json({ reward: serializeReward(reward) });
});

router.put("/rewards/:id", async (req, res) => {
  const { title, description = "", cost, active = true, code } = req.body ?? {};

  const reward = await Reward.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        title,
        description,
        cost: Number(cost),
        active: Boolean(active),
        code: normalizeSeriesKey(code || title),
      },
    },
    { new: true }
  );

  if (!reward) {
    return res.status(404).json({ message: "Reward not found" });
  }

  res.json({ reward: serializeReward(reward) });
});

router.delete("/rewards/:id", async (req, res) => {
  const reward = await Reward.findByIdAndDelete(req.params.id);

  if (!reward) {
    return res.status(404).json({ message: "Reward not found" });
  }

  res.status(204).send();
});

router.get("/users", async (_req, res) => {
  const users = await User.aggregate([
    {
      $lookup: {
        from: "pulllistitems",
        localField: "_id",
        foreignField: "user",
        as: "pullListItems",
      },
    },
    {
      $project: {
        email: 1,
        firstName: 1,
        lastName: 1,
        rewardPoints: 1,
        lifetimePoints: 1,
        createdAt: 1,
        pullListCount: {
          $size: {
            $filter: {
              input: "$pullListItems",
              as: "item",
              cond: { $eq: ["$$item.active", true] },
            },
          },
        },
      },
    },
    { $sort: { createdAt: -1 } },
  ]);

  res.json({ users });
});

router.get("/users/:id/pull-list", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const items = await PullListItem.find({ user: user._id, active: true }).sort({
    title: 1,
  });

  res.json({
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    },
    items,
  });
});

router.get("/users/:id/reward-activity", async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const activity = await RewardTransaction.find({ user: user._id })
    .sort({ createdAt: -1 })
    .limit(12);

  res.json({
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      rewardPoints: user.rewardPoints,
      lifetimePoints: user.lifetimePoints,
    },
    activity: activity.map(serializeRewardTransaction),
  });
});

router.post("/users/:id/reward-adjustments", async (req, res) => {
  const { amount, note = "" } = req.body ?? {};
  const parsedAmount = Number(amount);

  if (!Number.isFinite(parsedAmount) || parsedAmount === 0) {
    return res.status(400).json({
      message: "A non-zero numeric amount is required.",
    });
  }

  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const nextBalance = user.rewardPoints + parsedAmount;

  if (nextBalance < 0) {
    return res.status(400).json({
      message: "This adjustment would drop the user below zero coins.",
    });
  }

  user.rewardPoints = nextBalance;

  if (parsedAmount > 0) {
    user.lifetimePoints += parsedAmount;
  }

  await user.save();

  const transaction = await RewardTransaction.create({
    user: user._id,
    type: parsedAmount > 0 ? "earn" : "redeem",
    amount: Math.abs(parsedAmount),
    balanceAfter: user.rewardPoints,
    title: parsedAmount > 0 ? "Admin coin adjustment" : "Admin coin deduction",
    description:
      note.trim() ||
      (parsedAmount > 0
        ? "Manual coin adjustment from store admin."
        : "Manual coin deduction from store admin."),
  });

  res.status(201).json({
    ok: true,
    user: {
      id: user._id,
      rewardPoints: user.rewardPoints,
      lifetimePoints: user.lifetimePoints,
    },
    transaction: serializeRewardTransaction(transaction),
  });
});

router.get("/subscriptions", async (_req, res) => {
  const subscriptions = await PullListItem.aggregate([
    { $match: { active: true } },
    {
      $group: {
        _id: "$seriesKey",
        title: { $first: "$title" },
        publisher: { $first: "$publisher" },
        subscriberCount: { $sum: 1 },
      },
    },
    { $sort: { subscriberCount: -1, title: 1 } },
  ]);

  res.json({ subscriptions });
});

export default router;
