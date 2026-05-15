import path from 'path';
import fs from 'fs';
import { env } from './env';
import { logger } from './logger';

export interface StorageConfig {
  type: 'local' | 's3';
  localPath: string;
  s3?: {
    bucket: string;
    region: string;
    accessKey: string;
    secretKey: string;
  };
}

export function getStorageConfig(): StorageConfig {
  const config: StorageConfig = {
    type: env.STORAGE_TYPE,
    localPath: path.resolve(env.STORAGE_PATH),
  };

  // Ensure local storage directory exists
  if (config.type === 'local') {
    if (!fs.existsSync(config.localPath)) {
      fs.mkdirSync(config.localPath, { recursive: true });
      logger.info(`📁 Created storage directory: ${config.localPath}`);
    }
  }

  if (config.type === 's3' && env.S3_BUCKET) {
    config.s3 = {
      bucket: env.S3_BUCKET,
      region: env.S3_REGION || 'us-east-1',
      accessKey: env.S3_ACCESS_KEY || '',
      secretKey: env.S3_SECRET_KEY || '',
    };
  }

  return config;
}
