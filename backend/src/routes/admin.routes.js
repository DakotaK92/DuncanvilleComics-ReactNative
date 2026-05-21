import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import Reward from "../models/reward.js";
import RewardTransaction from "../models/rewardTransaction.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import PullListItem from "../models/pullListItem.js";
import { defaultEarnRules } from "../data/earnRules.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { protectAdminRoute } from "../middleware/admin.middleware.js";
import { parseWeeklyReleaseImport } from "../utils/weeklyReleaseImport.js";
import {
  normalizeSeriesKey,
  readBoolean,
  readDate,
  readEnum,
  readNumber,
  readObjectId,
  readOptionalString,
  readRequiredString,
} from "../utils/validation.js";

const router = express.Router();
const currentReleaseFilter = {
  $or: [{ status: "current" }, { status: { $exists: false } }],
};

router.use(protectRoute);
router.use(protectAdminRoute);

const serializeRelease = (release) => ({
  id: release._id,
  title: release.title,
  issue: release.issueNumber,
  publisher: release.publisher,
  price: release.price,
  releaseDate: release.releaseDate,
  coverImageUrl: release.coverImageUrl,
  seriesKey: release.seriesKey,
  status: release.status || "current",
  importedAt: release.importedAt,
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
  status: transaction.status,
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
      WeeklyRelease.countDocuments(currentReleaseFilter),
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

router.get("/earn-rules", async (_req, res) => {
  res.json({ earnRules: defaultEarnRules });
});

router.get("/weekly-releases", async (_req, res) => {
  const releases = await WeeklyRelease.find(currentReleaseFilter).sort({ releaseDate: 1, title: 1 });
  res.json({ releases: releases.map(serializeRelease) });
});

router.post("/weekly-releases/import/preview", asyncHandler(async (req, res) => {
  const csvText = readRequiredString(req.body?.csvText, {
    field: "csvText",
    max: 300000,
    preserveWhitespace: true,
  });
  const preview = parseWeeklyReleaseImport(csvText);

  res.json({
    preview: {
      summary: preview.summary,
      releases: preview.previewRows,
      errors: preview.rowErrors,
    },
  });
}));

router.post("/weekly-releases/import/publish", asyncHandler(async (req, res) => {
  const csvText = readRequiredString(req.body?.csvText, {
    field: "csvText",
    max: 300000,
    preserveWhitespace: true,
  });
  const preview = parseWeeklyReleaseImport(csvText);

  if (preview.rowErrors.length > 0) {
    return res.status(400).json({
      message: "Fix the invalid CSV rows before publishing this week.",
      preview: {
        summary: preview.summary,
        releases: preview.previewRows,
        errors: preview.rowErrors,
      },
    });
  }

  const importedAt = new Date();
  const importRows = preview.importRows.map((row) => ({
    ...row,
    importedAt,
  }));

  const archiveResult = await WeeklyRelease.updateMany(currentReleaseFilter, {
    $set: { status: "archived" },
  });

  const createdReleases = await WeeklyRelease.insertMany(importRows, { ordered: true });

  res.status(201).json({
    ok: true,
    archivedCount: archiveResult.modifiedCount ?? 0,
    importedCount: createdReleases.length,
    releases: createdReleases.map(serializeRelease),
  });
}));

router.post("/weekly-releases", asyncHandler(async (req, res) => {
  const title = readRequiredString(req.body?.title, { field: "title", max: 160 });
  const issue = readNumber(req.body?.issue, { field: "issue", min: 0, max: 9999, integer: true });
  const publisher = readRequiredString(req.body?.publisher, { field: "publisher", max: 80 });
  const price = readNumber(req.body?.price, { field: "price", min: 0, max: 10000 });
  const releaseDate = readDate(req.body?.releaseDate, { field: "releaseDate" });
  const coverImageUrl = readOptionalString(req.body?.coverImageUrl, { max: 500 });
  const seriesKey = normalizeSeriesKey(
    readOptionalString(req.body?.seriesKey, { max: 160 }) || title
  );

  const release = await WeeklyRelease.create({
    title,
    issueNumber: issue,
    publisher,
    price,
    releaseDate,
    coverImageUrl,
    seriesKey,
    status: "current",
    importedAt: new Date(),
  });

  res.status(201).json({ release: serializeRelease(release) });
}));

router.put("/weekly-releases/:id", asyncHandler(async (req, res) => {
  const releaseId = readObjectId(req.params.id, { field: "release id" });
  const title = readRequiredString(req.body?.title, { field: "title", max: 160 });
  const issue = readNumber(req.body?.issue, { field: "issue", min: 0, max: 9999, integer: true });
  const publisher = readRequiredString(req.body?.publisher, { field: "publisher", max: 80 });
  const price = readNumber(req.body?.price, { field: "price", min: 0, max: 10000 });
  const releaseDate = readDate(req.body?.releaseDate, { field: "releaseDate" });
  const coverImageUrl = readOptionalString(req.body?.coverImageUrl, { max: 500 });
  const seriesKey = normalizeSeriesKey(
    readOptionalString(req.body?.seriesKey, { max: 160 }) || title
  );

  const release = await WeeklyRelease.findByIdAndUpdate(
    releaseId,
    {
      $set: {
        title,
        issueNumber: issue,
        publisher,
        price,
        releaseDate,
        coverImageUrl,
        seriesKey,
      },
    },
    { new: true }
  );

  if (!release) {
    return res.status(404).json({ message: "Weekly release not found" });
  }

  res.json({ release: serializeRelease(release) });
}));

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

router.post("/rewards", asyncHandler(async (req, res) => {
  const title = readRequiredString(req.body?.title, { field: "title", max: 120 });
  const description = readOptionalString(req.body?.description, { max: 500 });
  const cost = readNumber(req.body?.cost, { field: "cost", min: 0, max: 100000 });
  const active = readBoolean(req.body?.active, { field: "active", defaultValue: true });
  const code = normalizeSeriesKey(readOptionalString(req.body?.code, { max: 120 }) || title);

  const reward = await Reward.create({
    title,
    description,
    cost,
    active,
    code,
  });

  res.status(201).json({ reward: serializeReward(reward) });
}));

router.put("/rewards/:id", asyncHandler(async (req, res) => {
  const rewardId = readObjectId(req.params.id, { field: "reward id" });
  const title = readRequiredString(req.body?.title, { field: "title", max: 120 });
  const description = readOptionalString(req.body?.description, { max: 500 });
  const cost = readNumber(req.body?.cost, { field: "cost", min: 0, max: 100000 });
  const active = readBoolean(req.body?.active, { field: "active", defaultValue: true });
  const code = normalizeSeriesKey(readOptionalString(req.body?.code, { max: 120 }) || title);

  const reward = await Reward.findByIdAndUpdate(
    rewardId,
    {
      $set: {
        title,
        description,
        cost,
        active,
        code,
      },
    },
    { new: true }
  );

  if (!reward) {
    return res.status(404).json({ message: "Reward not found" });
  }

  res.json({ reward: serializeReward(reward) });
}));

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

router.get("/users/:id/pull-list", asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.id, { field: "user id" });
  const user = await User.findById(userId);

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
}));

router.get("/users/:id/reward-activity", asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.id, { field: "user id" });
  const user = await User.findById(userId);

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
}));

router.post("/users/:id/reward-adjustments", asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.id, { field: "user id" });
  const parsedAmount = readNumber(req.body?.amount, {
    field: "amount",
    min: -100000,
    max: 100000,
    integer: true,
  });
  const note = readOptionalString(req.body?.note, { max: 500 });

  if (parsedAmount === 0) {
    return res.status(400).json({
      message: "A non-zero numeric amount is required.",
    });
  }

  const user = await User.findById(userId);

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
    status: parsedAmount > 0 ? "completed" : "fulfilled",
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
}));

router.post("/users/:id/reward-awards", asyncHandler(async (req, res) => {
  const userId = readObjectId(req.params.id, { field: "user id" });
  const earnRuleId = readRequiredString(req.body?.earnRuleId, { field: "earnRuleId", max: 80 });
  const note = readOptionalString(req.body?.note, { max: 500 });
  const rule = defaultEarnRules.find((item) => item.id === earnRuleId);

  if (!rule) {
    return res.status(400).json({ message: "A valid earn rule is required." });
  }

  const parsedAmount = readNumber(req.body?.amount ?? rule.points, {
    field: "amount",
    min: 1,
    max: 100000,
    integer: true,
  });

  const user = await User.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  user.rewardPoints += parsedAmount;
  user.lifetimePoints += parsedAmount;
  await user.save();

  const transaction = await RewardTransaction.create({
    user: user._id,
    type: "earn",
    status: "completed",
    amount: parsedAmount,
    balanceAfter: user.rewardPoints,
    title: rule.label,
    description: note.trim() || rule.description || "Store-awarded reward coins.",
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
}));

router.patch("/reward-activity/:id/status", asyncHandler(async (req, res) => {
  const activityId = readObjectId(req.params.id, { field: "reward activity id" });
  const status = readEnum(req.body?.status, ["pending", "fulfilled", "completed"], {
    field: "status",
  });

  const transaction = await RewardTransaction.findById(activityId);

  if (!transaction) {
    return res.status(404).json({ message: "Reward activity not found" });
  }

  transaction.status = status;
  await transaction.save();

  res.json({
    ok: true,
    transaction: serializeRewardTransaction(transaction),
  });
}));

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
