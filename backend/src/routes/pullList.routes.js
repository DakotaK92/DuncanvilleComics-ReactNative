import express from "express";
import User from "../models/user.js";
import PullListItem from "../models/pullListItem.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

const serializePullListItem = (item, matchingRelease) => ({
  id: item._id,
  title: item.title,
  issue: matchingRelease?.issueNumber ?? 0,
  publisher: item.publisher,
  price: matchingRelease?.price ?? 0,
  releaseDate: matchingRelease?.releaseDate ?? null,
  coverImageUrl: matchingRelease?.coverImageUrl ?? "",
  hasNewIssue: Boolean(matchingRelease),
  notes: item.notes,
  seriesKey: item.seriesKey,
});

router.get("/", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const pullListItems = await PullListItem.find({ user: user._id, active: true }).sort({
    title: 1,
  });

  const seriesKeys = pullListItems.map((item) => item.seriesKey);
  const releases = await WeeklyRelease.find({ seriesKey: { $in: seriesKeys } });
  const releasesBySeries = new Map(releases.map((release) => [release.seriesKey, release]));

  res.json({
    items: pullListItems.map((item) =>
      serializePullListItem(item, releasesBySeries.get(item.seriesKey))
    ),
  });
});

router.post("/", protectRoute, async (req, res) => {
  const { title, publisher, seriesKey, notes = "" } = req.body ?? {};

  if (!title || !publisher || !seriesKey) {
    return res.status(400).json({
      message: "title, publisher, and seriesKey are required",
    });
  }

  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = await PullListItem.findOneAndUpdate(
    { user: user._id, seriesKey },
    {
      $set: {
        title,
        publisher,
        notes,
        active: true,
      },
    },
    { upsert: true, new: true }
  );

  const matchingRelease = await WeeklyRelease.findOne({ seriesKey: item.seriesKey });

  res.status(201).json({
    item: serializePullListItem(item, matchingRelease),
  });
});

router.delete("/:id", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = await PullListItem.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Pull list item not found" });
  }

  res.status(204).send();
});

export default router;
