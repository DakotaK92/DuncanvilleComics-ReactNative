import mongoose from "mongoose";
import Comic from "../../backend/src/models/comic";

await mongoose.connect(config.env.MONGO_URI);

await Comic.insertMany([
  {
    title: "Amazing Fantasy #15",
    imageUrl: "https://...",
  },
  {
    title: "Avengers #1",
    imageUrl: "https://...",
  },
]);

console.log("Comics added");
process.exit();
