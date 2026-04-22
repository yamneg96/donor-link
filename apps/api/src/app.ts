import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import { config } from "./config/env";
import { logger } from "./utils/logger";
import { apiLimiter } from "./middleware/rateLimiter";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

import authRoutes from "./routes/auth";
import donorRoutes from "./routes/donor";
import hospitalRoutes from "./routes/hospital";
import requestRoutes from "./routes/request";
import donationRoutes from "./routes/donation";
import analyticsRoutes from "./routes/analytics";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: [config.WEB_APP_URL, config.MOBILE_APP_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(
  morgan("combined", {
    stream: { write: (msg) => logger.http(msg.trim()) },
    skip: () => config.NODE_ENV === "test",
  })
);

app.use(`/api/${config.API_VERSION}`, apiLimiter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok", version: config.API_VERSION, env: config.NODE_ENV });
});

const base = `/api/${config.API_VERSION}`;
app.use(`${base}/auth`, authRoutes);
app.use(`${base}/donors`, donorRoutes);
app.use(`${base}/hospitals`, hospitalRoutes);
app.use(`${base}/requests`, requestRoutes);
app.use(`${base}/donations`, donationRoutes);
app.use(`${base}/analytics`, analyticsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;