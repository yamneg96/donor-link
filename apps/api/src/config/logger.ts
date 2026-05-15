import winston from 'winston';
import path from 'path';

const { combine, timestamp, printf, colorize, errors } = winston.format;

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

export const logger = winston.createLogger({
  level: logLevel,
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    errors({ stack: true }),
    logFormat
  ),
  defaultMeta: { service: 'donorlink-api' },
  transports: [
    // Console transport
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
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
    }),
  ],
});

// Handle unhandled rejections
logger.exceptions.handle(
  new winston.transports.File({
    filename: path.join(path.dirname(logFile), 'exceptions.log'),
  })
);
