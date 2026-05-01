import mongoose from "mongoose";

const RewardTransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["earn", "redeem"],
      required: true,
    },
    status: {
      type: String,
      enum: ["completed", "pending", "fulfilled"],
      default: "completed",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    balanceAfter: {
      type: Number,
      required: true,
      min: 0,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    reward: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reward",
      default: null,
    },
  },
  { timestamps: true }
);

export default mongoose.models.RewardTransaction ||
  mongoose.model("RewardTransaction", RewardTransactionSchema);
