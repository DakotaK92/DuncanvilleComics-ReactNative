import { getAuth } from "@clerk/express";

export const protectRoute = (req, res, next) => {
  const auth = getAuth(req);

  if (!auth?.userId) {
    return res.status(401).json({
      message: "Unauthorized - you must be logged in",
    });
  }

  req.userId = auth.userId;
  next();
};
