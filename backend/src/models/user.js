import mongoose from "mongoose";

const BadgeSchema = new mongoose.Schema(
  {
    code: { type: String, required: true },
    label: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    clerkUserId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },
    firstName: {
      type: String,
      trim: true,
      default: "",
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    rewardPoints: {
      type: Number,
      default: 1250,
      min: 0,
    },
    lifetimePoints: {
      type: Number,
      default: 1250,
      min: 0,
    },
    badges: {
      type: [BadgeSchema],
      default: [
        { code: "first-issue", label: "First Issue" },
        { code: "collector", label: "Collector" },
      ],
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);
