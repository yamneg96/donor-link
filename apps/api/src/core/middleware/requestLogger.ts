import morgan from 'morgan';
import { logger } from '../../config';

const stream = {
  write: (message: string) => {
    logger.info(message.trim());
  },
};

/**
 * HTTP request logger middleware using Morgan + Winston.
 */
export const requestLogger = morgan(
  ':remote-addr :method :url :status :res[content-length] - :response-time ms',
  { stream }
);
