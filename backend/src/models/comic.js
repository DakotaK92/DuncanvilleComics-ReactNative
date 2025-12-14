import mongoose from "mongoose";

const ComicSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Comic ||
  mongoose.model("Comic", ComicSchema);
