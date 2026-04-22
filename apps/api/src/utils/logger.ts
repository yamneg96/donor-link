import winston from "winston";
import { config } from "../config/env";

const { combine, timestamp, errors, json, colorize, simple } = winston.format;

export const logger = winston.createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: combine(timestamp(), errors({ stack: true }), json()),
  defaultMeta: { service: "donorlink-api" },
  transports: [
    new winston.transports.Console({
      format:
        config.NODE_ENV === "production"
          ? combine(timestamp(), json())
          : combine(colorize(), simple()),
    }),
  ],
});