import User from "../models/user.js";
import { ENV } from "../config/env.js";

export const protectAdminRoute = async (req, res, next) => {
  const user = await User.findOne({ clerkUserId: req.userId });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  const normalizedEmail = String(user.email || "").trim().toLowerCase();
  const isAdmin = ENV.ADMIN_EMAILS.includes(normalizedEmail);

  if (!isAdmin) {
    return res.status(403).json({
      message: "Forbidden - you do not have admin access",
    });
  }

  req.adminUser = user;
  next();
};
