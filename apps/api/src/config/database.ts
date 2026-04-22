import mongoose from "mongoose";
import { config } from "./env";
import { logger } from "../utils/logger";

const RETRY_DELAY = 5000;
const MAX_RETRIES = 5;

export async function connectDB(retries = MAX_RETRIES): Promise<void> {
  try {
    await mongoose.connect(config.MONGODB_URI, {
      dbName: "donorlink",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });

    logger.info("✅  MongoDB Atlas connected");

    mongoose.connection.on("error", (err) => {
      logger.error("MongoDB connection error", { error: err.message });
    });

    mongoose.connection.on("disconnected", () => {
      logger.warn("MongoDB disconnected — attempting reconnect");
    });
  } catch (err) {
    if (retries > 0) {
      logger.warn(`MongoDB connection failed — retrying in ${RETRY_DELAY / 1000}s (${retries} left)`);
      await new Promise((res) => setTimeout(res, RETRY_DELAY));
      return connectDB(retries - 1);
    }
    logger.error("MongoDB connection exhausted", { error: (err as Error).message });
    process.exit(1);
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect();
  logger.info("MongoDB disconnected");
}