import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors, json } = winston.format;

const logFormat = printf(({ level, message, timestamp, stack, ...meta }) => {
  let log = `${timestamp} [${level}]: ${stack || message}`;
  if (Object.keys(meta).length > 0) {
    log += ` ${JSON.stringify(meta)}`;
  }
  return log;
});

// Determine log level from env (avoid importing env.ts to prevent circular deps)
const logLevel = process.env.LOG_LEVEL || 'info';
const logFile = process.env.LOG_FILE || './logs/app.log';

// CRITICAL VERCEL FIX: Check if running inside Vercel or production serverless container
const isServerless = process.env.VERCEL === '1' || process.env.NOW_REGION || process.env.NODE_ENV === 'production';

// Build transports array dynamically based on infrastructure environment
const coreTransports: winston.transport[] = [
  // Console transport — Always active, safe for both local dev and serverless tracking
  new winston.transports.Console({
    format: isServerless
      ? combine(timestamp(), json()) // Structured JSON is cleaner for Vercel's log dashboard routing
      : combine(colorize(), logFormat),
  })
];

// Only append local disk logging operations if safely running on a persistent server (Monolith/Docker)
if (!isServerless) {
  coreTransports.push(
    // File transport - errors
    new winston.transports.File({
      filename: path.join(path.dirname(logFile), 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // File transport - combined
    new winston.transports.File({
      filename: logFile,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    })
  );
}

export const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'donorlink-api' },
  transports: coreTransports,
});

// Handle unhandled exceptions gracefully depending on environment
if (isServerless) {
  // On Vercel, forward exceptions to the stream instead of a file
  logger.exceptions.handle(
    new winston.transports.Console({
      format: combine(timestamp(), json())
    })
  );
} else {
  // On local machines/persistent servers, log them natively to disk
  logger.exceptions.handle(
    new winston.transports.File({
      filename: path.join(path.dirname(logFile), 'exceptions.log'),
    })
  );
}