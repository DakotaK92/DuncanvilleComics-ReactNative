import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import WishListItem from "../models/wishListItem.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
  normalizeSeriesKey,
  readNumber,
  readObjectId,
  readOptionalString,
  readRequiredString,
} from "../utils/validation.js";

const router = express.Router();

const serializeWishListItem = (item) => ({
  id: item._id,
  title: item.title,
  issue: item.issue,
  publisher: item.publisher,
  price: item.price,
  notes: item.notes,
  seriesKey: item.seriesKey,
});

router.get("/", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const items = await WishListItem.find({ user: user._id, active: true }).sort({
    updatedAt: -1,
    title: 1,
  });

  res.json({ items: items.map(serializeWishListItem) });
});

router.post("/", protectRoute, asyncHandler(async (req, res) => {
  const title = readRequiredString(req.body?.title, { field: "title", max: 160 });
  const publisher = readRequiredString(req.body?.publisher, { field: "publisher", max: 80 });
  const rawSeriesKey = readRequiredString(req.body?.seriesKey, { field: "seriesKey", max: 160 });
  const seriesKey = normalizeSeriesKey(rawSeriesKey);
  const issue = readNumber(req.body?.issue ?? 1, { field: "issue", min: 0, max: 9999, integer: true });
  const price = readNumber(req.body?.price ?? 0, { field: "price", min: 0, max: 10000 });
  const notes = readOptionalString(req.body?.notes, { max: 500 });

  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = await WishListItem.findOneAndUpdate(
    { user: user._id, seriesKey },
    {
      $set: {
        title,
        issue,
        publisher,
        price,
        notes,
        seriesKey,
        active: true,
      },
    },
    { upsert: true, new: true }
  );

  res.status(201).json({ item: serializeWishListItem(item) });
}));

router.delete("/:id", protectRoute, async (req, res) => {
  const itemId = readObjectId(req.params.id, { field: "wish list item id" });
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = await WishListItem.findOneAndDelete({
    _id: itemId,
    user: user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Wish list item not found" });
  }

  res.status(204).send();
});

export default router;
