import mongoose from "mongoose";
import { ENV } from "./env.js";

mongoose.set("bufferCommands", false);

let isDbConnected = false;

export const connectDB = async () => {
  try {
    await mongoose.connect(ENV.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isDbConnected = true;
    console.log("Connected to MongoDB successfully.");
  } catch (error) {
    isDbConnected = false;
    console.log("Error connecting to MongoDB:", error.message);
    throw error;
  }
};

export const databaseReady = () => isDbConnected;
