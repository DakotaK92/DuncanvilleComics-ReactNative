import dotenv from "dotenv";

dotenv.config();

export const ENV = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI || "",
  CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY || "",
  CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY || "",
  ARCJET_KEY: process.env.ARCJET_KEY || "",
  ADMIN_EMAILS: (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean),
};
