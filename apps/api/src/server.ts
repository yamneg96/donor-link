import app from "./app";
import { config } from "./config/env";
import { connectDB, disconnectDB } from "./config/database";
import { logger } from "./utils/logger";

async function bootstrap() {
  await connectDB();

  const server = app.listen(config.PORT, () => {
    logger.info(`DonorLink API running on port ${config.PORT} [${config.NODE_ENV}]`);
  });

  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — shutting down`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000);
  };

  process.on("SIGTERM", () => shutdown("SIGTERM"));
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("unhandledRejection", (reason) => logger.error("Unhandled rejection", { reason }));
  process.on("uncaughtException", (err) => {
    logger.error("Uncaught exception", { error: err.message });
    process.exit(1);
  });
}

bootstrap();