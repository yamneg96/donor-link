import { app } from './app';
import { env, connectDatabase, logger, disconnectDatabase } from './config';
import { registerEventHandlers } from './modules/events';
import { initializeJobScheduler } from './jobs';

async function bootstrap(): Promise<void> {
  try {
    console.log('\n======================================');
    console.log('🔄 Booting up DonorLink API...');
    console.log('======================================');
    logger.info('🚀 Starting DonorLink API Server...');

    // Connect to MongoDB
    console.log('-> Connecting to MongoDB...');
    await connectDatabase();
    console.log('✅ MongoDB connection successful');


    // Register domain event handlers
    registerEventHandlers();

    // Initialize scheduled jobs
    initializeJobScheduler();

    // Start HTTP server
    const PORT = env.PORT;
    const server = app.listen(PORT, () => {
      logger.info(`✅ DonorLink API running on port ${PORT}`);
      logger.info(`📡 Environment: ${env.NODE_ENV}`);
      logger.info(`🔗 Health: http://localhost:${PORT}/api/v1/health`);
    });

    // Graceful shutdown
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);

      server.close(async () => {
        logger.info('HTTP server closed');

        await disconnectDatabase();
        logger.info('✅ Graceful shutdown complete');
        process.exit(0);
      });

      // Force exit after 30s
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    process.on('unhandledRejection', (reason: unknown) => {
      logger.error('Unhandled Rejection:', reason);
    });

    process.on('uncaughtException', (error: Error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });
  } catch (error) {
    logger.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
