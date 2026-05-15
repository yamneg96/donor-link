import mongoose from 'mongoose';
import { env } from './env';
import { logger } from './logger';

export async function connectDatabase(): Promise<void> {
  const MAX_RETRIES = 5;
  const RETRY_DELAY_MS = 5000;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      logger.info(`🗄️  Connecting to MongoDB (attempt ${attempt}/${MAX_RETRIES})...`);

      await mongoose.connect(env.MONGO_URI, {
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      logger.info('✅ MongoDB connected successfully');

      // Connection event handlers
      mongoose.connection.on('error', (err) => {
        logger.error('MongoDB connection error:', err);
      });

      mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB disconnected');
      });

      mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB reconnected');
      });

      return;
    } catch (error) {
      logger.error(`MongoDB connection attempt ${attempt} failed:`, error);

      if (attempt === MAX_RETRIES) {
        logger.error('❌ Failed to connect to MongoDB after maximum retries');
        process.exit(1);
      }

      logger.info(`Retrying in ${RETRY_DELAY_MS / 1000}s...`);
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    logger.info('MongoDB disconnected gracefully');
  } catch (error) {
    logger.error('Error disconnecting from MongoDB:', error);
  }
}
