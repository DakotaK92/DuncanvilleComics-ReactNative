import mongoose from "mongoose";

const PullListItemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    seriesKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

PullListItemSchema.index({ user: 1, seriesKey: 1 }, { unique: true });

export default mongoose.models.PullListItem ||
  mongoose.model("PullListItem", PullListItemSchema);
