import express from "express";
import User from "../models/user.js";
import WishListItem from "../models/wishListItem.js";
import { protectRoute } from "../middleware/auth.middleware.js";

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

router.post("/", protectRoute, async (req, res) => {
  const { title, issue = 1, publisher, price = 0, seriesKey, notes = "" } = req.body ?? {};

  if (!title || !publisher || !seriesKey) {
    return res.status(400).json({
      message: "title, publisher, and seriesKey are required",
    });
  }

  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const item = await WishListItem.findOneAndUpdate(
    { user: user._id, seriesKey },
    {
      $set: {
        title,
        issue: Number(issue),
        publisher,
        price: Number(price),
        notes,
        active: true,
      },
    },
    { upsert: true, new: true }
  );

  res.status(201).json({ item: serializeWishListItem(item) });
});

router.delete("/:id", protectRoute, async (req, res) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = await WishListItem.findOneAndDelete({
    _id: req.params.id,
    user: user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Wish list item not found" });
  }

  res.status(204).send();
});

export default router;
