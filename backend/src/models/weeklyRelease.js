import mongoose from "mongoose";

const WeeklyReleaseSchema = new mongoose.Schema(
  {
    seriesKey: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    issueNumber: {
      type: Number,
      required: true,
      min: 0,
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
    },
    coverImageUrl: {
      type: String,
      trim: true,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["current", "archived"],
      default: "current",
      index: true,
    },
    importedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.WeeklyRelease ||
  mongoose.model("WeeklyRelease", WeeklyReleaseSchema);
