import express from "express";
import User from "../models/user.js";
import PullListItem from "../models/pullListItem.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import { ENV } from "../config/env.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { canSendStoreEmail, getResendClient } from "../utils/resend.js";

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

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

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

router.post("/email-store", protectRoute, async (req, res) => {
  if (!canSendStoreEmail()) {
    return res.status(503).json({
      message:
        "Store email is not configured yet. Add Resend and store email settings on the backend first.",
    });
  }

  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const filter = req.body?.filter === "ready" ? "ready" : "all";

  const pullListItems = await PullListItem.find({ user: user._id, active: true }).sort({
    title: 1,
  });

  if (!pullListItems.length) {
    return res.status(400).json({ message: "Pull list is empty" });
  }

  const seriesKeys = pullListItems.map((item) => item.seriesKey);
  const releases = await WeeklyRelease.find({ seriesKey: { $in: seriesKeys } });
  const releasesBySeries = new Map(releases.map((release) => [release.seriesKey, release]));

  const serializedItems = pullListItems.map((item) =>
    serializePullListItem(item, releasesBySeries.get(item.seriesKey))
  );

  const itemsToSend =
    filter === "ready"
      ? serializedItems.filter((item) => item.hasNewIssue)
      : serializedItems;

  if (!itemsToSend.length) {
    return res.status(400).json({
      message:
        filter === "ready"
          ? "There are no pull-list books ready this week."
          : "Pull list is empty",
    });
  }

  const customerName =
    `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown customer";
  const subject =
    filter === "ready"
      ? `${customerName} - weekly pull list request`
      : `${customerName} - pull list request`;

  const textLines = [
    "Please pull these books for in-store pickup:",
    "",
    ...itemsToSend.map((item) => {
      const issueText = item.issue ? ` #${item.issue}` : "";
      const readyTag = item.hasNewIssue ? " - ready this week" : "";
      const noteText = item.notes ? ` (Notes: ${item.notes})` : "";
      return `- ${item.title}${issueText} (${item.publisher})${readyTag}${noteText}`;
    }),
    "",
    `Customer: ${customerName}`,
    `Email: ${user.email || "No email on file"}`,
  ];

  const htmlItems = itemsToSend
    .map((item) => {
      const issueText = item.issue ? ` #${item.issue}` : "";
      const readyTag = item.hasNewIssue ? " <em>(ready this week)</em>" : "";
      const noteText = item.notes
        ? ` <span>(Notes: ${escapeHtml(item.notes)})</span>`
        : "";

      return `<li><strong>${escapeHtml(item.title)}${escapeHtml(issueText)}</strong> (${escapeHtml(item.publisher)})${readyTag}${noteText}</li>`;
    })
    .join("");

  const resend = getResendClient();

  const { data, error } = await resend.emails.send({
    from: ENV.RESEND_FROM_EMAIL,
    to: [ENV.STORE_EMAIL],
    subject,
    replyTo: user.email || undefined,
    text: textLines.join("\n"),
    html: `
      <div>
        <p>Please pull these books for in-store pickup:</p>
        <ul>${htmlItems}</ul>
        <p><strong>Customer:</strong> ${escapeHtml(customerName)}<br />
        <strong>Email:</strong> ${escapeHtml(user.email || "No email on file")}</p>
      </div>
    `,
  });

  if (error) {
    return res.status(502).json({
      message: error.message || "Failed to send pull list email",
    });
  }

  res.json({
    ok: true,
    emailId: data?.id || null,
    sentTo: ENV.STORE_EMAIL,
  });
});

export default router;
