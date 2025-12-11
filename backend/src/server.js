import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express();

app.use(cors());
app.use(express.json());

app.use(arcjetMiddleware);
app.use(clerkMiddleware({ apiKey: ENV.CLERK_API_KEY }));

app.get("/", (req, res) => res.send("Server is running..."));

// error handling middleware
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err.message || "Internal server error" });
});

const startServer = async () => {
  try {
    await connectDB();

    // listen for local development
    if (ENV.NODE_ENV !== "production") {
      app.listen(ENV.PORT, () => console.log("Server is up and running on PORT:", ENV.PORT));
    }
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();