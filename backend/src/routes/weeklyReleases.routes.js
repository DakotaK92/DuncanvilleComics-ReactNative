import express from "express";
import WeeklyRelease from "../models/weeklyRelease.js";

const router = express.Router();

router.get("/", async (_req, res) => {
  const releases = await WeeklyRelease.find().sort({ releaseDate: 1, title: 1 });

  res.json({
    releases: releases.map((release) => ({
      id: release._id,
      title: release.title,
      issue: release.issueNumber,
      publisher: release.publisher,
      price: release.price,
      releaseDate: release.releaseDate,
      coverImageUrl: release.coverImageUrl,
      seriesKey: release.seriesKey,
    })),
  });
});

export default router;
