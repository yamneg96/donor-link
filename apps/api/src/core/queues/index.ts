import { logger } from '../../config/logger';

/**
 * Queue Infrastructure Stubs
 * Uses BullMQ interface but acts as an in-memory stub for development.
 * In production, this would connect to Redis via IOREDIS.
 */

export class QueueStub {
  private queueName: string;

  constructor(queueName: string) {
    this.queueName = queueName;
  }

  async add(jobName: string, payload: any, options: any = {}) {
    logger.info(`[Queue: ${this.queueName}] Job '${jobName}' added with payload`, { payload, options });
    return { id: Math.random().toString(36).substr(2, 9), name: jobName, data: payload };
  }
}

export const notificationQueue = new QueueStub('notifications');
export const emailQueue = new QueueStub('emails');
export const syncQueue = new QueueStub('sync');
export const reportQueue = new QueueStub('reports');

export function startWorkers() {
  logger.info('👷 Worker nodes active (Stub mode). Listening to queues: notifications, emails, sync, reports.');
}
