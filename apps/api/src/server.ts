import app from './app';
import { env, connectDatabase, logger, disconnectDatabase } from './config';
import { registerEventHandlers } from './modules/events';
import { initializeJobScheduler } from './jobs';
import { Server as SocketIOServer } from 'socket.io';
import { initializeSocketManager } from './modules/realtime';

let isReady = false;

const HOST = '0.0.0.0';
// Dedicated operational warmup block optimized for serverless executions
export async function initializeApplication(): Promise<void> {
  if (isReady) return;

  try {
    logger.info('🔄 Warmup: Initializing DonorLink Core Systems...');
    
    // Connect to MongoDB
    await connectDatabase();
    logger.info('✅ MongoDB pipeline established successfully.');

    // Register domain event handlers
    registerEventHandlers();

    // Only run background processing loops if executing outside a serverless edge context
    if (process.env.VERCEL !== '1') {
      initializeJobScheduler();
      logger.info('⏰ Enterprise internal job scheduler initialized.');
    }

    isReady = true;
  } catch (error) {
    logger.error('❌ Application critical initialization block failed:', error);
    throw error;
  }
}

// Classical Standalone Runtime Engine (Triggers only for local monolithic or Docker runs)
if (process.env.VERCEL !== '1') {
  async function bootstrap(): Promise<void> {
    try {
      console.log('\n======================================');
      console.log('🔄 Booting up DonorLink API Monolith...');
      console.log('======================================');
      
      await initializeApplication();

      const PORT = env.PORT || 8080;
      const server = app.listen(PORT, `${HOST}`, () => {
        logger.info(`✅ DonorLink API running on all interfaces (0.0.0.0) at port ${PORT}`);
        logger.info(`📡 Target Operational Environment: ${env.NODE_ENV}`);
        logger.info(`🔗 Health Interface: http://${HOST}:${PORT}/api/v1/health`);
      });

      const io = new SocketIOServer(server, {
        cors: {
          origin: process.env.NODE_ENV === 'production'
            ? ['https://donorlink.et', 'https://admin.donorlink.et', 'https://donor-link-v1.vercel.app', 'http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175']
            : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:5175', 'http://localhost:8081', 'https://donor-link-v1.vercel.app'],
          credentials: true,
        }
      });
      initializeSocketManager(io);

      // Standard infrastructure process termination watchers
      const shutdown = async (signal: string) => {
        logger.info(`\n${signal} intercepted. Graceful drainage executing...`);
        server.close(async () => {
          logger.info('HTTP entry gateway dropped.');
          await disconnectDatabase();
          logger.info('✅ Database context safe separation completed. System exiting clean.');
          process.exit(0);
        });

        setTimeout(() => {
          logger.error('Forced infrastructure clearance triggered after 30s limit.');
          process.exit(1);
        }, 30000);
      };

      process.on('SIGTERM', () => shutdown('SIGTERM'));
      process.on('SIGINT', () => shutdown('SIGINT'));
    } catch (error) {
      logger.error('❌ Failed execution on platform bootstrap:', error);
      process.exit(1);
    }
  }

  bootstrap();
}

// Global Runtime Intercept catch routines (Valid solely for standalone processes)
if (process.env.VERCEL !== '1') {
  process.on('unhandledRejection', (reason: unknown) => {
    logger.error('Unhandled System Promise Rejection caught:', reason);
  });

  process.on('uncaughtException', (error: Error) => {
    logger.error('Uncaught Native Runtime Exception intercepted:', error);
    process.exit(1);
  });
}