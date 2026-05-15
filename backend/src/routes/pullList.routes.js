import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import PullListItem from "../models/pullListItem.js";
import WeeklyRelease from "../models/weeklyRelease.js";
import { ENV } from "../config/env.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { canSendStoreEmail, getResendClient } from "../utils/resend.js";
import {
  normalizeSeriesKey,
  readEnum,
  readObjectId,
  readOptionalString,
  readRequiredString,
} from "../utils/validation.js";

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

router.post("/", protectRoute, asyncHandler(async (req, res) => {
  const title = readRequiredString(req.body?.title, { field: "title", max: 160 });
  const publisher = readRequiredString(req.body?.publisher, { field: "publisher", max: 80 });
  const rawSeriesKey = readRequiredString(req.body?.seriesKey, { field: "seriesKey", max: 160 });
  const notes = readOptionalString(req.body?.notes, { max: 500 });
  const seriesKey = normalizeSeriesKey(rawSeriesKey);

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
        seriesKey,
        active: true,
      },
    },
    { upsert: true, new: true }
  );

  const matchingRelease = await WeeklyRelease.findOne({ seriesKey: item.seriesKey });

  res.status(201).json({
    item: serializePullListItem(item, matchingRelease),
  });
}));

router.delete("/:id", protectRoute, async (req, res) => {
  const itemId = readObjectId(req.params.id, { field: "pull list item id" });
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const deleted = await PullListItem.findOneAndDelete({
    _id: itemId,
    user: user._id,
  });

  if (!deleted) {
    return res.status(404).json({ message: "Pull list item not found" });
  }

  res.status(204).send();
});

router.post("/email-store", protectRoute, asyncHandler(async (req, res) => {
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

  const filter = readEnum(req.body?.filter ?? "all", ["all", "ready"], {
    field: "filter",
  });

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
  const readyItemsCount = itemsToSend.filter((item) => item.hasNewIssue).length;
  const subject =
    filter === "ready"
      ? `Duncanville Comics Pull List: ${customerName} (${itemsToSend.length} ready this week)`
      : `Duncanville Comics Pull List: ${customerName} (${itemsToSend.length} titles)`;

  const textLines = [
    "Duncanville Comics pull list request",
    "",
    `Customer: ${customerName}`,
    `Email: ${user.email || "No email on file"}`,
    `View: ${filter === "ready" ? "Ready This Week" : "Full Pull List"}`,
    `Titles included: ${itemsToSend.length}`,
    `Ready this week: ${readyItemsCount}`,
    "",
    "Please pull these books for in-store pickup:",
    "",
    ...itemsToSend.map((item) => {
      const issueText = item.issue ? ` #${item.issue}` : "";
      const readyTag = item.hasNewIssue ? " - ready this week" : "";
      const noteText = item.notes ? ` (Notes: ${item.notes})` : "";
      return `- ${item.title}${issueText} (${item.publisher})${readyTag}${noteText}`;
    }),
    "",
    "Sent from the Duncanville Comics app.",
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
      <div style="margin:0; background-color:#111111; padding:24px; font-family:Arial, Helvetica, sans-serif; color:#111111;">
        <div style="margin:0 auto; max-width:640px; overflow:hidden; border-radius:20px; background-color:#ffffff;">
          <div style="background-color:#dc2626; padding:24px 28px; color:#ffffff;">
            <div style="font-size:12px; letter-spacing:1.4px; text-transform:uppercase; opacity:0.9;">Duncanville Comics</div>
            <h1 style="margin:8px 0 0; font-size:28px; line-height:1.2;">Pull List Request</h1>
            <p style="margin:10px 0 0; font-size:14px; line-height:1.6; color:#fee2e2;">
              A customer sent their ${
                filter === "ready" ? "ready-this-week pull list" : "full pull list"
              } for in-store prep.
            </p>
          </div>

          <div style="padding:24px 28px;">
            <div style="display:grid; grid-template-columns:repeat(3, minmax(0, 1fr)); gap:12px; margin-bottom:24px;">
              <div style="border-radius:14px; background-color:#f5f5f5; padding:16px;">
                <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#737373;">Customer</div>
                <div style="margin-top:6px; font-size:16px; font-weight:700; color:#111111;">${escapeHtml(customerName)}</div>
              </div>
              <div style="border-radius:14px; background-color:#f5f5f5; padding:16px;">
                <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#737373;">Titles</div>
                <div style="margin-top:6px; font-size:16px; font-weight:700; color:#111111;">${itemsToSend.length}</div>
              </div>
              <div style="border-radius:14px; background-color:#f5f5f5; padding:16px;">
                <div style="font-size:12px; text-transform:uppercase; letter-spacing:1px; color:#737373;">Ready This Week</div>
                <div style="margin-top:6px; font-size:16px; font-weight:700; color:#111111;">${readyItemsCount}</div>
              </div>
            </div>

            <div style="margin-bottom:20px; border-radius:16px; border:1px solid #e5e5e5; padding:18px 20px;">
              <div style="font-size:13px; line-height:1.7; color:#404040;">
                <div><strong>Customer:</strong> ${escapeHtml(customerName)}</div>
                <div><strong>Email:</strong> ${escapeHtml(user.email || "No email on file")}</div>
                <div><strong>View:</strong> ${
                  filter === "ready" ? "Ready This Week" : "Full Pull List"
                }</div>
              </div>
            </div>

            <h2 style="margin:0 0 12px; font-size:18px; color:#111111;">Requested Books</h2>
            <ul style="margin:0; padding-left:20px; color:#262626; line-height:1.8;">
              ${htmlItems}
            </ul>
          </div>

          <div style="border-top:1px solid #e5e5e5; background-color:#fafafa; padding:18px 28px; font-size:12px; line-height:1.6; color:#737373;">
            Sent from the Duncanville Comics app.
          </div>
        </div>
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
}));

export default router;
