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
      const readyBadge = item.hasNewIssue
        ? `<span style="background-color:#dc2626;color:#ffffff;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px;letter-spacing:0.5px;white-space:nowrap;">Ready</span>`
        : "";
      const noteText = item.notes
        ? `<div style="font-size:11px;color:#9ca3af;margin-top:3px;">${escapeHtml(item.notes)}</div>`
        : "";
      return `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 14px;border-radius:12px;background-color:#f9fafb;margin-bottom:8px;border:1px solid #f0f0f0;">
        <div>
          <div style="font-size:14px;font-weight:700;color:#111827;">${escapeHtml(item.title)}${escapeHtml(issueText)}</div>
          <div style="font-size:12px;color:#6b7280;margin-top:2px;">${escapeHtml(item.publisher)}</div>
          ${noteText}
        </div>
        ${readyBadge}
      </div>`;
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
      <div style="margin:0;background-color:#1a1a1a;background-image:url('${ENV.BASE_URL}/public/imagebackground.png');background-size:cover;background-position:center;padding:32px 16px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Arial,sans-serif;">
        <div style="margin:0 auto;max-width:600px;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.35);">

          <div style="background-color:#dc2626;padding:28px 32px;">
            <div style="font-size:11px;letter-spacing:2px;text-transform:uppercase;color:#fca5a5;margin-bottom:10px;">Duncanville Comics</div>
            <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">Pull List Request</h1>
            <p style="margin:10px 0 0;font-size:14px;color:#fecaca;line-height:1.5;">
              ${escapeHtml(customerName)} sent their ${filter === "ready" ? "ready-this-week pull list" : "full pull list"} for in-store prep.
            </p>
          </div>

          <div style="background-color:#fff1f2;padding:16px 32px;border-bottom:1px solid #fecaca;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="padding:0 12px 0 0;width:33%;">
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;">Customer</div>
                  <div style="margin-top:4px;font-size:15px;font-weight:700;color:#111827;">${escapeHtml(customerName)}</div>
                </td>
                <td style="padding:0 12px;width:33%;border-left:1px solid #fecaca;">
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;padding-left:12px;">Titles</div>
                  <div style="margin-top:4px;font-size:15px;font-weight:700;color:#dc2626;padding-left:12px;">${itemsToSend.length}</div>
                </td>
                <td style="padding:0 0 0 12px;width:33%;border-left:1px solid #fecaca;">
                  <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:#9ca3af;padding-left:12px;">Ready This Week</div>
                  <div style="margin-top:4px;font-size:15px;font-weight:700;color:#dc2626;padding-left:12px;">${readyItemsCount}</div>
                </td>
              </tr>
            </table>
          </div>

          <div style="background-color:#ffffff;padding:28px 32px;">
            <div style="background-color:#f9fafb;border-left:3px solid #dc2626;border-radius:8px;padding:14px 16px;margin-bottom:24px;">
              <div style="font-size:13px;color:#374151;line-height:1.8;">
                <div><span style="color:#9ca3af;">Email:</span> ${escapeHtml(user.email || "No email on file")}</div>
                <div><span style="color:#9ca3af;">View:</span> ${filter === "ready" ? "Ready This Week" : "Full Pull List"}</div>
              </div>
            </div>

            <div style="font-size:11px;text-transform:uppercase;letter-spacing:1.5px;color:#9ca3af;margin-bottom:12px;">Requested Books</div>
            ${htmlItems}
          </div>

          <div style="background-color:#f3f4f6;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af;">
            Sent from the Duncanville Comics app
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
