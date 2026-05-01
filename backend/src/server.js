import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import { ENV } from './config/env.js';
import { connectDB, databaseReady } from './config/db.js';
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';
import { seedDefaults } from './utils/seed.js';
import usersRoutes from './routes/users.routes.js';
import rewardsRoutes from './routes/rewards.routes.js';
import pullListRoutes from './routes/pullList.routes.js';
import wishListRoutes from './routes/wishList.routes.js';
import weeklyReleasesRoutes from './routes/weeklyReleases.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { canSendStoreEmail } from './utils/resend.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(arcjetMiddleware);
app.use(clerkMiddleware({ secretKey: ENV.CLERK_SECRET_KEY }));

app.get("/", (_req, res) => res.send("Server is running..."));
app.get("/api/health", (_req, res) =>
  res.json({
    ok: true,
    databaseReady: databaseReady(),
    version: ENV.APP_VERSION,
    deployCommit: ENV.DEPLOY_COMMIT,
    emailStoreRouteEnabled: true,
    resendConfigured: canSendStoreEmail(),
    resendConfig: {
      hasApiKey: Boolean(ENV.RESEND_API_KEY),
      hasFromEmail: Boolean(ENV.RESEND_FROM_EMAIL),
      hasStoreEmail: Boolean(ENV.STORE_EMAIL),
    },
  })
);

app.use("/api", (req, res, next) => {
  if (!databaseReady() && req.path !== "/health") {
    return res.status(503).json({
      error: "Database unavailable",
      message:
        "The backend is up, but MongoDB is not connected yet. Check your backend terminal for the database error.",
    });
  }

  next();
});

app.use("/api/users", usersRoutes);
app.use("/api/rewards", rewardsRoutes);
app.use("/api/pull-list", pullListRoutes);
app.use("/api/wish-list", wishListRoutes);
app.use("/api/weekly-releases", weeklyReleasesRoutes);
app.use("/api/admin", adminRoutes);

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  app.listen(ENV.PORT, () =>
    console.log("Server is up and running on PORT:", ENV.PORT)
  );

  try {
    await connectDB();
    await seedDefaults();
  } catch (error) {
    console.error("Backend started without database access:", error.message);
  }
};

startServer();
